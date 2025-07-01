import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock for chart.js to prevent errors in tests
vi.mock('chart.js', () => {
  return {
    Chart: {
      register: vi.fn(),
    },
    registerables: [],
    CategoryScale: class {},
    LinearScale: class {},
    BarElement: class {},
    Title: class {},
    Tooltip: class {},
    Legend: class {},
    PointElement: class {},
    LineElement: class {},
    TimeScale: class {},
  };
});

vi.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Line: () => null,
}));
