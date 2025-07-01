import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

describe('Layout', () => {
  it('renders header with correct text', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getByText('EV Charging Simulation')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders footer with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Layout>Test Content</Layout>);
    expect(screen.getByText(`© ${currentYear} EV Charging Simulation`)).toBeInTheDocument();
  });

  it('has the teal-700 background color for header and footer', () => {
    render(<Layout>Test Content</Layout>);
    const header = screen.getByText('EV Charging Simulation').closest('header');
    const footer = screen.getByText(new RegExp(`© ${new Date().getFullYear()} EV Charging Simulation`)).closest('footer');
    
    expect(header).toHaveClass('bg-teal-700');
    expect(footer).toHaveClass('bg-teal-700');
  });
});
