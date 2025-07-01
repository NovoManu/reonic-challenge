import { runSimulation, SimulationInput, SimulationResult } from '../../src/services/simulation';

describe('Simulation Service', () => {
  describe('runSimulation', () => {
    it('should run simulation with default parameters', () => {
      const result = runSimulation({ numChargePoints: 10 });
      
      expect(result).toBeDefined();
      expect(result.totalEnergyKWh).toBeGreaterThan(0);
      expect(result.theoreticalMaxPower).toBe(10 * 11);
      expect(result.actualMaxPower).toBeLessThanOrEqual(result.theoreticalMaxPower);
      expect(result.concurrencyFactor).toBeGreaterThan(0);
      expect(result.concurrencyFactor).toBeLessThanOrEqual(1);
      expect(result.chargingValues).toBeInstanceOf(Array);
      expect(result.chargingValues.length).toBe(24 * 4);
      expect(result.exemplaryDay).toBeInstanceOf(Date);
      expect(result.chargingEventsPerYear).toBeGreaterThan(0);
      expect(result.chargingEventsPerMonth).toBeGreaterThan(0);
      expect(result.chargingEventsPerWeek).toBeGreaterThan(0);
      expect(result.chargingEventsPerDay).toBeGreaterThan(0);
    });

    it('should run simulation with custom parameters', () => {
      const input: SimulationInput = {
        numChargePoints: 5,
        arrivalProbabilityMult: 200,
        carConsumption: 20,
        chargingPower: 22
      };
      
      const result = runSimulation(input);
      
      expect(result).toBeDefined();
      expect(result.theoreticalMaxPower).toBe(5 * 22);
    });

    it('should have higher energy consumption with more arrival probability', () => {
      const lowProbInput: SimulationInput = {
        numChargePoints: 10,
        arrivalProbabilityMult: 50
      };
      
      const highProbInput: SimulationInput = {
        numChargePoints: 10,
        arrivalProbabilityMult: 150
      };
      
      const lowProbResult = runSimulation(lowProbInput);
      const highProbResult = runSimulation(highProbInput);
      
      expect(highProbResult.chargingEventsPerYear).toBeGreaterThan(lowProbResult.chargingEventsPerYear);
    });

    it('should have higher energy consumption with more charge points', () => {
      const fewPointsInput: SimulationInput = {
        numChargePoints: 5
      };
      
      const manyPointsInput: SimulationInput = {
        numChargePoints: 15
      };
      
      const fewPointsResult = runSimulation(fewPointsInput);
      const manyPointsResult = runSimulation(manyPointsInput);
      
      expect(manyPointsResult.chargingEventsPerYear).toBeGreaterThan(fewPointsResult.chargingEventsPerYear);
    });
  });
});
