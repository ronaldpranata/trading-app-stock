import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FundamentalAnalysis from '../FundamentalAnalysis';
import { FundamentalData } from '@/features/stock/types';

// Mock sub-components
vi.mock('../fundamental/MetricBox', () => ({
  default: ({ label, value }: any) => <div data-testid="metric-box">{label}: {value}</div>
}));
vi.mock('../fundamental/CryptoMetrics', () => ({
  default: () => <div data-testid="crypto-metrics">Crypto View</div>
}));
vi.mock('../fundamental/ValuationAnalysis', () => ({
  default: () => <div data-testid="valuation-analysis">Valuation View</div>
}));
vi.mock('../fundamental/ProfitabilityGrowth', () => ({
  default: () => <div data-testid="profitability-growth">Profitability View</div>
}));

describe('FundamentalAnalysis', () => {
  const mockData: FundamentalData = {
    marketCap: 1000000,
    peRatio: 20,
    pegRatio: 1.5,
    pbRatio: 2,
    psRatio: 5,
    debtToEquity: 0.5,
    roe: 15,
    profitMargin: 20,
    dividendYield: 1.5,
    beta: 1.1,
    evToEbitda: 12,
    eps: 5,
    epsGrowth: 10,
    revenueGrowth: 15,
    fiftyTwoWeekHigh: 200,
    fiftyTwoWeekLow: 100,
    avgVolume: 500000,
    dcf: { bull: 200, bear: 100, base: 150, source: 'calculated' }
  };

  it('renders loading state when data is null', () => {
    render(<FundamentalAnalysis data={null} currentPrice={150} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders CryptoMetrics for crypto symbols', () => {
    render(<FundamentalAnalysis data={mockData} currentPrice={150} symbol="BTC-USD" />);
    expect(screen.getByTestId('crypto-metrics')).toBeInTheDocument();
    expect(screen.queryByTestId('valuation-analysis')).not.toBeInTheDocument();
  });

  it('renders Valuation and Profitability for stock symbols', () => {
    render(<FundamentalAnalysis data={mockData} currentPrice={150} symbol="AAPL" />);
    expect(screen.getByTestId('valuation-analysis')).toBeInTheDocument();
    expect(screen.getByTestId('profitability-growth')).toBeInTheDocument();
    expect(screen.getByTestId('metric-box')).toHaveTextContent('Market Cap: 1000000');
  });
});
