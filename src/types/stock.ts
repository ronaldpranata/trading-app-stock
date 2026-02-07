export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  timestamp: number;
  cached?: boolean;
  simulated?: boolean;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ElliottWaveAnalysis {
  currentWave: number;
  waveType: 'impulse' | 'corrective';
  wavePhase: 'motive' | 'corrective';
  trendDirection: 'up' | 'down';
  waveProgress: number;
  pivotPoints: PivotPoint[];
  fibonacciLevels: FibonacciLevel[];
  nextWaveTarget: number;
  invalidationLevel: number;
  waveDescription: string;
  confidence: number;
}

export interface PivotPoint {
  type: 'high' | 'low';
  price: number;
  date: string;
  waveLabel: string;
}

export interface FibonacciLevel {
  level: number;
  price: number;
  label: string;
  type: 'retracement' | 'extension';
}

export interface YearlyMetrics {
  yearlyReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
}

export interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  sma200: number;
  ema12: number;
  ema26: number;
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  atr: number;
  obv: number;
  elliottWave?: ElliottWaveAnalysis;
  // Extended indicators using full year data
  adx?: number;
  williamsR?: number;
  cci?: number;
  roc?: number;
  yearlyMetrics?: YearlyMetrics;
}

export interface FundamentalData {
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  pegRatio: number; // Added PEG ratio
  eps: number;
  epsGrowth: number; // Added EPS growth rate
  dividendYield: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  avgVolume: number;
  debtToEquity: number;
  roe: number;
  revenueGrowth: number;
  profitMargin: number;
}

export type PredictionTimeframe = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface TimeframePrediction {
  timeframe: PredictionTimeframe;
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  targetPrice: number;
  expectedChange: number;
  expectedChangePercent: number;
  stopLoss: number;
  riskRewardRatio: number;
}

export interface PredictionResult {
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  technicalScore: number;
  fundamentalScore: number;
  signals: Signal[];
  recommendation: string;
  timeframePredictions: TimeframePrediction[];
}

export interface Signal {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  description: string;
}
