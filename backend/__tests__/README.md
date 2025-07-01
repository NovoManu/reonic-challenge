# Backend Unit Tests

This directory contains unit tests for the EV charging station backend application.

## Test Structure

The tests are organized into the following directories:

- `api/`: Tests for API endpoints and input validation
  - `inputs.test.ts`: Tests for the input validation functions
  - `endpoints.test.ts`: Tests for API handlers
  - `routes.test.ts`: Integration tests for API routes using Fastify's inject method
- `services/`: Tests for service layer functions
  - `simulation.test.ts`: Tests for the simulation service
- `mocks/`: Mock implementations for testing
  - `prisma.mock.ts`: Mock for the Prisma client

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

To generate a coverage report:

```bash
npm run test:coverage
```

To run tests in CI environment:

```bash
npm run test:ci
```

## Test Coverage

The tests cover:

1. **Input Validation**: Testing the validation logic for simulation inputs
2. **Simulation Service**: Testing the core simulation functionality
3. **API Routes**: Testing the API endpoints for inputs and simulations

## Adding New Tests

When adding new features to the backend, please follow these guidelines:

1. Create test files in the appropriate directory
2. Use descriptive test names that explain what is being tested
3. Follow the Arrange-Act-Assert pattern in test cases
4. Mock external dependencies when appropriate
5. Aim for high test coverage of critical business logic
