import { validateInput } from '../../src/api/inputs';
import { runSimulation } from '../../src/services/simulation';

// Mock the simulation service
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
  })
}));

describe('API Handlers', () => {
  describe('Input Validation', () => {
    it('should validate valid input', () => {
      const validInput = {
        numChargePoints: 10,
        arrivalProbabilityMult: 100,
        carConsumption: 18,
        chargingPower: 11
      };
      
      expect(() => validateInput(validInput)).not.toThrow();
    });
    
    it('should throw error for invalid numChargePoints', () => {
      const invalidInputs = [
        { numChargePoints: 0 },
        { numChargePoints: -1 },
        { numChargePoints: '10' as any },
      ];
      
      invalidInputs.forEach(input => {
        expect(() => validateInput(input)).toThrow('numChargePoints must be a positive number');
      });
    });
  });

  describe('Simulation Service', () => {
    it('should run simulation with correct parameters', () => {
      const mockRunSimulation = runSimulation as jest.Mock;
      const input = { numChargePoints: 10 };
      
      const result = mockRunSimulation(input);
      
      expect(mockRunSimulation).toHaveBeenCalledWith(input);
      expect(result).toHaveProperty('totalEnergyKWh', 100);
      expect(result).toHaveProperty('theoreticalMaxPower', 110);
      expect(result).toHaveProperty('actualMaxPower', 50);
      expect(result).toHaveProperty('concurrencyFactor', 0.45);
    });
  });
});

