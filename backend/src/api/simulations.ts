import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { runSimulation } from '../services/simulation';
import { SimulationInput, validateSimulationInput, applyDefaultValues } from '../utils/validation';
import { handleValidationError, handleServerError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

export const handlers = (fastify: FastifyInstance, prisma: PrismaClient) => {
    fastify.post('/simulate', async (request, reply) => {
        try {
            const inputData = request.body as Partial<SimulationInput>;
            
            try {
                validateSimulationInput(inputData);
            } catch (validationError) {
                logger.warn('Validation error in simulation input', { input: inputData });
                return handleValidationError(reply, validationError);
            }
            
            const validatedInput = applyDefaultValues(inputData);

            // Run simulation with validated input
            logger.info('Running simulation', { input: validatedInput });
            const simResult = runSimulation(validatedInput);

            // Save simulation result
            const result = await prisma.simulationResult.create({
                data: {
                    simulationInput: {
                        create: validatedInput
                    },
                    chargingValues: simResult.chargingValues,
                    exemplaryDay: simResult.exemplaryDay,
                    totalEnergyCharged: simResult.totalEnergyKWh,
                    chargingEventsPerYear: simResult.chargingEventsPerYear,
                    chargingEventsPerMonth: simResult.chargingEventsPerMonth,
                    chargingEventsPerWeek: simResult.chargingEventsPerWeek,
                    chargingEventsPerDay: simResult.chargingEventsPerDay,
                },
            });

            logger.info('Simulation completed successfully', { 
                totalEnergy: simResult.totalEnergyKWh,
                concurrencyFactor: simResult.concurrencyFactor,
                chargingEvents: simResult.chargingEventsPerDay
            });
            
            return reply.send({
                ...simResult,
                id: result.id
            });
        } catch (error) {
            logger.error('Simulation failed', error instanceof Error ? error : new Error('Unknown error'));
            return handleServerError(reply, error);
        }
    });
}
