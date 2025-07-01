import { PrismaClient } from '@prisma/client';

// Mock for PrismaClient
export const mockPrismaClient = {
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

// Setup default mock implementations
export const setupMockPrisma = () => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Setup default mock implementations
  mockPrismaClient.simulationInput.create.mockResolvedValue({
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    numChargePoints: 10,
    arrivalProbabilityMult: 100,
    carConsumption: 18,
    chargingPower: 11,
  });
  
  mockPrismaClient.simulationInput.findMany.mockResolvedValue([
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      numChargePoints: 10,
      arrivalProbabilityMult: 100,
      carConsumption: 18,
      chargingPower: 11,
    },
    {
      id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      numChargePoints: 20,
      arrivalProbabilityMult: 150,
      carConsumption: 20,
      chargingPower: 22,
    },
  ]);
  
  mockPrismaClient.simulationInput.findUnique.mockResolvedValue({
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    numChargePoints: 10,
    arrivalProbabilityMult: 100,
    carConsumption: 18,
    chargingPower: 11,
  });
  
  mockPrismaClient.simulationInput.update.mockResolvedValue({
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    numChargePoints: 15,
    arrivalProbabilityMult: 120,
    carConsumption: 19,
    chargingPower: 12,
  });
  
  mockPrismaClient.simulationInput.delete.mockResolvedValue({
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    numChargePoints: 10,
    arrivalProbabilityMult: 100,
    carConsumption: 18,
    chargingPower: 11,
  });
  
  mockPrismaClient.simulationResult.create.mockResolvedValue({
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
};

// Mock the PrismaClient constructor
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));
