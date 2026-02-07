import { HistoricalData, Signal, CandlestickPattern, CandlestickAnalysis } from '@/types/stock';

// Helper functions for candlestick analysis
function getBodySize(candle: HistoricalData): number {
  return Math.abs(candle.close - candle.open);
}

function getUpperShadow(candle: HistoricalData): number {
  return candle.high - Math.max(candle.open, candle.close);
}

function getLowerShadow(candle: HistoricalData): number {
  return Math.min(candle.open, candle.close) - candle.low;
}

function getTotalRange(candle: HistoricalData): number {
  return candle.high - candle.low;
}

function isBullish(candle: HistoricalData): boolean {
  return candle.close > candle.open;
}

function isBearish(candle: HistoricalData): boolean {
  return candle.close < candle.open;
}

function getAverageBodySize(data: HistoricalData[], period: number = 14): number {
  const slice = data.slice(-period);
  const bodies = slice.map(d => getBodySize(d));
  return bodies.reduce((a, b) => a + b, 0) / bodies.length;
}

function getAverageRange(data: HistoricalData[], period: number = 14): number {
  const slice = data.slice(-period);
  const ranges = slice.map(d => getTotalRange(d));
  return ranges.reduce((a, b) => a + b, 0) / ranges.length;
}

// Improved trend detection - uses percentage of candles in trend direction
function detectTrend(candles: HistoricalData[]): { isUptrend: boolean; isDowntrend: boolean; strength: number } {
  if (candles.length < 3) return { isUptrend: false, isDowntrend: false, strength: 0 };
  
  let upCount = 0;
  let downCount = 0;
  
  for (let i = 1; i < candles.length; i++) {
    if (candles[i].close > candles[i - 1].close) upCount++;
    else if (candles[i].close < candles[i - 1].close) downCount++;
  }
  
  const total = candles.length - 1;
  const upRatio = upCount / total;
  const downRatio = downCount / total;
  
  // Need at least 60% of candles in one direction to confirm trend
  return {
    isUptrend: upRatio >= 0.6,
    isDowntrend: downRatio >= 0.6,
    strength: Math.max(upRatio, downRatio)
  };
}

// Single candlestick patterns
function detectDoji(candle: HistoricalData, avgBody: number, avgRange: number): CandlestickPattern | null {
  const body = getBodySize(candle);
  const range = getTotalRange(candle);
  
  // Skip if range is too small (flat day)
  if (range < avgRange * 0.3) return null;
  
  // Doji: body is less than 15% of the range (more realistic threshold)
  const bodyToRangeRatio = body / range;
  if (bodyToRangeRatio <= 0.15) {
    const upperShadow = getUpperShadow(candle);
    const lowerShadow = getLowerShadow(candle);
    
    // Dragonfly Doji: long lower shadow (>60% of range), minimal upper shadow
    if (lowerShadow > range * 0.6 && upperShadow < range * 0.15) {
      return {
        type: 'dragonfly_doji',
        name: 'Dragonfly Doji',
        direction: 'bullish',
        reliability: 0.6,
        description: 'Dragonfly Doji with long lower shadow - potential bullish reversal',
        index: 0
      };
    }
    
    // Gravestone Doji: long upper shadow (>60% of range), minimal lower shadow
    if (upperShadow > range * 0.6 && lowerShadow < range * 0.15) {
      return {
        type: 'gravestone_doji',
        name: 'Gravestone Doji',
        direction: 'bearish',
        reliability: 0.6,
        description: 'Gravestone Doji with long upper shadow - potential bearish reversal',
        index: 0
      };
    }
    
    // Standard Doji - only if shadows are relatively balanced
    if (Math.abs(upperShadow - lowerShadow) < range * 0.3) {
      return {
        type: 'doji',
        name: 'Doji',
        direction: 'neutral',
        reliability: 0.4,
        description: 'Doji indicates market indecision - watch for confirmation',
        index: 0
      };
    }
  }
  
  return null;
}

function detectSpinningTop(candle: HistoricalData, avgBody: number, avgRange: number): CandlestickPattern | null {
  const body = getBodySize(candle);
  const range = getTotalRange(candle);
  const upperShadow = getUpperShadow(candle);
  const lowerShadow = getLowerShadow(candle);
  
  // Skip if range is too small
  if (range < avgRange * 0.5) return null;
  
  // Spinning top: small body (15-35% of range) with shadows on both sides
  const bodyToRangeRatio = body / range;
  if (bodyToRangeRatio > 0.15 && bodyToRangeRatio < 0.35 && 
      upperShadow > body * 0.8 && lowerShadow > body * 0.8) {
    return {
      type: 'spinning_top',
      name: 'Spinning Top',
      direction: 'neutral',
      reliability: 0.35, // Lower reliability - it's a weak signal
      description: 'Spinning Top shows indecision between buyers and sellers',
      index: 0
    };
  }
  
  return null;
}

