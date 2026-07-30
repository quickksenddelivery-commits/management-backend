require('dotenv').config();
const { prisma } = require('../src/config/database');
const { hashPassword } = require('../src/services/user.service');

// Admin credentials are seeded straight into the database — no env-var
// dependency. After first login, change the password via the profile API.
const ADMIN = {
  name: 'FanConnectPro Admin',
  email: 'admin@fanconnectpro.local',
  password: 'ChangeMe@123',
  role: 'admin',
};

(async () => {
  await prisma.$connect();
  console.log('Connected to Postgres');

  const existing = await prisma.user.findUnique({ where: { email: ADMIN.email } });
  if (existing) {
    console.log('Admin user already exists:', ADMIN.email);
    process.exit(0);
  }

  await prisma.user.create({ data: { ...ADMIN, password: await hashPassword(ADMIN.password) } });
  console.log('Admin user created successfully');
  console.log('  Email   :', ADMIN.email);
  console.log('  Password:', ADMIN.password);
  console.log('\nChange the password after first login!');

  await prisma.$disconnect();
  process.exit(0);
})().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await prisma.$disconnect();
  process.exit(1);
});
