// Set a fixed timezone for consistent date-based tests
process.env.TZ = 'UTC';

// Increase the timeout for tests to avoid flaky tests
jest.setTimeout(10000);

// Mock console.error to avoid polluting test output
// but still keep track of errors for debugging
const originalConsoleError = console.error;
let errors = [];

console.error = (...args) => {
  errors.push(args.join(' '));
  // Comment out the next line to silence console errors during tests
  // originalConsoleError(...args);
};

// Reset mocks and error tracking before each test
beforeEach(() => {
  errors = [];
});

// Global teardown
afterAll(() => {
  // Restore original console.error
  console.error = originalConsoleError;
});
