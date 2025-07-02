export interface SimulationInput {
    numChargePoints: number;
    arrivalProbabilityMult?: number;
    carConsumption?: number;
    chargingPower?: number;
}

export const validateSimulationInput = (input: Partial<SimulationInput>): void => {
    if (input.numChargePoints === undefined) {
        throw new Error('numChargePoints is required');
    }
    
    if (typeof input.numChargePoints !== 'number' || input.numChargePoints <= 0) {
        throw new Error('numChargePoints must be a positive number');
    }
    
    if (input.arrivalProbabilityMult !== undefined && 
        (typeof input.arrivalProbabilityMult !== 'number' || input.arrivalProbabilityMult < 0)) {
        throw new Error('arrivalProbabilityMult must be a non-negative number');
    }
    
    if (input.carConsumption !== undefined && 
        (typeof input.carConsumption !== 'number' || input.carConsumption <= 0)) {
        throw new Error('carConsumption must be a positive number');
    }
    
    if (input.chargingPower !== undefined && 
        (typeof input.chargingPower !== 'number' || input.chargingPower <= 0)) {
        throw new Error('chargingPower must be a positive number');
    }
};

export const DEFAULT_SIMULATION_VALUES = {
    arrivalProbabilityMult: 100,
    carConsumption: 18,
    chargingPower: 11
};

export const applyDefaultValues = (input: Partial<SimulationInput>): SimulationInput => {
    return {
        numChargePoints: input.numChargePoints as number,
        arrivalProbabilityMult: input.arrivalProbabilityMult ?? DEFAULT_SIMULATION_VALUES.arrivalProbabilityMult,
        carConsumption: input.carConsumption ?? DEFAULT_SIMULATION_VALUES.carConsumption,
        chargingPower: input.chargingPower ?? DEFAULT_SIMULATION_VALUES.chargingPower
    };
};
