import { HistoricalData, TechnicalIndicators, Signal } from '../types';
import { analyzeElliottWave, generateElliottWaveSignals } from './elliottWave';
import { analyzeCandlestickPatterns, generateCandlestickSignals } from './candlestickPatterns';

// Simple Moving Average
export function calculateSMA(data: number[], period: number): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1] : 0;
  const slice = data.slice(-period);
  return slice.reduce((sum, val) => sum + val, 0) / period;
}

// Exponential Moving Average
export function calculateEMA(data: number[], period: number): number {
  if (data.length < period) return calculateSMA(data, data.length);
  const multiplier = 2 / (period + 1);
  let ema = calculateSMA(data.slice(0, period), period);
  
  for (let i = period; i < data.length; i++) {
    ema = (data[i] - ema) * multiplier + ema;
  }
  return ema;
}

// Relative Strength Index
export function calculateRSI(data: number[], period: number = 14): number {
  if (data.length < period + 1) return 50;
  
  const changes: number[] = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1]);
  }
  
  const gains = changes.map(c => c > 0 ? c : 0);
  const losses = changes.map(c => c < 0 ? Math.abs(c) : 0);
  
  const avgGain = calculateSMA(gains.slice(-period), period);
  const avgLoss = calculateSMA(losses.slice(-period), period);
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// MACD
export function calculateMACD(data: number[]): { macdLine: number; signalLine: number; histogram: number } {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  const macdLine = ema12 - ema26;
  
  // Calculate signal line (9-period EMA of MACD)
  const macdValues: number[] = [];
  for (let i = 26; i <= data.length; i++) {
    const slice = data.slice(0, i);
    const e12 = calculateEMA(slice, 12);
    const e26 = calculateEMA(slice, 26);
    macdValues.push(e12 - e26);
  }
  
  const signalLine = macdValues.length >= 9 ? calculateEMA(macdValues, 9) : macdLine;
  const histogram = macdLine - signalLine;
  
  return { macdLine, signalLine, histogram };
}

// Bollinger Bands
export function calculateBollingerBands(data: number[], period: number = 20, stdDev: number = 2): { upper: number; middle: number; lower: number } {
  const middle = calculateSMA(data, period);
  const slice = data.slice(-period);
  
  const squaredDiffs = slice.map(val => Math.pow(val - middle, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / period;
  const standardDeviation = Math.sqrt(variance);
  
  return {
    upper: middle + (stdDev * standardDeviation),
    middle,
    lower: middle - (stdDev * standardDeviation)
  };
}

// Stochastic Oscillator
export function calculateStochastic(highs: number[], lows: number[], closes: number[], period: number = 14): { k: number; d: number } {
  if (closes.length < period) return { k: 50, d: 50 };
  
  const highSlice = highs.slice(-period);
  const lowSlice = lows.slice(-period);
  const currentClose = closes[closes.length - 1];
  
  const highestHigh = Math.max(...highSlice);
  const lowestLow = Math.min(...lowSlice);
  
  const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
  
  // Calculate %D (3-period SMA of %K)
  const kValues: number[] = [];
  for (let i = period; i <= closes.length; i++) {
    const hSlice = highs.slice(i - period, i);
    const lSlice = lows.slice(i - period, i);
    const c = closes[i - 1];
    const hh = Math.max(...hSlice);
    const ll = Math.min(...lSlice);
    kValues.push(((c - ll) / (hh - ll)) * 100);
  }
  
  const d = kValues.length >= 3 ? calculateSMA(kValues.slice(-3), 3) : k;
  
  return { k: isNaN(k) ? 50 : k, d: isNaN(d) ? 50 : d };
}

// Average True Range
export function calculateATR(highs: number[], lows: number[], closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 0;
  
  const trueRanges: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    trueRanges.push(tr);
  }
  
  return calculateSMA(trueRanges.slice(-period), period);
}

// On-Balance Volume
export function calculateOBV(closes: number[], volumes: number[]): number {
  if (closes.length < 2) return 0;
  
  let obv = 0;
  for (let i = 1; i < closes.length; i++) {
    if (closes[i] > closes[i - 1]) {
      obv += volumes[i];
    } else if (closes[i] < closes[i - 1]) {
      obv -= volumes[i];
    }
  }
  return obv;
}

// Calculate ADX (Average Directional Index) - measures trend strength
export function calculateADX(highs: number[], lows: number[], closes: number[], period: number = 14): number {
  if (closes.length < period * 2) return 25; // Default neutral value
  
  const plusDM: number[] = [];
  const minusDM: number[] = [];
  const tr: number[] = [];
  
  for (let i = 1; i < closes.length; i++) {
    const highDiff = highs[i] - highs[i - 1];
    const lowDiff = lows[i - 1] - lows[i];
    
    plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
    minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);
    
    const trueRange = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    tr.push(trueRange);
  }
  
  const smoothedPlusDM = calculateEMA(plusDM, period);
  const smoothedMinusDM = calculateEMA(minusDM, period);
  const smoothedTR = calculateEMA(tr, period);
  
  const plusDI = (smoothedPlusDM / smoothedTR) * 100;
  const minusDI = (smoothedMinusDM / smoothedTR) * 100;
  
  const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
  
  return isNaN(dx) ? 25 : dx;
}

