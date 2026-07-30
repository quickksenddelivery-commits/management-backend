const { prisma } = require('../config/database');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const { getCoin, toUSD, toCrypto, roundCrypto } = require('../config/coins');
const { generateQRCode, generateReference, serializeOrder } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Create an order from cart items. Validates availability, reserves seats by
 * decrementing tier availability, computes the crypto total, and returns the
 * payment instructions. Status starts as `pending` until payment is confirmed.
 */
exports.create = asyncHandler(async (req, res, next) => {
  const { items, attendeeName, attendeeEmail, coin: coinSymbol } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError('Order must contain at least one item', 400));
  }

  const coin = getCoin(coinSymbol);
  if (!coin) return next(new AppError('Unsupported payment coin', 400));

  const orderItems = [];
  let usdTotal = 0;
  const reservations = [];

  for (const line of items) {
    const { eventId, tierId, quantity } = line;
    const qty = parseInt(quantity, 10);
    if (!eventId || !tierId || !qty || qty < 1) {
      return next(new AppError('Each item needs eventId, tierId and a quantity ≥ 1', 400));
    }

    const event = await prisma.event.findUnique({ where: { id: eventId }, include: { ticketTiers: true } });
    if (!event) return next(new AppError(`Event ${eventId} not found`, 404));

    const tier = event.ticketTiers.find((t) => t.id === tierId);
    if (!tier) return next(new AppError(`Ticket tier ${tierId} not found`, 404));

    if (tier.available < qty) {
      return next(new AppError(`Only ${tier.available} '${tier.name}' tickets left for ${event.title}`, 409));
    }

    orderItems.push({
      eventId,
      tierId,
      tierName: tier.name,
      eventTitle: event.title,
      eventDate: event.date,
      eventVenue: event.venue,
      eventCity: event.city,
      eventImage: event.image,
      quantity: qty,
      price: tier.price,
      currency: tier.currency,
    });

    usdTotal += toUSD(tier.price * qty, tier.currency);
    reservations.push({ eventId, tierId, qty });
  }

  // Reserve seats atomically per tier (guarded so we never oversell).
  const reserved = [];
  for (const r of reservations) {
    const affected = await prisma.$executeRaw`
      UPDATE "TicketTier" SET available = available - ${r.qty}
      WHERE id = ${r.tierId} AND available >= ${r.qty}
    `;
    if (affected === 0) {
      // A concurrent purchase grabbed the last seats — roll back what we reserved.
      await rollbackReservations(reserved);
      return next(new AppError('Some tickets just sold out. Please review your cart', 409));
    }
    reserved.push(r);
  }

  usdTotal = Number(usdTotal.toFixed(2));
  const cryptoAmount = roundCrypto(toCrypto(usdTotal, coin), coin);

  const order = await prisma.order.create({
    data: {
      reference: generateReference('ORD'),
      userId: req.user.id,
      attendeeName,
      attendeeEmail,
      coinSymbol: coin.symbol,
      coinNetwork: coin.network,
      coinAddress: coin.address,
      usdTotal,
      cryptoAmount,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  logger.info(`Order created ${order.reference} — user ${req.user.id} — $${usdTotal}`);

  res.status(201).json({
    status: 'success',
    data: {
      order: serializeOrder(order),
      payment: {
        coin: coin.symbol,
        network: coin.network,
        address: coin.address,
        usdTotal,
        cryptoAmount,
      },
    },
  });
});

async function rollbackReservations(reservations) {
  for (const r of reservations) {
    await prisma.$executeRaw`
      UPDATE "TicketTier" SET available = available + ${r.qty} WHERE id = ${r.tierId}
    `;
  }
}

/**
 * Confirm payment for an order. In Stage 1 this trusts the supplied tx hash
 * (a real on-chain verification step replaces this in Stage 2). On success it
 * marks the order paid and issues one Ticket per seat.
 */
exports.confirm = asyncHandler(async (req, res, next) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { items: true },
  });
  if (!order) return next(new AppError('Order not found', 404));

  if (order.status === 'paid') {
    const existing = await prisma.ticket.findMany({ where: { orderId: order.id } });
    return res.json({ status: 'success', data: { order: serializeOrder(order), tickets: existing } });
  }
  if (order.status !== 'pending') {
    return next(new AppError(`Order cannot be paid (status: ${order.status})`, 409));
  }

  const paidAt = new Date();
  const ticketRows = [];
  for (const item of order.items) {
    for (let i = 0; i < item.quantity; i++) {
      ticketRows.push({
        orderId: order.id,
        userId: order.userId,
        eventId: item.eventId,
        tierId: item.tierId,
        tierName: item.tierName,
        eventTitle: item.eventTitle,
        eventDate: item.eventDate,
        eventVenue: item.eventVenue,
        eventCity: item.eventCity,
        qrCode: generateQRCode(),
        price: item.price,
        currency: item.currency,
        attendeeName: order.attendeeName,
        attendeeEmail: order.attendeeEmail,
        purchasedAt: paidAt,
      });
    }
  }

  const [updatedOrder] = await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: 'paid', paidAt, ...(req.body.txHash && { txHash: req.body.txHash }) },
      include: { items: true },
    }),
    prisma.ticket.createMany({ data: ticketRows }),
  ]);

  const tickets = await prisma.ticket.findMany({ where: { orderId: order.id } });

  logger.info(`Order paid ${updatedOrder.reference} — issued ${tickets.length} tickets`);
  res.json({ status: 'success', data: { order: serializeOrder(updatedOrder), tickets } });
});

exports.list = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ status: 'success', data: { orders: orders.map(serializeOrder) } });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { items: true },
  });
  if (!order) return next(new AppError('Order not found', 404));
  res.json({ status: 'success', data: { order: serializeOrder(order) } });
});
