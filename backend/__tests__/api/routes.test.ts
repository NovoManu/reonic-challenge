import Fastify, { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { handlers as inputsHandlers } from '../../src/api/inputs';
import { handlers as simulationsHandlers } from '../../src/api/simulations';

// Mock PrismaClient
const mockPrisma = {
  simulationInput: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  simulationResult: {
    create: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

jest.mock('../../src/services/simulation', () => ({
  runSimulation: jest.fn().mockReturnValue({
    totalEnergyKWh: 100,
    theoreticalMaxPower: 110,
    actualMaxPower: 50,
    concurrencyFactor: 0.45,
    chargingValues: Array(96).fill(0),
    exemplaryDay: new Date(),
    chargingEventsPerYear: 1000,
    chargingEventsPerMonth: 83,
    chargingEventsPerWeek: 19,
    chargingEventsPerDay: 2
  }),
  SimulationInput: {}
}));

describe('API Routes', () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    mockPrisma.simulationInput.create.mockResolvedValue({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      numChargePoints: 10,
      arrivalProbabilityMult: 100,
      carConsumption: 18,
      chargingPower: 11,
    });
    
    mockPrisma.simulationInput.findMany.mockResolvedValue([
      {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        numChargePoints: 10,
        arrivalProbabilityMult: 100,
        carConsumption: 18,
        chargingPower: 11,
      },
    ]);
    
    mockPrisma.simulationInput.findUnique.mockResolvedValue({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      numChargePoints: 10,
      arrivalProbabilityMult: 100,
      carConsumption: 18,
      chargingPower: 11,
    });
    
    mockPrisma.simulationInput.update.mockResolvedValue({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      numChargePoints: 15,
      arrivalProbabilityMult: 120,
      carConsumption: 19,
      chargingPower: 12,
    });
    
    mockPrisma.simulationInput.delete.mockResolvedValue({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      numChargePoints: 10,
      arrivalProbabilityMult: 100,
      carConsumption: 18,
      chargingPower: 11,
    });
    
    mockPrisma.simulationResult.create.mockResolvedValue({
      id: 1,
      createdAt: new Date(),
      simulationInputId: 1,
      chargingValues: [],
      exemplaryDay: new Date(),
      totalEnergyCharged: 100,
      chargingEventsPerYear: 1000,
      chargingEventsPerMonth: 83,
      chargingEventsPerWeek: 19,
      chargingEventsPerDay: 2,
    });
    
    // Create a new Fastify instance for each test
    fastify = Fastify();
    
    // Register the handlers
    await inputsHandlers(fastify, mockPrisma as unknown as PrismaClient);
    await simulationsHandlers(fastify, mockPrisma as unknown as PrismaClient);
  });

  afterEach(async () => {
    await fastify.close();
  });

  describe('Inputs API', () => {
    test('POST /inputs - should create a new input', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/inputs',
        payload: { numChargePoints: 10 },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('id', 1);
      expect(mockPrisma.simulationInput.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ numChargePoints: 10 }),
      });
    });

    test('POST /inputs - should return 400 for invalid input', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/inputs',
        payload: { numChargePoints: -1 },
      });

      expect(response.statusCode).toBe(400);
    });

    test('GET /inputs - should return all inputs', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/inputs',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toBeInstanceOf(Array);
      expect(mockPrisma.simulationInput.findMany).toHaveBeenCalled();
    });

    test('GET /inputs/:id - should return a specific input', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/inputs/1',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('id', 1);
      expect(mockPrisma.simulationInput.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test('GET /inputs/:id - should return 404 for non-existent input', async () => {
      mockPrisma.simulationInput.findUnique.mockResolvedValueOnce(null);

      const response = await fastify.inject({
        method: 'GET',
        url: '/inputs/999',
      });

      expect(response.statusCode).toBe(404);
    });

    test('PUT /inputs/:id - should update an input', async () => {
      const response = await fastify.inject({
        method: 'PUT',
        url: '/inputs/1',
        payload: { numChargePoints: 15 },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('numChargePoints', 15);
      expect(mockPrisma.simulationInput.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ numChargePoints: 15 }),
      });
    });

    test('DELETE /inputs/:id - should delete an input', async () => {
      const response = await fastify.inject({
        method: 'DELETE',
        url: '/inputs/1',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('success', true);
      expect(mockPrisma.simulationInput.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('Simulations API', () => {
    test('POST /simulate - should run a simulation', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/simulate',
        payload: { numChargePoints: 10 },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty('totalEnergyKWh', 100);
      expect(body).toHaveProperty('id');
      expect(mockPrisma.simulationResult.create).toHaveBeenCalled();
    });

    test('POST /simulate - should return 400 for invalid input', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/simulate',
        payload: { numChargePoints: -1 },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