function detectMarubozu(candle: HistoricalData, avgBody: number, avgRange: number): CandlestickPattern | null {
  const body = getBodySize(candle);
  const range = getTotalRange(candle);
  const upperShadow = getUpperShadow(candle);
  const lowerShadow = getLowerShadow(candle);
  
  // Marubozu: body is at least 90% of range (allowing small shadows)
  const bodyToRangeRatio = body / range;
  if (bodyToRangeRatio >= 0.9 && body > avgBody * 1.2) {
    if (isBullish(candle)) {
      return {
        type: 'marubozu_bullish',
        name: 'Bullish Marubozu',
        direction: 'bullish',
        reliability: 0.7,
        description: 'Strong bullish candle with minimal shadows - buyers in control',
        index: 0
      };
    } else {
      return {
        type: 'marubozu_bearish',
        name: 'Bearish Marubozu',
        direction: 'bearish',
        reliability: 0.7,
        description: 'Strong bearish candle with minimal shadows - sellers in control',
        index: 0
      };
    }
  }
  
  return null;
}

function detectHammer(candle: HistoricalData, avgBody: number, avgRange: number, prevCandles: HistoricalData[]): CandlestickPattern | null {
  const body = getBodySize(candle);
  const range = getTotalRange(candle);
  const upperShadow = getUpperShadow(candle);
  const lowerShadow = getLowerShadow(candle);
  
  // Skip if range is too small
  if (range < avgRange * 0.5) return null;
  
  const trend = detectTrend(prevCandles);
  
  // Hammer/Hanging Man: small body at top, long lower shadow (at least 2x body)
  const bodyToRangeRatio = body / range;
  if (bodyToRangeRatio < 0.35 && lowerShadow >= body * 2 && upperShadow < body * 0.5) {
    if (trend.isDowntrend) {
      return {
        type: 'hammer',
        name: 'Hammer',
        direction: 'bullish',
        reliability: 0.65,
        description: 'Hammer pattern after downtrend - potential bullish reversal',
        index: 0
      };
    } else if (trend.isUptrend) {
      return {
        type: 'hanging_man',
        name: 'Hanging Man',
        direction: 'bearish',
        reliability: 0.55, // Lower reliability - needs confirmation
        description: 'Hanging Man after uptrend - potential bearish reversal (needs confirmation)',
        index: 0
      };
    }
  }
  
  // Inverted Hammer/Shooting Star: small body at bottom, long upper shadow
  if (bodyToRangeRatio < 0.35 && upperShadow >= body * 2 && lowerShadow < body * 0.5) {
    if (trend.isDowntrend) {
      return {
        type: 'inverted_hammer',
        name: 'Inverted Hammer',
        direction: 'bullish',
        reliability: 0.55, // Lower reliability - needs confirmation
        description: 'Inverted Hammer after downtrend - potential bullish reversal (needs confirmation)',
        index: 0
      };
    } else if (trend.isUptrend) {
      return {
        type: 'shooting_star',
        name: 'Shooting Star',
        direction: 'bearish',
        reliability: 0.65,
        description: 'Shooting Star after uptrend - potential bearish reversal',
        index: 0
      };
    }
  }
  
  return null;
}

// Two candlestick patterns
function detectEngulfing(current: HistoricalData, prev: HistoricalData, avgBody: number): CandlestickPattern | null {
  const currentBody = getBodySize(current);
  const prevBody = getBodySize(prev);
  
  // Both candles need meaningful bodies
  if (prevBody < avgBody * 0.3 || currentBody < avgBody * 0.5) return null;
  
  // Bullish Engulfing: bearish candle followed by larger bullish candle that engulfs it
  if (isBearish(prev) && isBullish(current) && 
      current.open <= prev.close && current.close >= prev.open &&
      currentBody > prevBody) {
    return {
      type: 'bullish_engulfing',
      name: 'Bullish Engulfing',
      direction: 'bullish',
      reliability: 0.7,
      description: 'Bullish Engulfing pattern - strong reversal signal',
      index: 0
    };
  }
  
  // Bearish Engulfing: bullish candle followed by larger bearish candle that engulfs it
  if (isBullish(prev) && isBearish(current) && 
      current.open >= prev.close && current.close <= prev.open &&
      currentBody > prevBody) {
    return {
      type: 'bearish_engulfing',
      name: 'Bearish Engulfing',
      direction: 'bearish',
      reliability: 0.7,
      description: 'Bearish Engulfing pattern - strong reversal signal',
      index: 0
    };
  }
  
  return null;
}

