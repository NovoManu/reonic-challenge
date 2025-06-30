# EV Charging Simulation Backend

This backend service provides APIs to manage EV charging simulation inputs and run simulations.

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

1. Install dependencies:
```bash
npm install
```

2. Start the PostgreSQL database:
```bash
docker-compose up -d
```

3. Set up environment variables:
```bash
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reonic" > .env
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

The server will start at http://localhost:4000

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
