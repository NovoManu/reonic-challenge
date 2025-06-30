import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { runSimulation } from '../services/simulation';

export const handlers = (fastify: FastifyInstance, prisma: PrismaClient) => {
    fastify.post('/simulate/:inputId', async (request, reply) => {
        console.log('test');
        // const { inputId } = request.params as any;

        // const input = await prisma.simulationInput.findUnique({ where: { id: Number(inputId) } });
        // if (!input) return reply.status(404).send({ error: 'Input not found' });

        // const simResult = runSimulation({
        //     numChargePoints: input.numChargePoints,
        //     arrivalProbabilityMult: input.arrivalProbabilityMult,
        //     carConsumption: input.carConsumption,
        //     chargingPower: input.chargingPower,
        // });

        const simResult = runSimulation({
            numChargePoints: 10,
            arrivalProbabilityMult: 100,
            carConsumption: 18,
            chargingPower: 11,
        });

        // const result = await prisma.simulationResult.create({
        //     data: {
        //         simulationInputId: input.id,
        //         chargingValues: { values: simResult.chargingValues },
        //         exemplaryDay: simResult.exemplaryDay,
        //         totalEnergyCharged: simResult.totalEnergyKWh,
        //         chargingEventsPerYear: simResult.chargingEventsPerYear,
        //         chargingEventsPerMonth: simResult.chargingEventsPerMonth,
        //         chargingEventsPerWeek: simResult.chargingEventsPerWeek,
        //         chargingEventsPerDay: simResult.chargingEventsPerDay,
        //     },
        // });
        return reply.send(simResult);
    });
}
