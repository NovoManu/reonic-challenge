# EV Charging Station Simulator Backend

This backend service provides APIs to manage EV charging simulation inputs and run simulations. It simulates the power demand and energy consumption of multiple EV charging stations over a year, helping determine optimal charging infrastructure by analyzing usage patterns and calculating key metrics like peak power demand and concurrency factors.

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

## Tech Stack

- TypeScript
- Node.js
- Fastify
- PostgreSQL
- Prisma ORM
- Docker

## Prerequisites

- Node.js 16+
- Docker and Docker Compose
- npm

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd reonic-challenge/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

4. Set up environment variables:
   ```bash
   echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reonic" > .env
   ```

5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The server will start at http://localhost:4000

## Running the Simulation

Run the simulation using the API endpoints below. The simulation will output:
- Total energy consumed in kWh
- Theoretical maximum power demand
- Actual maximum power demand
- Concurrency factor

## API Endpoints

### Simulation Inputs

- `POST /inputs` - Create a new simulation input
  ```json
  {
    "numChargePoints": 10,
    "arrivalProbabilityMult": 100,
    "carConsumption": 18,
    "chargingPower": 11
  }
  ```

- `GET /inputs` - List all simulation inputs
- `GET /inputs/:id` - Get a specific simulation input
- `PUT /inputs/:id` - Update a simulation input
- `DELETE /inputs/:id` - Delete a simulation input

### Simulations

- `POST /simulate/:inputId` - Run a simulation for the given input ID

## Example Usage

1. Create a simulation input:
```bash
curl -X POST http://localhost:4000/inputs -H "Content-Type: application/json" -d '{"numChargePoints": 10}'
```

2. Run a simulation:
```bash
curl -X POST http://localhost:4000/simulate/1
```
