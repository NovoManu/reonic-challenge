import { apiService } from './base.ts'
import type { SimulationInput, SimulationResult } from '../types.ts';

const RESOURCE = '/simulate'

async function simulate(simulationInput: SimulationInput): Promise<SimulationResult> {
  return (await apiService.post(RESOURCE, simulationInput, { 'Content-Type': 'application/json' })) as SimulationResult;
}

export const simulationService = {
  simulate,
}