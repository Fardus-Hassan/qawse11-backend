import config from './app/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { hashPassword } from './app/helpers/hashPassword';

const prisma = new PrismaClient();

export const seedSuperAdmin = async () => {
  const email = config.superAdmin.email!;
  const password = config.superAdmin.password!;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // console.log("⚠️  Super Admin already exists!");
      return;
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        fullName: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isVerified: true,
      },
    });

    const { logger } = require('./app/utils/logger');
    logger.info('Super Admin seeded successfully.');
  } catch (err: any) {
    // If database is not migrated or table missing, skip seeding gracefully
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2021') {
      console.warn('⚠️  Database not ready for seeding; skipping super admin seed.');
      return;
    }
    throw err;
  }
};
