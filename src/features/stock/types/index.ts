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
  waveType: "impulse" | "corrective";
  wavePhase: "motive" | "corrective";
  trendDirection: "up" | "down";
  waveProgress: number;
  pivotPoints: PivotPoint[];
  fibonacciLevels: FibonacciLevel[];
  nextWaveTarget: number;
  invalidationLevel: number;
  waveDescription: string;
  confidence: number;
}

export interface PivotPoint {
  type: "high" | "low";
  price: number;
  date: string;
  waveLabel: string;
}

export interface FibonacciLevel {
  level: number;
  price: number;
  label: string;
  type: "retracement" | "extension";
}

export interface YearlyMetrics {
  yearlyReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
}

export interface CandlestickPattern {
  type: string;
  name: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  reliability: number;
  description: string;
  index: number;
}

export interface CandlestickAnalysis {
  patterns: CandlestickPattern[];
  overallBias: 'bullish' | 'bearish' | 'neutral';
  score: number;
  recentPatterns: CandlestickPattern[];
}

export interface SupportResistanceLevel {
  level: number;
  type: 'support' | 'resistance';
  strength: number; // 1-10 scale based on touches/validity
  percentageDiff: number; // How far from current price
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
  candlestickAnalysis?: CandlestickAnalysis;
  supportResistance?: SupportResistanceLevel[];
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
  psRatio: number;
  pegRatio: number;
  eps: number;
  epsGrowth: number;
  dividendYield: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  avgVolume: number;
  debtToEquity: number;
  roe: number;
  revenueGrowth: number;
  profitMargin: number;
  evToEbitda: number;
  dcf: {
    source: 'calculated' | 'analyst';
    bull: number;
    base: number;
    bear: number;
  };
}

export type PredictionTimeframe = "day" | "week" | "month" | "quarter" | "year";

export interface TimeframePrediction {
  timeframe: PredictionTimeframe;
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidence: number;
  targetPrice: number;
  expectedChange: number;
  expectedChangePercent: number;
  stopLoss: number;
  riskRewardRatio: number;
}

export interface SentimentData {
  score: number; // 0 to 100
  sentiment: 'positive' | 'negative' | 'neutral';
  headlines: string[];
  keywordMatches?: { word: string; impact: 'positive' | 'negative' }[];
}

export interface PredictionResult {
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore?: number; // Added sentiment score
  signals: Signal[];
  recommendation: string;
  timeframePredictions: TimeframePrediction[];
}

export interface Signal {
  name: string;
  type: "bullish" | "bearish" | "neutral";
  strength: number;
  description: string;
}

// Stock data aggregate type
export interface StockData {
  symbol: string;
  quote: StockQuote | null;
  historicalData: HistoricalData[];
  fundamentalData: FundamentalData | null;
  technicalIndicators: TechnicalIndicators | null;
  prediction: PredictionResult | null;
  sentimentData?: SentimentData; // Added sentiment data
  isLoading: boolean;
  error: string | null;
}

export interface AnalysisResult {
  symbol: string;
  technicalIndicators: TechnicalIndicators;
  prediction: PredictionResult;
  sentimentData?: SentimentData;
}

export interface ReferenceData {
  historicalData: HistoricalData[];
  fundamentalData: FundamentalData | null;
  currentPrice: number;
  symbol: string;
  headlines?: string[];
}
