import { validateInput } from '../../src/api/inputs';

describe('Input Validation', () => {
  describe('validateInput', () => {
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
    
    it('should throw error for invalid arrivalProbabilityMult', () => {
      const invalidInputs = [
        { numChargePoints: 10, arrivalProbabilityMult: -1 },
        { numChargePoints: 10, arrivalProbabilityMult: '100' as any },
      ];
      
      invalidInputs.forEach(input => {
        expect(() => validateInput(input)).toThrow('arrivalProbabilityMult must be a non-negative number');
      });
    });
    
    it('should throw error for invalid carConsumption', () => {
      const invalidInputs = [
        { numChargePoints: 10, carConsumption: 0 },
        { numChargePoints: 10, carConsumption: -1 },
        { numChargePoints: 10, carConsumption: '18' as any },
      ];
      
      invalidInputs.forEach(input => {
        expect(() => validateInput(input)).toThrow('carConsumption must be a positive number');
      });
    });
    
    it('should throw error for invalid chargingPower', () => {
      const invalidInputs = [
        { numChargePoints: 10, chargingPower: 0 },
        { numChargePoints: 10, chargingPower: -1 },
        { numChargePoints: 10, chargingPower: '11' as any },
      ];
      
      invalidInputs.forEach(input => {
        expect(() => validateInput(input)).toThrow('chargingPower must be a positive number');
      });
    });
  });
});
