# EV Charging Station Simulator

This project simulates the power demand and energy consumption of multiple EV charging stations over a year. It helps determine optimal charging infrastructure by analyzing usage patterns and calculating key metrics like peak power demand and concurrency factors.

## Problem Context

As a store owner with parking spaces (e.g., 200 spots), you're planning to install EV charging stations. Before installation, you need to understand:
- How much power these chargers will need
- How much energy they'll consume
- What the actual peak power demand will be compared to theoretical maximum

For example, with 20 charging stations at 11kW each:
- Theoretical maximum power demand: 220kW
- Actual peak demand: typically much lower due to usage patterns
- Understanding this difference helps optimize infrastructure costs

## Features

- Simulates 20 charging points with 11kW power each
- Runs for one year in 15-minute intervals (35,040 ticks)
- Uses realistic arrival probability distributions
- Calculates:
  - Total energy consumed (kWh)
  - Theoretical maximum power demand (kW)
  - Actual maximum power demand (kW)
  - Concurrency factor (ratio of actual to theoretical maximum)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd reonic-challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Simulation

Run the simulation using:
```bash
npm run simulate
```

The simulation will output:
- Total energy consumed in kWh
- Theoretical maximum power demand
- Actual maximum power demand
- Concurrency factor (should be between 30-50%)

## Technical Details

- Written in TypeScript
- Uses probability distributions for:
  - EV arrival times (varying by hour of day)
  - Charging demand (in kilometers)
- Assumes 18kWh/100km energy consumption for EVs
- Handles concurrent charging sessions
- Accounts for charging station availability

## Project Structure

```
.
├── README.md
├── package.json
├── tsconfig.json
└── task-1/
    └── simulation.ts    # Main simulation logic
```

## Dependencies

- TypeScript
- ts-node
- Node.js types

## License

ISC
