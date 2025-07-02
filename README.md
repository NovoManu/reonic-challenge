# EV Charging Station Simulator

This project simulates the power demand and energy consumption of multiple EV charging stations over a year. It helps determine optimal charging infrastructure by analyzing usage patterns and calculating key metrics like peak power demand and concurrency factors.

## Project Overview

This repository contains three main components:

1. **Task 1**: A simulation program that models EV charging stations over a year
2. **Task 2a**: A frontend application for visualizing simulation parameters and results
3. **Task 2b**: A backend API for storing and retrieving simulation data

## Problem Context

As a store owner with parking spaces (e.g., 200 spots), you're planning to install EV charging stations. Before installation, you need to understand:
- How much power these chargers will need
- How much energy they'll consume
- What the actual peak power demand will be compared to theoretical maximum

For example, with 20 charging stations at 11kW each:
- Theoretical maximum power demand: 220kW
- Actual peak demand: typically much lower due to usage patterns
- Understanding this difference helps optimize infrastructure costs

## Task 1: Simulation Logic

The simulation models 20 charging points with 11kW power each over a full year in 15-minute intervals (35,040 ticks). It uses realistic probability distributions for:

- EV arrival times (varying by hour of day)
- Charging demand (in kilometers, converted to kWh)

### Key Features

- Simulates charging station usage with realistic arrival patterns
- Handles concurrent charging sessions and station availability
- Calculates key metrics:
  - Total energy consumed (kWh)
  - Theoretical maximum power demand (kW)
  - Actual maximum power demand (kW)
  - Concurrency factor (ratio of actual to theoretical maximum)

### Implementation Details

- Written in TypeScript
- Uses probability distributions from provided data
- Assumes 18kWh/100km energy consumption for EVs
- Simulates one full non-leap year (365 days)

## Task 2a: Frontend

The frontend application provides a user-friendly interface for:

- Setting simulation parameters
  - Number of charging points
  - Arrival probability multiplier
  - Vehicle consumption rate
  - Charging power per point
- Visualizing simulation results
  - Power demand charts
  - Energy consumption statistics
  - Charging event analytics

### Technical Stack

- React with TypeScript
- Tailwind CSS for styling
- Chart.js for data visualization
- Vite for build tooling

## Task 2b: Backend

The backend provides a RESTful API for:

- Creating, reading, updating, and deleting simulation parameters
- Running simulations with specified parameters
- Storing simulation results in a database
- Retrieving historical simulation data

### Technical Stack

- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- Jest for testing

## Project Structure

```
.
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── Makefile                    # Project automation commands
│
├── task-1/                     # Simulation implementation
│   └── simulation.ts           # Main simulation logic
│
├── frontend/                   # Frontend application
│   ├── public/                 # Static assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable UI components
│   │   ├── views/             # Page components
│   │   ├── api/               # API client code
│   │   ├── layout/            # Layout components
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── App.tsx            # Main application component
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts         # Vite configuration
│
└── backend/                    # Backend API
    ├── src/
    │   ├── api/              # API routes and controllers
    │   ├── services/         # Business logic
    │   ├── utils/            # Utility functions
    │   ├── index.ts          # Application entry point
    │   └── server.ts         # Express server setup
    ├── docker-compose.yml    # Docker compose for PostgreSQL
    ├── package.json
    ├── tsconfig.json
    └── jest.config.js        # Test configuration
```

## Setup and Installation

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)
- Docker (for running PostgreSQL)
- Make (optional, for using Makefile commands)

### Installation

#### Using Makefile

1. Clone the repository:
   ```bash
   git clone git@github.com:NovoManu/reonic-challenge.git
   cd reonic-challenge
   ```

2. Set up environment variables:
   ```bash
   # Navigate to the backend directory
   cd backend
   
   # Copy the example environment file
   cp .env.example .env
   
   # Edit the .env file with your configuration
   # vim .env  # or use your preferred text editor

   # Navigate back to root directory
   cd .. 
   ```
   
   Update the environment variables in the `.env` file according to your local setup. The available configuration options are documented in the `.env.example` file.

3. Install all dependencies:
   ```bash
   make install
   ```

