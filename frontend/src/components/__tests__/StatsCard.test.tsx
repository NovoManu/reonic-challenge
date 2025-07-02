import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '../StatsCard';

describe('StatsCard', () => {
  it('renders with the correct value and label', () => {
    render(<StatsCard value={42} label="Test Label" />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies the correct styling classes', () => {
    render(<StatsCard value={42} label="Test Label" />);
    
    const container = screen.getByText('42').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-teal-100');
    expect(container).toHaveClass('rounded');
    expect(container).toHaveClass('p-4');
    expect(container).toHaveClass('text-center');
  });

  it('formats the value and label with correct styling', () => {
    render(<StatsCard value={42} label="Test Label" />);
    
    const valueElement = screen.getByText('42');
    const labelElement = screen.getByText('Test Label');
    
    expect(valueElement).toHaveClass('text-2xl');
    expect(valueElement).toHaveClass('font-bold');
    expect(labelElement).toHaveClass('text-xs');
    expect(labelElement).toHaveClass('text-gray-700');
  });
});
