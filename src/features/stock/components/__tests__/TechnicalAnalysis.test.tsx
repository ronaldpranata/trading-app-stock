import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TechnicalAnalysis from '../TechnicalAnalysis';
import { TechnicalIndicators } from '@/types/stock';

// Mock sub-components to focus on TechnicalAnalysis logic
vi.mock('../technical/PerformanceMetrics', () => ({
  default: ({ metrics }: any) => <div data-testid="performance-metrics">{metrics.yearlyReturn}%</div>
}));
vi.mock('../technical/MovingAverages', () => ({
  default: ({ sma20 }: any) => <div data-testid="moving-averages">SMA20: {sma20}</div>
}));
vi.mock('../technical/RSICard', () => ({
  default: ({ rsi }: any) => <div data-testid="rsi-card">RSI: {rsi}</div>
}));
vi.mock('../technical/MACDCard', () => ({
  default: ({ macdLine }: any) => <div data-testid="macd-card">MACD: {macdLine}</div>
}));
vi.mock('../technical/BollingerStochastic', () => ({
  default: ({ atr }: any) => <div data-testid="bollinger-stochastic">ATR: {atr}</div>
}));
vi.mock('../technical/ExtendedIndicators', () => ({
  default: () => <div data-testid="extended-indicators">Extended</div>
}));

describe('TechnicalAnalysis', () => {
  const mockIndicators: TechnicalIndicators = {
    rsi: 50,
    macd: { macdLine: 1.5, signalLine: 1.2, histogram: 0.3 },
    bollingerBands: { upper: 155, middle: 150, lower: 145 },
    stochastic: { k: 60, d: 55 },
    atr: 2.5,
    sma20: 152,
    sma50: 148,
    sma200: 140,
    yearlyMetrics: {
      yearlyReturn: 15.5,
      volatility: 20,
      sharpeRatio: 1.2,
      maxDrawdown: 10,
      winRate: 60
    },
    adx: 30,
    williamsR: -40,
    cci: 50,
    roc: 5,
    ema12: 155,
    ema26: 150,
    obv: 1000000
  };

  it('renders loading state when indicators are null', () => {
    render(<TechnicalAnalysis indicators={null} currentPrice={150} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders all sub-components when indicators are provided', () => {
    render(<TechnicalAnalysis indicators={mockIndicators} currentPrice={150} />);
    
    expect(screen.getByTestId('performance-metrics')).toBeInTheDocument();
    expect(screen.getByTestId('moving-averages')).toBeInTheDocument();
    expect(screen.getByTestId('rsi-card')).toBeInTheDocument();
    expect(screen.getByTestId('macd-card')).toBeInTheDocument();
    expect(screen.getByTestId('bollinger-stochastic')).toBeInTheDocument();
    expect(screen.getByTestId('extended-indicators')).toBeInTheDocument();
  });

  it('passes correct props to sub-components', () => {
    render(<TechnicalAnalysis indicators={mockIndicators} currentPrice={150} />);
    
    expect(screen.getByTestId('performance-metrics')).toHaveTextContent('15.5%');
    expect(screen.getByTestId('moving-averages')).toHaveTextContent('SMA20: 152');
    expect(screen.getByTestId('rsi-card')).toHaveTextContent('RSI: 50');
  });
});
