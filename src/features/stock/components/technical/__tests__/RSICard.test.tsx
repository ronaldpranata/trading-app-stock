import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RSICard from '../RSICard';

describe('RSICard', () => {
  it('displays Oversold label for RSI < 30', () => {
    render(<RSICard rsi={25} />);
    expect(screen.getByText('Oversold')).toBeInTheDocument();
    expect(screen.getByText('25.0')).toBeInTheDocument();
  });

  it('displays Overbought label for RSI > 70', () => {
    render(<RSICard rsi={75} />);
    expect(screen.getByText('Overbought')).toBeInTheDocument();
    expect(screen.getByText('75.0')).toBeInTheDocument();
  });

  it('displays Neutral label for RSI between 30 and 70', () => {
    render(<RSICard rsi={50} />);
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('50.0')).toBeInTheDocument();
  });
});
