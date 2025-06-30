import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

export const handlers = (fastify: FastifyInstance, prisma: PrismaClient) => {
    fastify.post('/inputs', async (request, reply) => {
        const { numChargePoints, arrivalProbabilityMult = 100, carConsumption = 18, chargingPower = 11 } = request.body as any;
        const input = await prisma.simulationInput.create({
            data: { numChargePoints, arrivalProbabilityMult, carConsumption, chargingPower },
        });
        return input;
    });

    fastify.get('/inputs', async () => {
        return prisma.simulationInput.findMany();
    });

    fastify.get('/inputs/:id', async (request) => {
        const { id } = request.params as any;
        return prisma.simulationInput.findUnique({ where: { id: Number(id) } });
    });

    fastify.put('/inputs/:id', async (request, reply) => {
        const { id } = request.params as any;
        const { numChargePoints, arrivalProbabilityMult, carConsumption, chargingPower } = request.body as any;
        const updated = await prisma.simulationInput.update({
            where: { id: Number(id) },
            data: { numChargePoints, arrivalProbabilityMult, carConsumption, chargingPower },
        });
        return updated;
    });

    fastify.delete('/inputs/:id', async (request, reply) => {
        const { id } = request.params as any;
        await prisma.simulationInput.delete({ where: { id: Number(id) } });
        return { success: true };
    });
}
