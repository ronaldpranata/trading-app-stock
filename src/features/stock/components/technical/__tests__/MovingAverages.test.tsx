import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MovingAverages from '../MovingAverages';

describe('MovingAverages', () => {
  it('renders simple moving averages correctly', () => {
    render(<MovingAverages sma20={100} sma50={90} sma200={80} currentPrice={105} />);
    
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$90.00')).toBeInTheDocument();
    expect(screen.getByText('$80.00')).toBeInTheDocument();
  });

  it('displays Golden Cross when SMA50 > SMA200', () => {
    render(<MovingAverages sma20={100} sma50={90} sma200={80} currentPrice={100} />);
    expect(screen.getByText('Golden Cross Active')).toBeInTheDocument();
  });

  it('displays Death Cross when SMA50 <= SMA200', () => {
    render(<MovingAverages sma20={100} sma50={80} sma200={90} currentPrice={100} />);
    expect(screen.getByText('Death Cross Active')).toBeInTheDocument();
  });
});
