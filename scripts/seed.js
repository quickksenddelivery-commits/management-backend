require('dotenv').config();
const { prisma } = require('../src/config/database');
const { celebrities, events, sponsorshipPackages, sponsors } = require('./seed-data');

(async () => {
  await prisma.$connect();
  console.log('Connected to Postgres');

  console.log('Clearing existing catalog data…');
  await prisma.sponsorshipApplication.deleteMany({});
  await prisma.sponsor.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.celebrity.deleteMany({});
  await prisma.sponsorshipPackage.deleteMany({});

  const c = await prisma.celebrity.createMany({ data: celebrities });

  let eventCount = 0;
  for (const { ticketTiers, ...event } of events) {
    await prisma.event.create({
      data: {
        ...event,
        date: new Date(event.date),
        doorsOpen: event.doorsOpen ? new Date(event.doorsOpen) : null,
        ticketTiers: { create: ticketTiers },
      },
    });
    eventCount++;
  }

  const p = await prisma.sponsorshipPackage.createMany({ data: sponsorshipPackages });
  const s = await prisma.sponsor.createMany({ data: sponsors });

  console.log(`Seeded ${c.count} celebrities`);
  console.log(`Seeded ${eventCount} events`);
  console.log(`Seeded ${p.count} sponsorship packages`);
  console.log(`Seeded ${s.count} sponsors`);

  await prisma.$disconnect();
  console.log('Done.');
  process.exit(0);
})().catch(async (err) => {
  console.error('Seed failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
