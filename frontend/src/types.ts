export interface SimulationInput {
  numChargePoints: number;
  arrivalProbabilityMult: number;
  carConsumption: number;
  chargingPower: number;
}

export interface SimulationResult {
  id: number;
  theoreticalMaxPower: number;
  actualMaxPower: number;
  concurrencyFactor: number;
  totalEnergyKWh: number;
  chargingEventsPerYear: number;
  chargingEventsPerMonth: number;
  chargingEventsPerWeek: number;
  chargingEventsPerDay: number;
  exemplaryDay: string;
  chargingValues: number[];
}