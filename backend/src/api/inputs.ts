import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { SimulationInput, validateSimulationInput, applyDefaultValues } from '../utils/validation'
import { handleValidationError, handleNotFoundError, handleServerError } from '../utils/errorHandler'

// Export validateInput for tests
export const validateInput = validateSimulationInput

export const handlers = (fastify: FastifyInstance, prisma: PrismaClient) => {
    fastify.post('/inputs', async (request, reply) => {
        try {
            const inputData = request.body as Partial<SimulationInput>;
            validateSimulationInput(inputData);
            const validatedInput = applyDefaultValues(inputData);
            
            const input = await prisma.simulationInput.create({
                data: validatedInput,
            });
            return input;
        } catch (error) {
            handleValidationError(reply, error);
        }
    });

    fastify.get('/inputs', async (request, reply) => {
        try {
            return await prisma.simulationInput.findMany();
        } catch (error) {
            handleServerError(reply, error);
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
                return handleNotFoundError(reply, 'Input not found');
            }
            return input;
        } catch (error) {
            handleServerError(reply, error);
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
            validateSimulationInput(updateData);

            const updated = await prisma.simulationInput.update({
                where: { id: numId },
                data: updateData,
            });
            return updated;
        } catch (error) {
            handleValidationError(reply, error);
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
                handleNotFoundError(reply, 'Input not found');
            } else {
                handleServerError(reply, error);
            }
        }
    });
}
