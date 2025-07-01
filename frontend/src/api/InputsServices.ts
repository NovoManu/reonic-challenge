import { apiService } from './base.ts'
import type { SimulationInput, SimulationResult } from '../types.ts';

const RESOURCE = '/inputs'

async function create(inputs: SimulationInput): Promise<SimulationResult> {
  return (await apiService.post(RESOURCE, inputs, { 'Content-Type': 'application/json' })) as SimulationResult;
}

export const inputsService = {
  create,
}