// Calculate Williams %R
export function calculateWilliamsR(highs: number[], lows: number[], closes: number[], period: number = 14): number {
  if (closes.length < period) return -50;
  
  const highSlice = highs.slice(-period);
  const lowSlice = lows.slice(-period);
  const currentClose = closes[closes.length - 1];
  
  const highestHigh = Math.max(...highSlice);
  const lowestLow = Math.min(...lowSlice);
  
  const wr = ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
  return isNaN(wr) ? -50 : wr;
}

// Calculate CCI (Commodity Channel Index)
export function calculateCCI(highs: number[], lows: number[], closes: number[], period: number = 20): number {
  if (closes.length < period) return 0;
  
  const typicalPrices: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    typicalPrices.push((highs[i] + lows[i] + closes[i]) / 3);
  }
  
  const sma = calculateSMA(typicalPrices, period);
  const slice = typicalPrices.slice(-period);
  const meanDeviation = slice.reduce((sum, val) => sum + Math.abs(val - sma), 0) / period;
  
  const currentTP = typicalPrices[typicalPrices.length - 1];
  const cci = (currentTP - sma) / (0.015 * meanDeviation);
  
  return isNaN(cci) ? 0 : cci;
}

// Calculate momentum (Rate of Change)
export function calculateROC(data: number[], period: number = 10): number {
  if (data.length < period + 1) return 0;
  const current = data[data.length - 1];
  const past = data[data.length - 1 - period];
  return ((current - past) / past) * 100;
}

// Calculate yearly performance metrics
export function calculateYearlyMetrics(historicalData: HistoricalData[]): {
  yearlyReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
} {
  if (historicalData.length < 20) {
    return { yearlyReturn: 0, volatility: 0, sharpeRatio: 0, maxDrawdown: 0, winRate: 0 };
  }
  
  const closes = historicalData.map(d => d.close);
  
  // Yearly return
  const firstPrice = closes[0];
  const lastPrice = closes[closes.length - 1];
  const yearlyReturn = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  // Daily returns
  const dailyReturns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    dailyReturns.push((closes[i] - closes[i - 1]) / closes[i - 1]);
  }
  
  // Volatility (annualized standard deviation)
  const avgReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length;
  const dailyVolatility = Math.sqrt(variance);
  const volatility = dailyVolatility * Math.sqrt(252) * 100; // Annualized
  
  // Sharpe Ratio (assuming risk-free rate of 4%)
  const riskFreeRate = 0.04;
  const excessReturn = (yearlyReturn / 100) - riskFreeRate;
  const sharpeRatio = volatility > 0 ? excessReturn / (volatility / 100) : 0;
  
  // Max Drawdown
  let peak = closes[0];
  let maxDrawdown = 0;
  for (const price of closes) {
    if (price > peak) peak = price;
    const drawdown = (peak - price) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  
  // Win Rate (percentage of positive days)
  const positiveDays = dailyReturns.filter(r => r > 0).length;
  const winRate = (positiveDays / dailyReturns.length) * 100;
  
  return {
    yearlyReturn: parseFloat(yearlyReturn.toFixed(2)),
    volatility: parseFloat(volatility.toFixed(2)),
    sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
    maxDrawdown: parseFloat((maxDrawdown * 100).toFixed(2)),
    winRate: parseFloat(winRate.toFixed(2))
  };
}