function detectHarami(current: HistoricalData, prev: HistoricalData, avgBody: number): CandlestickPattern | null {
  const currentBody = getBodySize(current);
  const prevBody = getBodySize(prev);
  
  // First candle needs to be large
  if (prevBody < avgBody * 0.8) return null;
  
  // Harami: second candle's body is contained within first candle's body
  const isContained = Math.max(current.open, current.close) < Math.max(prev.open, prev.close) &&
                      Math.min(current.open, current.close) > Math.min(prev.open, prev.close);
  
  if (isContained && currentBody < prevBody * 0.5) {
    // Bullish Harami: large bearish followed by small bullish inside
    if (isBearish(prev) && isBullish(current)) {
      return {
        type: 'bullish_harami',
        name: 'Bullish Harami',
        direction: 'bullish',
        reliability: 0.55,
        description: 'Bullish Harami - potential reversal, wait for confirmation',
        index: 0
      };
    }
    
    // Bearish Harami: large bullish followed by small bearish inside
    if (isBullish(prev) && isBearish(current)) {
      return {
        type: 'bearish_harami',
        name: 'Bearish Harami',
        direction: 'bearish',
        reliability: 0.55,
        description: 'Bearish Harami - potential reversal, wait for confirmation',
        index: 0
      };
    }
  }
  
  return null;
}

function detectPiercingOrDarkCloud(current: HistoricalData, prev: HistoricalData, avgBody: number): CandlestickPattern | null {
  const currentBody = getBodySize(current);
  const prevBody = getBodySize(prev);
  
  // Both candles need meaningful bodies
  if (prevBody < avgBody * 0.5 || currentBody < avgBody * 0.5) return null;
  
  const prevMidpoint = (prev.open + prev.close) / 2;
  
  // Piercing Line: bearish candle followed by bullish that opens below close and closes above midpoint
  if (isBearish(prev) && isBullish(current) && 
      current.open < prev.close && current.close > prevMidpoint && current.close < prev.open) {
    return {
      type: 'piercing_line',
      name: 'Piercing Line',
      direction: 'bullish',
      reliability: 0.6,
      description: 'Piercing Line pattern - bullish reversal signal',
      index: 0
    };
  }
  
  // Dark Cloud Cover: bullish candle followed by bearish that opens above close and closes below midpoint
  if (isBullish(prev) && isBearish(current) && 
      current.open > prev.close && current.close < prevMidpoint && current.close > prev.open) {
    return {
      type: 'dark_cloud_cover',
      name: 'Dark Cloud Cover',
      direction: 'bearish',
      reliability: 0.6,
      description: 'Dark Cloud Cover pattern - bearish reversal signal',
      index: 0
    };
  }
  
  return null;
}

function detectTweezer(current: HistoricalData, prev: HistoricalData, avgRange: number): CandlestickPattern | null {
  const tolerance = avgRange * 0.01; // 1% tolerance (tighter)
  
  // Tweezer Bottom: two candles with same low, second is bullish
  if (Math.abs(current.low - prev.low) < tolerance && isBearish(prev) && isBullish(current)) {
    return {
      type: 'tweezer_bottom',
      name: 'Tweezer Bottom',
      direction: 'bullish',
      reliability: 0.55,
      description: 'Tweezer Bottom - support level confirmed, potential reversal',
      index: 0
    };
  }
  
  // Tweezer Top: two candles with same high, second is bearish
  if (Math.abs(current.high - prev.high) < tolerance && isBullish(prev) && isBearish(current)) {
    return {
      type: 'tweezer_top',
      name: 'Tweezer Top',
      direction: 'bearish',
      reliability: 0.55,
      description: 'Tweezer Top - resistance level confirmed, potential reversal',
      index: 0
    };
  }
  
  return null;
}

// Three candlestick patterns - these are more reliable
function detectMorningStar(candles: HistoricalData[], avgBody: number): CandlestickPattern | null {
  if (candles.length < 3) return null;
  
  const [first, second, third] = candles.slice(-3);
  const firstBody = getBodySize(first);
  const secondBody = getBodySize(second);
  const thirdBody = getBodySize(third);
  
  // Morning Star: large bearish, small body, large bullish
  // Relaxed gap requirements for modern markets
  if (isBearish(first) && firstBody > avgBody * 0.8 &&
      secondBody < avgBody * 0.4 &&
      isBullish(third) && thirdBody > avgBody * 0.8 &&
      third.close > (first.open + first.close) / 2) { // Third closes above first's midpoint
    return {
      type: 'morning_star',
      name: 'Morning Star',
      direction: 'bullish',
      reliability: 0.75,
      description: 'Morning Star - strong bullish reversal pattern',
      index: 0
    };
  }
  
  return null;
}

