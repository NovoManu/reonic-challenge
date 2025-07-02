import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartSection } from '../ChartSection';
import type { SimulationResult } from '../../types';

// The chart.js mock is defined in src/test/setup.ts

// Mock the react-chartjs-2 components with testids for easier testing
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Line: () => <div data-testid="line-chart">Line Chart</div>,
}));

describe('ChartSection', () => {
  const mockSimResult: SimulationResult = {
    id: 1,
    theoreticalMaxPower: 100,
    actualMaxPower: 75,
    concurrencyFactor: 0.75,
    totalEnergyKWh: 500,
    chargingEventsPerYear: 1000,
    chargingEventsPerMonth: 83,
    chargingEventsPerWeek: 19,
    chargingEventsPerDay: 2.7,
    exemplaryDay: '2025-07-01T00:00:00.000Z',
    chargingValues: [10, 20, 30, 40, 50, 60, 50, 40, 30, 20, 10],
  };

  it('renders both charts when simulation result is provided', () => {
    render(<ChartSection simResult={mockSimResult} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders the exemplary date correctly', () => {
    render(<ChartSection simResult={mockSimResult} />);
    
    // Format should match the one in the component: weekday, month day, year
    const dateRegex = /\w+, \w+ \d+, \d{4}/;
    const dateElements = screen.getAllByText(dateRegex);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('renders with default values when simulation result is null', () => {
    render(<ChartSection simResult={null} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Not available')).toBeInTheDocument();
  });

  it('renders in a responsive grid layout', () => {
    render(<ChartSection simResult={mockSimResult} />);
    
    // We need to go up two levels to find the grid container
    const chartDiv = screen.getByTestId('bar-chart').closest('div');
    const gridContainer = chartDiv?.parentElement?.parentElement;
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('md:grid-cols-2');
    expect(gridContainer).toHaveClass('gap-4');
  });
});
