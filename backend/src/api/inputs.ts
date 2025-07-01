import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

interface SimulationInput {
    numChargePoints: number;
    arrivalProbabilityMult?: number;
    carConsumption?: number;
    chargingPower?: number;
}

const validateInput = (input: Partial<SimulationInput>) => {
    if (typeof input.numChargePoints !== 'number' || input.numChargePoints <= 0) {
        throw new Error('numChargePoints must be a positive number');
    }
    if (input.arrivalProbabilityMult !== undefined && (typeof input.arrivalProbabilityMult !== 'number' || input.arrivalProbabilityMult < 0)) {
        throw new Error('arrivalProbabilityMult must be a non-negative number');
    }
    if (input.carConsumption !== undefined && (typeof input.carConsumption !== 'number' || input.carConsumption <= 0)) {
        throw new Error('carConsumption must be a positive number');
    }
    if (input.chargingPower !== undefined && (typeof input.chargingPower !== 'number' || input.chargingPower <= 0)) {
        throw new Error('chargingPower must be a positive number');
    }
};

export const handlers = (fastify: FastifyInstance, prisma: PrismaClient) => {
    fastify.post('/inputs', async (request, reply) => {
        try {
            const { numChargePoints, arrivalProbabilityMult = 100, carConsumption = 18, chargingPower = 11 } = request.body as SimulationInput;
            validateInput({ numChargePoints, arrivalProbabilityMult, carConsumption, chargingPower });
            
            const input = await prisma.simulationInput.create({
                data: { numChargePoints, arrivalProbabilityMult, carConsumption, chargingPower },
            });
            return input;
        } catch (error) {
            reply.status(400).send({ error: error instanceof Error ? error.message : 'Invalid input data' });
        }
    });

    fastify.get('/inputs', async (request, reply) => {
        try {
            return await prisma.simulationInput.findMany();
        } catch (error) {
            reply.status(500).send({ error: 'Failed to fetch simulation inputs' });
        }
    });

    fastify.get('/inputs/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const numId = parseInt(id);
            if (isNaN(numId)) {
                return reply.status(400).send({ error: 'Invalid ID format' });
            }

            const input = await prisma.simulationInput.findUnique({ where: { id: numId } });
            if (!input) {
                return reply.status(404).send({ error: 'Input not found' });
            }
            return input;
        } catch (error) {
            reply.status(500).send({ error: 'Failed to fetch simulation input' });
        }
    });

    fastify.put('/inputs/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const numId = parseInt(id);
            if (isNaN(numId)) {
                return reply.status(400).send({ error: 'Invalid ID format' });
            }

            const updateData = request.body as SimulationInput;
            validateInput(updateData);

            const updated = await prisma.simulationInput.update({
                where: { id: numId },
                data: updateData,
            });
            return updated;
        } catch (error) {
            if (error instanceof Error) {
                reply.status(400).send({ error: error.message });
            } else {
                reply.status(500).send({ error: 'Failed to update simulation input' });
            }
        }
    });

    fastify.delete('/inputs/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const numId = parseInt(id);
            if (isNaN(numId)) {
                return reply.status(400).send({ error: 'Invalid ID format' });
            }

            await prisma.simulationInput.delete({ where: { id: numId } });
            return { success: true };
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
                reply.status(404).send({ error: 'Input not found' });
            } else {
                reply.status(500).send({ error: 'Failed to delete simulation input' });
            }
        }
    });
}