function detectEveningStar(candles: HistoricalData[], avgBody: number): CandlestickPattern | null {
  if (candles.length < 3) return null;
  
  const [first, second, third] = candles.slice(-3);
  const firstBody = getBodySize(first);
  const secondBody = getBodySize(second);
  const thirdBody = getBodySize(third);
  
  // Evening Star: large bullish, small body, large bearish
  if (isBullish(first) && firstBody > avgBody * 0.8 &&
      secondBody < avgBody * 0.4 &&
      isBearish(third) && thirdBody > avgBody * 0.8 &&
      third.close < (first.open + first.close) / 2) { // Third closes below first's midpoint
    return {
      type: 'evening_star',
      name: 'Evening Star',
      direction: 'bearish',
      reliability: 0.75,
      description: 'Evening Star - strong bearish reversal pattern',
      index: 0
    };
  }
  
  return null;
}

function detectThreeWhiteSoldiers(candles: HistoricalData[], avgBody: number): CandlestickPattern | null {
  if (candles.length < 3) return null;
  
  const [first, second, third] = candles.slice(-3);
  
  // Three White Soldiers: three consecutive bullish candles with higher closes
  // Each candle should open within the previous body
  if (isBullish(first) && isBullish(second) && isBullish(third) &&
      second.close > first.close && third.close > second.close &&
      second.open > first.open && second.open < first.close &&
      third.open > second.open && third.open < second.close &&
      getBodySize(first) > avgBody * 0.5 &&
      getBodySize(second) > avgBody * 0.5 &&
      getBodySize(third) > avgBody * 0.5) {
    return {
      type: 'three_white_soldiers',
      name: 'Three White Soldiers',
      direction: 'bullish',
      reliability: 0.8,
      description: 'Three White Soldiers - strong bullish continuation pattern',
      index: 0
    };
  }
  
  return null;
}

function detectThreeBlackCrows(candles: HistoricalData[], avgBody: number): CandlestickPattern | null {
  if (candles.length < 3) return null;
  
  const [first, second, third] = candles.slice(-3);
  
  // Three Black Crows: three consecutive bearish candles with lower closes
  // Each candle should open within the previous body
  if (isBearish(first) && isBearish(second) && isBearish(third) &&
      second.close < first.close && third.close < second.close &&
      second.open < first.open && second.open > first.close &&
      third.open < second.open && third.open > second.close &&
      getBodySize(first) > avgBody * 0.5 &&
      getBodySize(second) > avgBody * 0.5 &&
      getBodySize(third) > avgBody * 0.5) {
    return {
      type: 'three_black_crows',
      name: 'Three Black Crows',
      direction: 'bearish',
      reliability: 0.8,
      description: 'Three Black Crows - strong bearish continuation pattern',
      index: 0
    };
  }
  
  return null;
}

