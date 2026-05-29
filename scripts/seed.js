require('dotenv').config();
const mongoose = require('mongoose');

const Celebrity = require('../src/models/Celebrity');
const Event = require('../src/models/Event');
const SponsorshipPackage = require('../src/models/SponsorshipPackage');
const Sponsor = require('../src/models/Sponsor');

const { celebrities, events, sponsorshipPackages, sponsors } = require('./seed-data');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  console.log('Clearing existing catalog data…');
  await Promise.all([
    Celebrity.deleteMany({}),
    Event.deleteMany({}),
    SponsorshipPackage.deleteMany({}),
    Sponsor.deleteMany({}),
  ]);

  const [c, e, p, s] = await Promise.all([
    Celebrity.insertMany(celebrities),
    Event.insertMany(events),
    SponsorshipPackage.insertMany(sponsorshipPackages),
    Sponsor.insertMany(sponsors),
  ]);

  console.log(`Seeded ${c.length} celebrities`);
  console.log(`Seeded ${e.length} events`);
  console.log(`Seeded ${p.length} sponsorship packages`);
  console.log(`Seeded ${s.length} sponsors`);

  await mongoose.disconnect();
  console.log('Done.');
  process.exit(0);
})().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
