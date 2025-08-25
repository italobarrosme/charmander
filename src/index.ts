import 'reflect-metadata';
import { connectDB } from './config/db';
import { buildApp } from './app';

const start = async () => {
  try {
    await connectDB();

    const app = buildApp();
    await app.listen({ port: 4231, host: '0.0.0.0' });
    console.log('🚀 Fastify server running at http://localhost:4231');
  } catch (err) {
    console.error('❌ Error starting server', err);
    process.exit(1);
  }
};

start();