// Main analysis function
export function analyzeCandlestickPatterns(data: HistoricalData[]): CandlestickAnalysis {
  if (data.length < 10) {
    return {
      patterns: [],
      overallBias: 'neutral',
      score: 50,
      recentPatterns: []
    };
  }
  
  const patterns: CandlestickPattern[] = [];
  const avgBody = getAverageBodySize(data);
  const avgRange = getAverageRange(data);
  
  // Only analyze last 10 candles for patterns (more focused)
  const analysisWindow = Math.min(10, data.length);
  
  for (let i = data.length - analysisWindow; i < data.length; i++) {
    const candle = data[i];
    const prevCandles = data.slice(Math.max(0, i - 5), i);
    const index = i;
    
    // Single candle patterns - only detect one per candle (priority order)
    let singlePatternFound = false;
    
    const marubozu = detectMarubozu(candle, avgBody, avgRange);
    if (marubozu) {
      marubozu.index = index;
      patterns.push(marubozu);
      singlePatternFound = true;
    }
    
    if (!singlePatternFound) {
      const hammer = detectHammer(candle, avgBody, avgRange, prevCandles);
      if (hammer) {
        hammer.index = index;
        patterns.push(hammer);
        singlePatternFound = true;
      }
    }
    
    if (!singlePatternFound) {
      const doji = detectDoji(candle, avgBody, avgRange);
      if (doji) {
        doji.index = index;
        patterns.push(doji);
        singlePatternFound = true;
      }
    }
    
    // Skip spinning top - too common and unreliable
    
    // Two candle patterns (need previous candle)
    if (i > 0) {
      const prev = data[i - 1];
      
      const engulfing = detectEngulfing(candle, prev, avgBody);
      if (engulfing) {
        engulfing.index = index;
        patterns.push(engulfing);
      }
      
      // Only check harami if no engulfing found
      if (!engulfing) {
        const harami = detectHarami(candle, prev, avgBody);
        if (harami) {
          harami.index = index;
          patterns.push(harami);
        }
      }
      
      const piercingOrDarkCloud = detectPiercingOrDarkCloud(candle, prev, avgBody);
      if (piercingOrDarkCloud) {
        piercingOrDarkCloud.index = index;
        patterns.push(piercingOrDarkCloud);
      }
      
      const tweezer = detectTweezer(candle, prev, avgRange);
      if (tweezer) {
        tweezer.index = index;
        patterns.push(tweezer);
      }
    }
    
    // Three candle patterns (need two previous candles)
    if (i >= 2) {
      const threeCandles = data.slice(i - 2, i + 1);
      
      const morningStar = detectMorningStar(threeCandles, avgBody);
      if (morningStar) {
        morningStar.index = index;
        patterns.push(morningStar);
      }
      
      const eveningStar = detectEveningStar(threeCandles, avgBody);
      if (eveningStar) {
        eveningStar.index = index;
        patterns.push(eveningStar);
      }
      
      const threeWhiteSoldiers = detectThreeWhiteSoldiers(threeCandles, avgBody);
      if (threeWhiteSoldiers) {
        threeWhiteSoldiers.index = index;
        patterns.push(threeWhiteSoldiers);
      }
      
      const threeBlackCrows = detectThreeBlackCrows(threeCandles, avgBody);
      if (threeBlackCrows) {
        threeBlackCrows.index = index;
        patterns.push(threeBlackCrows);
      }
    }
  }
  
  // Calculate overall bias and score - only use recent patterns (last 5 days)
  const recentPatterns = patterns.filter(p => p.index >= data.length - 5);
  
  let bullishScore = 0;
  let bearishScore = 0;
  
  // Only score recent patterns for the overall bias
  recentPatterns.forEach(pattern => {
    const weight = pattern.reliability;
    
    if (pattern.direction === 'bullish') {
      bullishScore += weight;
    } else if (pattern.direction === 'bearish') {
      bearishScore += weight;
    }
  });
  
  // Determine overall bias - require stronger signal to declare bias
  let overallBias: 'bullish' | 'bearish' | 'neutral';
  const totalWeight = bullishScore + bearishScore;
  
  if (totalWeight < 0.5) {
    // Not enough patterns to determine bias
    overallBias = 'neutral';
  } else if (bullishScore > bearishScore * 1.3) {
    overallBias = 'bullish';
  } else if (bearishScore > bullishScore * 1.3) {
    overallBias = 'bearish';
  } else {
    overallBias = 'neutral';
  }
  
  // Calculate score (0-100) - more conservative scaling
  let score = 50;
  if (totalWeight > 0) {
    const bias = (bullishScore - bearishScore) / totalWeight;
    score = 50 + (bias * 30); // Scale to 20-80 range (more conservative)
  }
  score = Math.max(20, Math.min(80, score));
  
  return {
    patterns,
    overallBias,
    score: parseFloat(score.toFixed(1)),
    recentPatterns
  };
}

// Generate signals from candlestick analysis - more conservative
export function generateCandlestickSignals(analysis: CandlestickAnalysis): Signal[] {
  const signals: Signal[] = [];
  
  // Only add signals for high-reliability recent patterns
  analysis.recentPatterns
    .filter(pattern => pattern.reliability >= 0.6) // Only high reliability patterns
    .forEach(pattern => {
      signals.push({
        name: pattern.name,
        type: pattern.direction,
        strength: pattern.reliability * 0.8, // Reduce strength to not overpower other signals
        description: pattern.description
      });
    });
  
  // Only add overall bias signal if it's strong and based on multiple patterns
  if (analysis.recentPatterns.length >= 2 && analysis.overallBias !== 'neutral') {
    const biasStrength = Math.abs(analysis.score - 50) / 50;
    if (biasStrength > 0.3) {
      signals.push({
        name: 'Candlestick Pattern Bias',
        type: analysis.overallBias,
        strength: biasStrength * 0.6, // Reduced weight
        description: `Candlestick patterns suggest ${analysis.overallBias} bias`
      });
    }
  }
  
  return signals;
}

// Calculate candlestick score for prediction
export function calculateCandlestickScore(analysis: CandlestickAnalysis): number {
  return analysis.score;
}
