import { PrismaClient } from "@prisma/client";

// Reuses a single Prisma client during development to avoid connection storms on hot reload.
const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

// Cache Prisma instance only in development runtime.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
