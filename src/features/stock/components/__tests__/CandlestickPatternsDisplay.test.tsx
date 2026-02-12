import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CandlestickPatternsDisplay from '../CandlestickPatternsDisplay';
import { CandlestickAnalysis } from '@/types/stock';

// Mock sub-components
vi.mock('../candlestick/PatternScore', () => ({
  default: ({ score }: any) => <div data-testid="pattern-score">Score: {score}</div>
}));
vi.mock('../candlestick/PatternSummaryCounts', () => ({
  default: () => <div data-testid="pattern-summary">Counts</div>
}));
vi.mock('../candlestick/PatternList', () => ({
  default: ({ title }: any) => <div data-testid="pattern-list">{title}</div>
}));
vi.mock('../candlestick/PatternLegend', () => ({
  default: () => <div data-testid="pattern-legend">Legend</div>
}));

describe('CandlestickPatternsDisplay', () => {
  const mockAnalysis: CandlestickAnalysis = {
    patterns: [
      { name: 'Doji', direction: 'neutral', reliability: 0.5, description: 'Indecision', type: 'reversal', index: 0 },
      { name: 'Hammer', direction: 'bullish', reliability: 0.8, description: 'Reversal', type: 'bullish', index: 1 }
    ],
    overallBias: 'bullish',
    score: 75,
    recentPatterns: []
  };

  it('renders empty state when analysis is null', () => {
    render(<CandlestickPatternsDisplay analysis={null} />);
    expect(screen.getByText('No candlestick data available')).toBeInTheDocument();
  });

  it('renders components when analysis is provided', () => {
    render(<CandlestickPatternsDisplay analysis={mockAnalysis} />);
    
    expect(screen.getByText('Candlestick Patterns')).toBeInTheDocument();
    expect(screen.getByText('bullish')).toBeInTheDocument(); // Overall bias
    expect(screen.getByTestId('pattern-score')).toHaveTextContent('Score: 75');
    expect(screen.getByTestId('pattern-summary')).toBeInTheDocument();
    expect(screen.getAllByTestId('pattern-list').length).toBeGreaterThan(0);
    expect(screen.getByTestId('pattern-legend')).toBeInTheDocument();
  });
});
