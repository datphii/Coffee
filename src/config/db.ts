// import { PrismaClient } from '@prisma/client';

// export const prisma = new PrismaClient();

// Stub PrismaClient to bypass SQLite parsing bugs during local demo
export const prisma = {
    shop: { findMany: async () => { throw new Error('DB disabled for mock demo'); } },
    drink: { findMany: async () => { throw new Error('DB disabled for mock demo'); } },
    user: { findUnique: async () => null, create: async () => ({}) },
    order: { create: async () => ({}) }
} as any;
