// Constants for the application

// Time ranges for charts
export const TIME_RANGES = [
  { id: '1D', label: '1D', days: 2 },
  { id: '1W', label: '1W', days: 5 },
  { id: '1M', label: '1M', days: 22 },
  { id: '3M', label: '3M', days: 66 },
  { id: '6M', label: '6M', days: 132 },
  { id: '1Y', label: '1Y', days: 252 },
  { id: 'YTD', label: 'YTD', days: 0 }
] as const;

export type TimeRange = typeof TIME_RANGES[number]['id'];

// Prediction timeframes
export const PREDICTION_TIMEFRAMES = [
  { id: 'day', label: '1D', days: 1 },
  { id: 'week', label: '1W', days: 5 },
  { id: 'month', label: '1M', days: 22 },
  { id: 'quarter', label: '3M', days: 66 },
  { id: 'year', label: '1Y', days: 252 }
] as const;

// Chart colors for comparison
export const CHART_COLORS = ['#3b82f6', '#a855f7', '#f97316'] as const;

// Popular stocks
export const POPULAR_STOCKS = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 
  'META', 'NVDA', 'JPM', 'V', 'WMT'
] as const;

// Popular cryptocurrencies
export const POPULAR_CRYPTO = [
  'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'SOL-USD',
  'ADA-USD', 'DOGE-USD', 'DOT-USD', 'MATIC-USD', 'LINK-USD'
] as const;

// Thresholds for metric coloring
export const METRIC_THRESHOLDS = {
  peRatio: { good: 15, bad: 35, inverse: true },
  pegRatio: { good: 1, bad: 2, inverse: true },
  pbRatio: { good: 1, bad: 5, inverse: true },
  roe: { good: 15, bad: 5, inverse: false },
  profitMargin: { good: 15, bad: 5, inverse: false },
  debtToEquity: { good: 0.5, bad: 2, inverse: true },
  rsi: { good: 30, bad: 70, inverse: true },
  score: { good: 60, bad: 40, inverse: false }
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
  quote: 5000,
  historical: 300000,
  fundamental: 600000
} as const;

// API endpoints
export const API_ENDPOINTS = {
  yahooChart: 'https://query1.finance.yahoo.com/v8/finance/chart',
  finnhubProfile: 'https://finnhub.io/api/v1/stock/profile2',
  finnhubMetrics: 'https://finnhub.io/api/v1/stock/metric'
} as const;
