// Utility functions for stock/crypto detection and calculations

export function isCrypto(symbol: string): boolean {
  return symbol.includes('-USD') || symbol.includes('-EUR') || symbol.includes('-GBP');
}

export function getAssetType(symbol: string): 'crypto' | 'stock' {
  return isCrypto(symbol) ? 'crypto' : 'stock';
}

// Calculate percentage change between two values
export function calculatePercentChange(startValue: number, endValue: number): number {
  if (startValue === 0) return 0;
  return ((endValue - startValue) / startValue) * 100;
}

// Calculate max drawdown from price data
export function calculateMaxDrawdown(prices: { high: number; low: number; date: string }[]): {
  maxDrawdown: number;
  startDate: string;
  endDate: string;
} {
  if (prices.length === 0) {
    return { maxDrawdown: 0, startDate: '', endDate: '' };
  }

  let maxDrawdown = 0;
  let peak = prices[0].high;
  let drawdownStart = prices[0].date;
  let drawdownEnd = prices[0].date;
  let currentDrawdownStart = prices[0].date;

  for (const p of prices) {
    if (p.high > peak) {
      peak = p.high;
      currentDrawdownStart = p.date;
    }
    const drawdown = (peak - p.low) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      drawdownStart = currentDrawdownStart;
      drawdownEnd = p.date;
    }
  }

  return {
    maxDrawdown: maxDrawdown * 100,
    startDate: drawdownStart,
    endDate: drawdownEnd
  };
}

// Calculate max rally from price data
export function calculateMaxRally(prices: { high: number; low: number; date: string }[]): {
  maxRally: number;
  startDate: string;
  endDate: string;
} {
  if (prices.length === 0) {
    return { maxRally: 0, startDate: '', endDate: '' };
  }

  let maxGain = 0;
  let trough = prices[0].low;
  let gainStart = prices[0].date;
  let gainEnd = prices[0].date;
  let currentGainStart = prices[0].date;

  for (const p of prices) {
    if (p.low < trough) {
      trough = p.low;
      currentGainStart = p.date;
    }
    const gain = (p.high - trough) / trough;
    if (gain > maxGain) {
      maxGain = gain;
      gainStart = currentGainStart;
      gainEnd = p.date;
    }
  }

  return {
    maxRally: maxGain * 100,
    startDate: gainStart,
    endDate: gainEnd
  };
}

// Calculate volatility from returns
export function calculateVolatility(prices: number[], annualize: boolean = true): number {
  if (prices.length < 2) return 0;

  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const dailyVolatility = Math.sqrt(variance);

  return annualize ? dailyVolatility * Math.sqrt(252) * 100 : dailyVolatility * 100;
}

// Calculate win rate (percentage of positive days)
export function calculateWinRate(prices: number[]): number {
  if (prices.length < 2) return 0;

  let positiveDays = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) positiveDays++;
  }

  return (positiveDays / (prices.length - 1)) * 100;
}

// Get YTD days count
export function getYTDDays(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  return Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
}

// Calculate Simple Moving Average
export function calculateSMA(data: number[], period: number): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1] : 0;
  const slice = data.slice(-period);
  return slice.reduce((sum, val) => sum + val, 0) / period;
}
