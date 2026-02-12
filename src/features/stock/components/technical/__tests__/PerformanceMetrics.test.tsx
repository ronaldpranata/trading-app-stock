import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PerformanceMetrics from '../PerformanceMetrics';

describe('PerformanceMetrics', () => {
  const metrics = {
    yearlyReturn: 15.5,
    volatility: 20.2,
    sharpeRatio: 1.5,
    maxDrawdown: 10.1
  };

  it('renders all performance metrics correctly', () => {
    render(<PerformanceMetrics metrics={metrics} />);
    
    expect(screen.getByText('Return')).toBeInTheDocument();
    expect(screen.getByText('+15.5%')).toBeInTheDocument();
    
    expect(screen.getByText('Volatility')).toBeInTheDocument();
    expect(screen.getByText('20.2%')).toBeInTheDocument();
    
    expect(screen.getByText('Sharpe')).toBeInTheDocument();
    expect(screen.getByText('1.50')).toBeInTheDocument();
    
    expect(screen.getByText('Max DD')).toBeInTheDocument();
    expect(screen.getByText('-10.1%')).toBeInTheDocument();
  });
});
