/**
 * Demo seeder — ensures every collection has AT LEAST 4 records.
 * Idempotent: it only tops up what's missing, so it's safe to re-run.
 *
 *   npm run seed:demo
 */
require('dotenv').config();
const { prisma } = require('../src/config/database');
const { hashPassword } = require('../src/services/user.service');
const { getCoin, toUSD, toCrypto, roundCrypto } = require('../src/config/coins');
const { generateQRCode, generateReference } = require('../src/utils/helpers');

const MIN = 4;
const PASSWORD = 'Passw0rd!';

const DEMO_USERS = [
  { name: 'Ada Obi',   email: 'ada.demo@fanconnectpro.local',   password: PASSWORD },
  { name: 'Bola Ade',  email: 'bola.demo@fanconnectpro.local',  password: PASSWORD },
  { name: 'Chidi Eze', email: 'chidi.demo@fanconnectpro.local', password: PASSWORD },
  { name: 'Dami Cole', email: 'dami.demo@fanconnectpro.local',  password: PASSWORD },
];

const APPLICATIONS = [
  { companyName: 'Pulse Telecom',  contactName: 'Ngozi A.', email: 'partners@pulsetelecom.demo', phone: '+2348010000001', packageId: 'pkg-title',    eventId: 'event-1', budget: '$50,000', message: 'Title sponsorship for The Crown Experience.', status: 'reviewing' },
  { companyName: 'Zenith Capital', contactName: 'Tunde B.', email: 'brand@zenithcap.demo',       phone: '+2348010000002', packageId: 'pkg-platinum', eventId: 'event-1', budget: '$25,000', message: 'Platinum package, please.',                  status: 'pending' },
  { companyName: 'Savanna Drinks', contactName: 'Kemi C.',  email: 'mktg@savanna.demo',          phone: '+2348010000003', packageId: 'pkg-gold',     eventId: 'event-2', budget: '$10,000', message: 'Interested in Electric Nights.',            status: 'approved' },
  { companyName: 'NovaTel',        contactName: 'Sade D.',  email: 'sponsor@novatel.demo',       phone: '+2348010000004', packageId: 'pkg-silver',   eventId: '',        budget: '$5,000',  message: 'Platform-wide silver partner.',             status: 'pending' },
];

const ORDER_SPECS = [
  { eventId: 'event-1', tierId: 'tier-1-2', qty: 2, coin: 'USDT' },
  { eventId: 'event-2', tierId: 'tier-2-2', qty: 1, coin: 'USDC' },
  { eventId: 'event-4', tierId: 'tier-4-1', qty: 2, coin: 'BTC'  },
  { eventId: 'event-5', tierId: 'tier-5-1', qty: 1, coin: 'ETH'  },
];

async function ensureUsers() {
  const users = [];
  for (const spec of DEMO_USERS) {
    let u = await prisma.user.findUnique({ where: { email: spec.email } });
    if (!u) {
      u = await prisma.user.create({ data: { ...spec, password: await hashPassword(spec.password) } });
      console.log('  + user', spec.email);
    }
    users.push(u);
  }
  return users;
}

async function ensureApplications() {
  const have = await prisma.sponsorshipApplication.count();
  let created = 0;
  for (const app of APPLICATIONS) {
    if (have + created >= MIN) break;
    const pkg = await prisma.sponsorshipPackage.findUnique({ where: { id: app.packageId } });
    await prisma.sponsorshipApplication.create({
      data: { ...app, packageName: pkg ? pkg.name : app.packageId, eventId: app.eventId || null },
    });
    created++;
    console.log('  + application from', app.companyName);
  }
}

async function ensureOrdersAndTickets(users) {
  let orderCount = await prisma.order.count();
  let i = 0;
  for (const spec of ORDER_SPECS) {
    if (orderCount >= MIN) break;
    const event = await prisma.event.findUnique({ where: { id: spec.eventId }, include: { ticketTiers: true } });
    if (!event) { console.log('  ! missing event', spec.eventId); continue; }
    const tier = event.ticketTiers.find((t) => t.id === spec.tierId) || event.ticketTiers[0];
    const coin = getCoin(spec.coin);
    const user = users[i % users.length];
    i++;

    const usdTotal = Number(toUSD(tier.price * spec.qty, tier.currency).toFixed(2));
    const cryptoAmount = roundCrypto(toCrypto(usdTotal, coin), coin);
    const paidAt = new Date();

    const order = await prisma.order.create({
      data: {
        reference: generateReference('ORD'),
        userId: user.id,
        attendeeName: user.name,
        attendeeEmail: user.email,
        coinSymbol: coin.symbol, coinNetwork: coin.network, coinAddress: coin.address,
        usdTotal, cryptoAmount,
        status: 'paid', paidAt,
        txHash: '0xdemo' + Math.random().toString(16).slice(2, 14),
        items: {
          create: [{
            eventId: event.id, tierId: tier.id, tierName: tier.name,
            eventTitle: event.title, eventDate: event.date, eventVenue: event.venue,
            eventCity: event.city, eventImage: event.image,
            quantity: spec.qty, price: tier.price, currency: tier.currency,
          }],
        },
      },
    });

    const tickets = Array.from({ length: spec.qty }, () => ({
      orderId: order.id, userId: user.id,
      eventId: event.id, tierId: tier.id, tierName: tier.name,
      eventTitle: event.title, eventDate: event.date, eventVenue: event.venue, eventCity: event.city,
      qrCode: generateQRCode(), price: tier.price, currency: tier.currency,
      attendeeName: user.name, attendeeEmail: user.email, purchasedAt: paidAt,
    }));
    await prisma.ticket.createMany({ data: tickets });
    orderCount++;
    console.log(`  + order ${order.reference} (${spec.qty} ticket${spec.qty > 1 ? 's' : ''}) for ${user.email}`);
  }
}

(async () => {
  await prisma.$connect();
  console.log('Connected to Postgres\n');

  console.log('Users…');         const users = await ensureUsers();
  console.log('Applications…');  await ensureApplications();
  console.log('Orders & tickets…'); await ensureOrdersAndTickets(users);

  console.log('\n=== Final counts (target ≥ ' + MIN + ' each) ===');
  const rows = [
    ['celebrities',             await prisma.celebrity.count()],
    ['events',                  await prisma.event.count()],
    ['sponsorshipPackages',     await prisma.sponsorshipPackage.count()],
    ['sponsors',                await prisma.sponsor.count()],
    ['users',                   await prisma.user.count()],
    ['sponsorshipApplications', await prisma.sponsorshipApplication.count()],
    ['orders',                  await prisma.order.count()],
    ['tickets',                 await prisma.ticket.count()],
  ];
  for (const [name, n] of rows) {
    console.log(`  ${(n >= MIN ? '✓' : '✗')} ${name.padEnd(24)} ${n}`);
  }

  await prisma.$disconnect();
  process.exit(0);
})().catch(async (err) => {
  console.error('Seed failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