3. Start the PostgreSQL database using Docker:
   ```bash
   make start-db
   # or manually with
   cd backend && docker-compose up -d
   ```

4. Set up the database (for backend):
   ```bash
   make migrate-backend
   ```

#### Without Makefile

1. Clone the repository:
   ```bash
   git clone git@github.com:NovoManu/reonic-challenge.git
   cd reonic-challenge
   ```

2. Set up environment variables:
   ```bash
   # Navigate to the backend directory
   cd backend
   
   # Copy the example environment file
   cp .env.example .env
   
   # Edit the .env file with your configuration
   # nano .env  # or use your preferred text editor

   # Navigate back to root directory
   cd .. 
   ```
   
   Update the environment variables in the `.env` file according to your local setup. The available configuration options are documented in the `.env.example` file.

3. Install root dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   npm install --workspace=frontend
   ```

4. Install backend dependencies:
   ```bash
   npm install --workspace=backend
   npm run generate:backend
   ```

5. Start the PostgreSQL database using Docker:
   ```bash
   cd backend && docker-compose up -d
   cd ..
   ```

6. Set up the database (for backend):
   ```bash
   npm run migrate:backend
   ```

## Running the Project

### Using Makefile

1. Run the simulation:
   ```bash
   make run-simulation
   ```

2. Start the frontend development server:
   ```bash
   make dev-frontend
   ```

3. Start the backend development server:
   ```bash
   make dev-backend
   ```

4. Start both frontend and backend:
   ```bash
   make dev
   ```

### Without Makefile

1. Run the simulation:
   ```bash
   npm run simulate
   ```

2. Start the frontend development server:
   ```bash
   npm run dev:frontend
   ```

3. Start the backend development server:
   ```bash
   npm run dev:backend
   ```

4. Start both frontend and backend:
   ```bash
   npm run dev:all
   ```

## Building for Production

### Using Makefile

```bash
make build
```

### Without Makefile

```bash
npm run build:frontend
npm run build:backend
```

## Testing

### Using Makefile

```bash
make test
```

### Without Makefile

```bash
npm test --workspace=backend
npm test --workspace=frontend
```

## Key Features and Implementation Details

### Task 1: Simulation

- Uses hourly arrival probability distributions from the provided data
- Implements charging demand distribution based on kilometers driven
- Calculates power demand for each 15-minute interval
- Handles charging station occupancy and availability
- Outputs key metrics including concurrency factor

### Task 2a: Frontend

- Interactive parameter configuration
- Real-time visualization of simulation results
- Responsive design for various device sizes
- Chart visualizations for power demand and energy consumption
- Teal-700 color scheme to represent eco-friendly EV charging

### Task 2b: Backend

- RESTful API endpoints for CRUD operations
- Database schema for storing simulation parameters and results
- Authentication and authorization for API access
- Validation for input parameters
- Efficient data retrieval for visualization

## Potential Improvements

### Simulation Logic

- Implement more sophisticated EV departure models
- Add seasonal variations in arrival patterns
- Support different charger types (e.g., 5kW, 22kW, 50kW)
- Incorporate battery state-of-charge modeling
- Add weather effects on charging behavior

### Frontend

- Add more advanced visualization options
- Implement user authentication
- Add comparison views for multiple simulation scenarios
- Create dashboard for monitoring real-time charging
- Add export functionality for charts and data

### Backend

- Implement caching for frequently accessed data
- Add more sophisticated authentication mechanisms
- Create batch processing for multiple simulations
- Add real-time data streaming with WebSockets
- Implement data analytics for historical simulations

### CI/CD Configuration

- Set up automated testing with GitHub Actions
- Add automated deployment to staging/production environments
- Implement code quality checks (ESLint, Prettier)
- Add automated dependency updates (Dependabot)
- Include performance testing in CI pipeline
- Set up automated database migrations
- Add security scanning for dependencies
- Implement automated API documentation generation

## Conclusion

This project provides a comprehensive solution for simulating and analyzing EV charging infrastructure. The combination of accurate simulation, intuitive visualization, and robust data storage enables informed decision-making for optimal charging station deployment.

## License

ISC
