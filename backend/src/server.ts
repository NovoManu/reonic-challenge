import Fastify from 'fastify';
const cors = require('@fastify/cors');

import { handlers as inputsHandlers } from './api/inputs';
import { handlers as simulationsHandlers } from './api/simulations';
import { CORS_CONFIG } from './utils/config';
import { prisma, db } from './utils/database';
import { logger } from './utils/logger';
import { setupRateLimiter } from './utils/rateLimiter';

const fastify = Fastify({
  logger: true
});

const app = async () => {
  // Connect to the database
  await db.connect();
  await fastify.register(cors, CORS_CONFIG);
  
  // Register rate limiter
  setupRateLimiter(fastify, {
    windowMs: 60000,     // 1 minute window
    maxRequests: 100,    // 100 requests per minute
  });

  // Register API routes
  await inputsHandlers(fastify, prisma);
  await simulationsHandlers(fastify, prisma);
  
  // Add health check endpoint
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return fastify;
};

export default app;