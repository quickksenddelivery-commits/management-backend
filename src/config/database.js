const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('Neon Postgres connected');
  } catch (error) {
    logger.error(`Postgres connection failed: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
  logger.info('Postgres connection closed');
};

module.exports = { prisma, connectDB, disconnectDB };
