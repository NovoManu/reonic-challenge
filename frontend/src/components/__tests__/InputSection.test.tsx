import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputSection } from '../InputSection';

describe('InputSection', () => {
  const mockOnRunSimulation = vi.fn();
  
  beforeEach(() => {
    mockOnRunSimulation.mockReset();
  });

  it('renders with default values', () => {
    render(
      <InputSection 
        onRunSimulation={mockOnRunSimulation} 
        loading={false} 
        error={null} 
      />
    );
    
    expect(screen.getByText('Input Parameters')).toBeInTheDocument();
    
    const countInputs = screen.getAllByRole('spinbutton');
    expect(countInputs[0]).toHaveValue(20);
    expect(countInputs[1]).toHaveValue(11);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    expect(countInputs[2]).toHaveValue(18);
    
    expect(screen.getByText('Run Simulation')).toBeInTheDocument();
  });

  it('calls onRunSimulation with correct parameters when button is clicked', async () => {
    render(
      <InputSection 
        onRunSimulation={mockOnRunSimulation} 
        loading={false} 
        error={null} 
      />
    );
    
    const runButton = screen.getByText('Run Simulation');
    await userEvent.click(runButton);
    
    expect(mockOnRunSimulation).toHaveBeenCalledTimes(1);
    expect(mockOnRunSimulation).toHaveBeenCalledWith({
      numChargePoints: 20,
      arrivalProbabilityMult: 100,
      carConsumption: 18,
      chargingPower: 11
    });
  });

  it('allows adding a new charge point type', async () => {
    render(
      <InputSection 
        onRunSimulation={mockOnRunSimulation} 
        loading={false} 
        error={null} 
      />
    );
    
    const addButton = screen.getByText('Add Type');
    await userEvent.click(addButton);
    
    const countInputs = screen.getAllByRole('spinbutton');
    expect(countInputs.length).toBe(5);
  });

  it('allows removing a charge point type', async () => {
    render(
      <InputSection 
        onRunSimulation={mockOnRunSimulation} 
        loading={false} 
        error={null} 
      />
    );
    
    const addButton = screen.getByText('Add Type');
    await userEvent.click(addButton);
    
    const removeButtons = screen.getAllByLabelText(/Remove charge point type/);
    await userEvent.click(removeButtons[0]);
    
    const countInputs = screen.getAllByRole('spinbutton');
    expect(countInputs.length).toBe(3);
  });

  it('disables the run button when loading is true', () => {
    render(
      <InputSection 
        onRunSimulation={mockOnRunSimulation} 
        loading={true} 
        error={null} 
      />
    );
    
    const runButton = screen.getByText('Running...');
    expect(runButton).toBeDisabled();
  });

  it('displays error message when error is provided', () => {
    const errorMessage = 'Test error message';
    render(
      <InputSection 
        onRunSimulation={mockOnRunSimulation} 
        loading={false} 
        error={errorMessage} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('updates charge point values when inputs change', async () => {
    render(
      <InputSection 
        onRunSimulation={mockOnRunSimulation} 
        loading={false} 
        error={null} 
      />
    );
    
    const countInputs = screen.getAllByRole('spinbutton');
    const countInput = countInputs[0];
    const powerInput = countInputs[1];
    
    await userEvent.clear(countInput);
    await userEvent.type(countInput, '30');
    
    await userEvent.clear(powerInput);
    await userEvent.type(powerInput, '22');
    
    const runButton = screen.getByText('Run Simulation');
    await userEvent.click(runButton);
    
    expect(mockOnRunSimulation).toHaveBeenCalledWith({
      numChargePoints: 30,
      arrivalProbabilityMult: 100,
      carConsumption: 18,
      chargingPower: 22
    });
  });

  it('has the teal-700 color for the buttons', () => {
    render(
      <InputSection 
        onRunSimulation={mockOnRunSimulation} 
        loading={false} 
        error={null} 
      />
    );
    
    const addButton = screen.getByText('Add Type');
    const runButton = screen.getByText('Run Simulation');
    
    expect(addButton).toHaveClass('bg-teal-700');
    expect(runButton).toHaveClass('bg-teal-700');
  });
});
