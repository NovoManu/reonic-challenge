import Fastify from 'fastify';
const cors = require('@fastify/cors');
import { PrismaClient } from '@prisma/client';

import { handlers as inputsHandlers } from './api/inputs';
import { handlers as simulationsHandlers } from './api/simulations';

const fastify = Fastify();
const prisma = new PrismaClient();
const origin = ['http://localhost:8080'];

const app = async () => {
  await fastify.register(cors, {
    origin,
    credentials: true,
  });

  await inputsHandlers(fastify, prisma);
  await simulationsHandlers(fastify, prisma);

  return fastify;
};

export default app;