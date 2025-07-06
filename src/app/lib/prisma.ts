import { PrismaClient } from '@prisma/client';

declare global {
  // Permite mantener una única instancia de PrismaClient en desarrollo
  var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;