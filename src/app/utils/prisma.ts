import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle connection issues
async function connectPrisma() {
  try {
    await prisma.$connect();

    const { logger } = require('./logger');
    logger.info('Prisma connected to the database successfully!');
  } catch (error) {
    const { logger } = require('./logger');
    logger.error('Prisma connection failed:', error);
    process.exit(1); // Exit process with failure
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await prisma.$disconnect();

    const { logger } = require('./logger');
    logger.info('Prisma disconnected due to application termination.');
    process.exit(0);
  });
}

connectPrisma();

export default prisma;
