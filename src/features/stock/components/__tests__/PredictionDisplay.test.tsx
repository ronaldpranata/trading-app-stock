import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PredictionDisplay from '../PredictionDisplay';
import { PredictionResult } from '@/features/stock/types';

// Mock sub-components
vi.mock('../prediction/PredictionSkeleton', () => ({
  default: () => <div data-testid="prediction-skeleton">Loading...</div>
}));
vi.mock('../prediction/PredictionDirectionCard', () => ({
  default: ({ prediction }: any) => <div data-testid="prediction-direction">{prediction.direction}</div>
}));
vi.mock('../prediction/PredictionTargets', () => ({
  default: () => <div data-testid="prediction-targets">Targets</div>
}));
vi.mock('../prediction/PredictionScores', () => ({
  default: () => <div data-testid="prediction-scores">Scores</div>
}));
vi.mock('../prediction/TimeframesSummary', () => ({
  default: () => <div data-testid="timeframes-summary">Timeframes</div>
}));

describe('PredictionDisplay', () => {
  const mockPrediction: PredictionResult = {
    direction: 'BULLISH',
    confidence: 80,
    targetPrice: 160,
    stopLoss: 140,
    technicalScore: 85,
    fundamentalScore: 75,
    sentimentScore: 60,
    signals: [],
    recommendation: 'BUY',
    timeframePredictions: [
      { 
        timeframe: 'day', 
        direction: 'BULLISH', 
        confidence: 80, 
        targetPrice: 160, 
        stopLoss: 140,
        expectedChange: 10,
        expectedChangePercent: 6.6,
        riskRewardRatio: 2.0
      }
    ]
  };

  it('renders loading skeleton when isLoading is true', () => {
    render(<PredictionDisplay prediction={null} currentPrice={150} isLoading={true} />);
    expect(screen.getByTestId('prediction-skeleton')).toBeInTheDocument();
  });

  it('renders generating state when prediction is null', () => {
    render(<PredictionDisplay prediction={null} currentPrice={150} isLoading={false} />);
    expect(screen.getByText('Generating prediction...')).toBeInTheDocument();
  });

  it('renders all sub-components when prediction is available', () => {
    render(<PredictionDisplay prediction={mockPrediction} currentPrice={150} />);
    
    expect(screen.getByTestId('prediction-direction')).toHaveTextContent('BULLISH');
    expect(screen.getByTestId('prediction-targets')).toBeInTheDocument();
    expect(screen.getByTestId('prediction-scores')).toBeInTheDocument();
    expect(screen.getByTestId('timeframes-summary')).toBeInTheDocument();
  });
});
