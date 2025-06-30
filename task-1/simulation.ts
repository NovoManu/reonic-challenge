// Step 1: Basic parameters and types
type ChargingStation = number;
type PowerDemand = number[];
type ProbabilityDistribution = number[];

const NUM_CHARGEPOINTS: number = 20;
const POWER_KW: number = 11;
const MINUTES_PER_TICK: number = 15;
const TICKS_PER_HOUR: number = 60 / MINUTES_PER_TICK;
const HOURS_PER_DAY: number = 24;
const DAYS_PER_YEAR: number = 365;
const TOTAL_TICKS: number = TICKS_PER_HOUR * HOURS_PER_DAY * DAYS_PER_YEAR;
const KM_TO_KWH: number = 18 / 100;

// Step 2: Arrival probabilities for each tick
const hourlyArrivalPercent: number[] = [
  0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94,  // 00:00-07:59
  2.83, 2.83,                                      // 08:00-09:59
  5.66, 5.66, 5.66,                                // 10:00-12:59
  7.55, 7.55, 7.55,                                // 13:00-15:59
  10.38, 10.38, 10.38,                             // 16:00-18:59
  4.72, 4.72, 4.72,                                // 19:00-21:59
  0.94, 0.94                                       // 22:00-23:59
];

const normalizedHourlyProb: ProbabilityDistribution = hourlyArrivalPercent.map(p => p / 100);
const tickArrivalProb: ProbabilityDistribution = normalizedHourlyProb.flatMap(prob => 
  Array(TICKS_PER_HOUR).fill(prob / TICKS_PER_HOUR)
);

// Step 3: Distribution of charging needs
const demandDistances: number[] = [0, 5, 10, 20, 30, 50, 100, 200, 300];
const demandProbs: number[] = [24.31, 14.9, 9.8, 11.76, 8.82, 11.76, 10.78, 4.9, 2.94];
const normalizedDemandProbs: ProbabilityDistribution = demandProbs.map(p => p / 100);

// Weighted random selection function
function weightedRandom<T>(options: T[], probs: ProbabilityDistribution): T {
  const r: number = Math.random();
  let cum: number = 0;
  for (let i = 0; i < options.length; i++) {
    cum += probs[i];
    if (r <= cum) return options[i];
  }
  return options[options.length - 1]; // fallback
}

// Step 4: Charging simulation
const powerDemand: PowerDemand = Array(TOTAL_TICKS).fill(0);            // power demand over time
const endTimes: ChargingStation[] = Array(NUM_CHARGEPOINTS).fill(0);    // when each station will be free

// Simulation loop
for (let tick: number = 0; tick < TOTAL_TICKS; tick++) {
  for (let cp: number = 0; cp < NUM_CHARGEPOINTS; cp++) {
    // If charging station is free
    if (endTimes[cp] <= tick) {
      // Check if a car arrives at this tick
      const dailyTick: number = tick % tickArrivalProb.length;
      const chance: number = tickArrivalProb[dailyTick];
      if (Math.random() < chance) {
        // Select charging distance
        const km: number = weightedRandom(demandDistances, normalizedDemandProbs);
        if (km > 0) {
          const kwh: number = km * KM_TO_KWH;
          const ticksNeeded: number = Math.ceil(kwh / (POWER_KW * (MINUTES_PER_TICK / 60)));

          // Reserve the station
          endTimes[cp] = tick + ticksNeeded;

          // Increase power demand for the next ticksNeeded ticks
          for (let t: number = tick; t < Math.min(tick + ticksNeeded, TOTAL_TICKS); t++) {
            powerDemand[t] += POWER_KW;
          }
        }
      }
    }
  }
}

// Calculate final statistics
const totalEnergyKWh: number = powerDemand.reduce((a, b) => a + b, 0) * (MINUTES_PER_TICK / 60);
const theoreticalMaxKW: number = NUM_CHARGEPOINTS * POWER_KW;
const actualMaxKW: number = Math.max(...powerDemand);
const concurrencyFactor: number = actualMaxKW / theoreticalMaxKW;
const chargingValues = powerDemand.slice(0, TICKS_PER_HOUR * HOURS_PER_DAY);

// Output results
console.log("🔌 Total energy consumed (kWh):", totalEnergyKWh.toFixed(2));
console.log("⚡ Theoretical max power (kW):", theoreticalMaxKW);
console.log("📈 Actual max power (kW):", actualMaxKW);
console.log("📊 Concurrency factor:", concurrencyFactor.toFixed(2));
console.log("⚡ Charging values:", chargingValues);