// Calculate all technical indicators including Elliott Wave and Candlestick Patterns
export function calculateAllIndicators(historicalData: HistoricalData[]): TechnicalIndicators {
  const closes = historicalData.map(d => d.close);
  const highs = historicalData.map(d => d.high);
  const lows = historicalData.map(d => d.low);
  const volumes = historicalData.map(d => d.volume);
  
  // Calculate Elliott Wave analysis
  const elliottWave = analyzeElliottWave(historicalData);
  
  // Calculate Candlestick Pattern analysis
  const candlestickAnalysis = analyzeCandlestickPatterns(historicalData);
  
  // Calculate yearly metrics for enhanced analysis
  const yearlyMetrics = calculateYearlyMetrics(historicalData);
  
  return {
    sma20: calculateSMA(closes, 20),
    sma50: calculateSMA(closes, 50),
    sma200: calculateSMA(closes, 200),
    ema12: calculateEMA(closes, 12),
    ema26: calculateEMA(closes, 26),
    rsi: calculateRSI(closes),
    macd: calculateMACD(closes),
    bollingerBands: calculateBollingerBands(closes),
    stochastic: calculateStochastic(highs, lows, closes),
    atr: calculateATR(highs, lows, closes),
    obv: calculateOBV(closes, volumes),
    elliottWave,
    candlestickAnalysis,
    // Extended indicators using full year data
    adx: calculateADX(highs, lows, closes),
    williamsR: calculateWilliamsR(highs, lows, closes),
    cci: calculateCCI(highs, lows, closes),
    roc: calculateROC(closes),
    yearlyMetrics
  };
}

