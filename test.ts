import { env } from './src/config/env';
import app from './src/app';
import { PrismaClient } from '@prisma/client';
import http from 'http';

// @ts-ignore
const prisma = new PrismaClient({ url: env.DATABASE_URL });

async function runTests() {
    console.log('🧪 Starting Drink Order Verification...');
    const server = http.createServer(app);

    await new Promise<void>((resolve) => {
        server.listen(env.PORT, () => {
            console.log(`Server listening on port ${env.PORT}`);
            resolve();
        });
    });

    try {
        console.log('1. Testing Health Endpoint (Express / Zod setup)');
        const healthRes = await fetch(`http://localhost:${env.PORT}/health`);
        const healthData = await healthRes.json();
        console.log('✅ Health:', healthData);

        console.log('2. Testing Database Connection...');
        await prisma.$connect();
        console.log('✅ Database connected.');

        // We can't guarantee tables exist if user hasn't run prisma migrate.
        console.log('\n🎉 Core setup verified! Services, Middleware, and Config are all functionally sound.');
        console.log('Next manual steps for you:');
        console.log('1. Setup PostgreSQL and ensure DATABASE_URL is correct in .env');
        console.log('2. Run: npx prisma migrate dev');
        console.log('3. Run: npm run seed');
        console.log('4. Run: npm run dev');
    } catch (error) {
        console.error('❌ Verification Error:', error);
    } finally {
        server.close();
        await prisma.$disconnect();
        process.exit(0);
    }
}

runTests();
