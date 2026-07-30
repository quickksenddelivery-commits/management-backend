const { prisma } = require('../config/database');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const { parsePagination, paginationMeta, slugId } = require('../utils/helpers');

const withTiers = { ticketTiers: true };

exports.list = asyncHandler(async (req, res) => {
  const { category, city, country, status, featured, search, celebrityId } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const where = {};
  if (category) where.category = category;
  if (city) where.city = city;
  if (country) where.country = country;
  if (status) where.status = status;
  if (celebrityId) where.celebrityId = celebrityId;
  if (featured !== undefined) where.isFeatured = featured === 'true';
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.event.findMany({ where, include: withTiers, orderBy: { date: 'asc' }, skip, take: limit }),
    prisma.event.count({ where }),
  ]);

  res.json({ status: 'success', meta: paginationMeta(total, page, limit), data: { events: data } });
});

exports.featured = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    where: { isFeatured: true },
    include: withTiers,
    orderBy: { date: 'asc' },
  });
  res.json({ status: 'success', data: { events } });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id }, include: withTiers });
  if (!event) return next(new AppError('Event not found', 404));
  res.json({ status: 'success', data: { event } });
});

exports.create = asyncHandler(async (req, res) => {
  const { ticketTiers = [], ...rest } = req.body;
  const event = await prisma.event.create({
    data: {
      id: slugId('event'),
      ...rest,
      ticketTiers: {
        create: ticketTiers.map((t) => ({ id: slugId('tier'), ...t })),
      },
    },
    include: withTiers,
  });
  res.status(201).json({ status: 'success', data: { event } });
});

exports.update = asyncHandler(async (req, res, next) => {
  const { ticketTiers, ...rest } = req.body;

  const exists = await prisma.event.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!exists) return next(new AppError('Event not found', 404));

  const event = await prisma.$transaction(async (tx) => {
    if (ticketTiers) {
      await tx.ticketTier.deleteMany({ where: { eventId: req.params.id } });
    }
    return tx.event.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(ticketTiers && {
          ticketTiers: { create: ticketTiers.map((t) => ({ id: slugId('tier'), ...t })) },
        }),
      },
      include: withTiers,
    });
  });

  res.json({ status: 'success', data: { event } });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const event = await prisma.event.delete({ where: { id: req.params.id } }).catch(() => null);
  if (!event) return next(new AppError('Event not found', 404));
  res.json({ status: 'success', message: 'Event deleted' });
});
