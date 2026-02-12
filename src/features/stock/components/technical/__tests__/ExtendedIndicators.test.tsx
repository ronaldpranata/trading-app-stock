import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ExtendedIndicators from '../ExtendedIndicators';
import { TechnicalIndicators } from '@/types/stock';

describe('ExtendedIndicators', () => {
  const mockIndicators: TechnicalIndicators = {
    rsi: 50,
    macd: { macdLine: 0, signalLine: 0, histogram: 0 },
    bollingerBands: { upper: 0, lower: 0, middle: 0 },
    stochastic: { k: 0, d: 0 },
    atr: 0,
    sma20: 0,
    sma50: 0,
    sma200: 0,
    ema12: 0,
    ema26: 0,
    obv: 0,
  };

  it('renders nothing when adx and cci are undefined', () => {
    const { container } = render(<ExtendedIndicators indicators={mockIndicators} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders ADX when present', () => {
    render(<ExtendedIndicators indicators={{ ...mockIndicators, adx: 30 }} />);
    expect(screen.getByText('ADX')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('renders CCI when present', () => {
    render(<ExtendedIndicators indicators={{ ...mockIndicators, cci: 150 }} />);
    expect(screen.getByText('CCI')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });
});
