import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { SimulationInput, runSimulation } from '../services/simulation';

export const handlers = (fastify: FastifyInstance, prisma: PrismaClient) => {
    fastify.post('/simulate', async (request, reply) => {
        try {
            const body = request.body as SimulationInput;

            // Validate required input
            if (!body.numChargePoints || typeof body.numChargePoints !== 'number' || body.numChargePoints <= 0) {
                return reply.status(400).send({ error: 'Invalid numChargePoints. Must be a positive number.' });
            }

            // Validate optional inputs if provided
            if (body.arrivalProbabilityMult !== undefined && (typeof body.arrivalProbabilityMult !== 'number' || body.arrivalProbabilityMult < 0)) {
                return reply.status(400).send({ error: 'Invalid arrivalProbabilityMult. Must be a non-negative number.' });
            }

            if (body.carConsumption !== undefined && (typeof body.carConsumption !== 'number' || body.carConsumption <= 0)) {
                return reply.status(400).send({ error: 'Invalid carConsumption. Must be a positive number.' });
            }

            if (body.chargingPower !== undefined && (typeof body.chargingPower !== 'number' || body.chargingPower <= 0)) {
                return reply.status(400).send({ error: 'Invalid chargingPower. Must be a positive number.' });
            }

            // Run simulation with validated input
            const simResult = runSimulation(body);

            // Save simulation result
            const result = await prisma.simulationResult.create({
                data: {
                    simulationInput: {
                        create: {
                            numChargePoints: body.numChargePoints,
                            arrivalProbabilityMult: body.arrivalProbabilityMult,
                            carConsumption: body.carConsumption,
                            chargingPower: body.chargingPower,
                        }
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

            return reply.send({
                ...simResult,
                id: result.id
            });
        } catch (error) {
            console.error('Simulation error:', error);
            return reply.status(500).send({ 
                error: 'Failed to run simulation',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
}