// Generate technical signals including Elliott Wave and yearly analysis
export function generateTechnicalSignals(indicators: TechnicalIndicators, currentPrice: number): Signal[] {
  const signals: Signal[] = [];
  
  // RSI Signal
  if (indicators.rsi < 30) {
    signals.push({
      name: 'RSI Oversold',
      type: 'bullish',
      strength: Math.min((30 - indicators.rsi) / 30, 1),
      description: `RSI at ${indicators.rsi.toFixed(2)} indicates oversold conditions`
    });
  } else if (indicators.rsi > 70) {
    signals.push({
      name: 'RSI Overbought',
      type: 'bearish',
      strength: Math.min((indicators.rsi - 70) / 30, 1),
      description: `RSI at ${indicators.rsi.toFixed(2)} indicates overbought conditions`
    });
  }
  
  // MACD Signal
  if (indicators.macd.histogram > 0 && indicators.macd.macdLine > indicators.macd.signalLine) {
    signals.push({
      name: 'MACD Bullish',
      type: 'bullish',
      strength: Math.min(Math.abs(indicators.macd.histogram) / 2, 1),
      description: 'MACD line above signal line with positive histogram'
    });
  } else if (indicators.macd.histogram < 0 && indicators.macd.macdLine < indicators.macd.signalLine) {
    signals.push({
      name: 'MACD Bearish',
      type: 'bearish',
      strength: Math.min(Math.abs(indicators.macd.histogram) / 2, 1),
      description: 'MACD line below signal line with negative histogram'
    });
  }
  
  // Moving Average Signal
  if (currentPrice > indicators.sma20 && indicators.sma20 > indicators.sma50) {
    signals.push({
      name: 'MA Bullish Alignment',
      type: 'bullish',
      strength: 0.7,
      description: 'Price above SMA20, SMA20 above SMA50'
    });
  } else if (currentPrice < indicators.sma20 && indicators.sma20 < indicators.sma50) {
    signals.push({
      name: 'MA Bearish Alignment',
      type: 'bearish',
      strength: 0.7,
      description: 'Price below SMA20, SMA20 below SMA50'
    });
  }
  
  // SMA200 Long-term trend (using full year data)
  if (currentPrice > indicators.sma200 && indicators.sma50 > indicators.sma200) {
    signals.push({
      name: 'Long-term Uptrend',
      type: 'bullish',
      strength: 0.8,
      description: 'Price and SMA50 above SMA200 - strong long-term uptrend'
    });
  } else if (currentPrice < indicators.sma200 && indicators.sma50 < indicators.sma200) {
    signals.push({
      name: 'Long-term Downtrend',
      type: 'bearish',
      strength: 0.8,
      description: 'Price and SMA50 below SMA200 - strong long-term downtrend'
    });
  }
  
  // Bollinger Bands Signal
  if (currentPrice <= indicators.bollingerBands.lower) {
    signals.push({
      name: 'BB Lower Touch',
      type: 'bullish',
      strength: 0.6,
      description: 'Price touching lower Bollinger Band'
    });
  } else if (currentPrice >= indicators.bollingerBands.upper) {
    signals.push({
      name: 'BB Upper Touch',
      type: 'bearish',
      strength: 0.6,
      description: 'Price touching upper Bollinger Band'
    });
  }
  
  // Stochastic Signal
  if (indicators.stochastic.k < 20 && indicators.stochastic.d < 20) {
    signals.push({
      name: 'Stochastic Oversold',
      type: 'bullish',
      strength: 0.5,
      description: `Stochastic K(${indicators.stochastic.k.toFixed(2)}) and D(${indicators.stochastic.d.toFixed(2)}) in oversold zone`
    });
  } else if (indicators.stochastic.k > 80 && indicators.stochastic.d > 80) {
    signals.push({
      name: 'Stochastic Overbought',
      type: 'bearish',
      strength: 0.5,
      description: `Stochastic K(${indicators.stochastic.k.toFixed(2)}) and D(${indicators.stochastic.d.toFixed(2)}) in overbought zone`
    });
  }
  
  // Golden/Death Cross
  if (indicators.sma50 > indicators.sma200) {
    signals.push({
      name: 'Golden Cross',
      type: 'bullish',
      strength: 0.85,
      description: 'SMA50 above SMA200 - long-term bullish trend'
    });
  } else if (indicators.sma50 < indicators.sma200) {
    signals.push({
      name: 'Death Cross',
      type: 'bearish',
      strength: 0.85,
      description: 'SMA50 below SMA200 - long-term bearish trend'
    });
  }
  
  // ADX Trend Strength (if available)
  if (indicators.adx !== undefined) {
    if (indicators.adx > 25) {
      signals.push({
        name: 'Strong Trend',
        type: 'neutral',
        strength: Math.min(indicators.adx / 50, 1),
        description: `ADX at ${indicators.adx.toFixed(2)} indicates strong trend`
      });
    }
  }
  
  // Williams %R (if available)
  if (indicators.williamsR !== undefined) {
    if (indicators.williamsR < -80) {
      signals.push({
        name: 'Williams %R Oversold',
        type: 'bullish',
        strength: 0.5,
        description: `Williams %R at ${indicators.williamsR.toFixed(2)} - oversold`
      });
    } else if (indicators.williamsR > -20) {
      signals.push({
        name: 'Williams %R Overbought',
        type: 'bearish',
        strength: 0.5,
        description: `Williams %R at ${indicators.williamsR.toFixed(2)} - overbought`
      });
    }
  }
  
  // CCI Signal (if available)
  if (indicators.cci !== undefined) {
    if (indicators.cci < -100) {
      signals.push({
        name: 'CCI Oversold',
        type: 'bullish',
        strength: 0.55,
        description: `CCI at ${indicators.cci.toFixed(2)} indicates oversold`
      });
    } else if (indicators.cci > 100) {
      signals.push({
        name: 'CCI Overbought',
        type: 'bearish',
        strength: 0.55,
        description: `CCI at ${indicators.cci.toFixed(2)} indicates overbought`
      });
    }
  }
  
  // Momentum (ROC) Signal (if available)
  if (indicators.roc !== undefined) {
    if (indicators.roc > 10) {
      signals.push({
        name: 'Strong Momentum',
        type: 'bullish',
        strength: Math.min(indicators.roc / 20, 0.8),
        description: `10-day ROC at ${indicators.roc.toFixed(2)}% - strong upward momentum`
      });
    } else if (indicators.roc < -10) {
      signals.push({
        name: 'Weak Momentum',
        type: 'bearish',
        strength: Math.min(Math.abs(indicators.roc) / 20, 0.8),
        description: `10-day ROC at ${indicators.roc.toFixed(2)}% - strong downward momentum`
      });
    }
  }
  
  // Yearly Performance Signal (if available)
  if (indicators.yearlyMetrics) {
    const { yearlyReturn, sharpeRatio, winRate } = indicators.yearlyMetrics;
    
    if (yearlyReturn > 20 && sharpeRatio > 1) {
      signals.push({
        name: 'Strong Yearly Performance',
        type: 'bullish',
        strength: 0.7,
        description: `${yearlyReturn.toFixed(1)}% yearly return with ${sharpeRatio.toFixed(2)} Sharpe ratio`
      });
    } else if (yearlyReturn < -10) {
      signals.push({
        name: 'Weak Yearly Performance',
        type: 'bearish',
        strength: 0.6,
        description: `${yearlyReturn.toFixed(1)}% yearly return indicates weakness`
      });
    }
    
    if (winRate > 55) {
      signals.push({
        name: 'High Win Rate',
        type: 'bullish',
        strength: 0.4,
        description: `${winRate.toFixed(1)}% of trading days were positive`
      });
    } else if (winRate < 45) {
      signals.push({
        name: 'Low Win Rate',
        type: 'bearish',
        strength: 0.4,
        description: `Only ${winRate.toFixed(1)}% of trading days were positive`
      });
    }
  }
  
  // Elliott Wave Signals
  if (indicators.elliottWave) {
    const elliottSignals = generateElliottWaveSignals(indicators.elliottWave, currentPrice);
    signals.push(...elliottSignals);
  }
  
  // Candlestick Pattern Signals
  if (indicators.candlestickAnalysis) {
    const candlestickSignals = generateCandlestickSignals(indicators.candlestickAnalysis);
    signals.push(...candlestickSignals);
  }
  
  return signals;
}

// Calculate technical score (0-100)
export function calculateTechnicalScore(signals: Signal[]): number {
  if (signals.length === 0) return 50;
  
  let score = 50;
  let totalWeight = 0;
  
  signals.forEach(signal => {
    const weight = signal.strength;
    totalWeight += weight;
    
    if (signal.type === 'bullish') {
      score += weight * 10;
    } else if (signal.type === 'bearish') {
      score -= weight * 10;
    }
  });
  
  // Normalize based on number of signals
  if (totalWeight > 0) {
    const adjustment = (score - 50) * (1 + Math.log(signals.length + 1) / 10);
    score = 50 + adjustment;
  }
  
  return Math.max(0, Math.min(100, score));
}
