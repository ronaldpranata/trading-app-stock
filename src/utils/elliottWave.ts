import { HistoricalData, ElliottWaveAnalysis, PivotPoint, FibonacciLevel, Signal } from '@/types/stock';

// Fibonacci ratios used in Elliott Wave
const FIBONACCI_RATIOS = {
  retracements: [0.236, 0.382, 0.5, 0.618, 0.786],
  extensions: [1.0, 1.272, 1.618, 2.0, 2.618]
};

// Wave characteristics based on Elliott Wave theory
const WAVE_CHARACTERISTICS = {
  wave1: { minRetracement: 0, maxRetracement: 0, description: 'Initial impulse wave' },
  wave2: { minRetracement: 0.382, maxRetracement: 0.786, description: 'Corrective wave (cannot retrace 100% of Wave 1)' },
  wave3: { minExtension: 1.618, maxExtension: 2.618, description: 'Strongest impulse wave (usually longest)' },
  wave4: { minRetracement: 0.236, maxRetracement: 0.5, description: 'Corrective wave (cannot overlap Wave 1)' },
  wave5: { minExtension: 0.618, maxExtension: 1.0, description: 'Final impulse wave' },
  waveA: { description: 'First corrective wave' },
  waveB: { minRetracement: 0.382, maxRetracement: 0.786, description: 'Counter-trend correction' },
  waveC: { minExtension: 1.0, maxExtension: 1.618, description: 'Final corrective wave' }
};

interface ZigZagPoint {
  index: number;
  price: number;
  date: string;
  type: 'high' | 'low';
}

// Find significant pivot points using zigzag algorithm
function findPivotPoints(data: HistoricalData[], threshold: number = 0.05): ZigZagPoint[] {
  if (data.length < 5) return [];
  
  const pivots: ZigZagPoint[] = [];
  let lastPivot: ZigZagPoint | null = null;
  let trend: 'up' | 'down' | null = null;
  
  for (let i = 2; i < data.length - 2; i++) {
    const current = data[i];
    const isLocalHigh = current.high >= data[i-1].high && current.high >= data[i-2].high &&
                        current.high >= data[i+1].high && current.high >= data[i+2].high;
    const isLocalLow = current.low <= data[i-1].low && current.low <= data[i-2].low &&
                       current.low <= data[i+1].low && current.low <= data[i+2].low;
    
    if (isLocalHigh) {
      const point: ZigZagPoint = {
        index: i,
        price: current.high,
        date: current.date,
        type: 'high'
      };
      
      if (!lastPivot || lastPivot.type === 'low') {
        if (!lastPivot || Math.abs(point.price - lastPivot.price) / lastPivot.price >= threshold) {
          pivots.push(point);
          lastPivot = point;
          trend = 'up';
        }
      } else if (point.price > lastPivot.price) {
        // Replace last high with higher high
        pivots[pivots.length - 1] = point;
        lastPivot = point;
      }
    }
    
    if (isLocalLow) {
      const point: ZigZagPoint = {
        index: i,
        price: current.low,
        date: current.date,
        type: 'low'
      };
      
      if (!lastPivot || lastPivot.type === 'high') {
        if (!lastPivot || Math.abs(point.price - lastPivot.price) / lastPivot.price >= threshold) {
          pivots.push(point);
          lastPivot = point;
          trend = 'down';
        }
      } else if (point.price < lastPivot.price) {
        // Replace last low with lower low
        pivots[pivots.length - 1] = point;
        lastPivot = point;
      }
    }
  }
  
  return pivots;
}

// Calculate Fibonacci levels
function calculateFibonacciLevels(startPrice: number, endPrice: number, isUptrend: boolean): FibonacciLevel[] {
  const levels: FibonacciLevel[] = [];
  const range = Math.abs(endPrice - startPrice);
  
  // Retracement levels
  FIBONACCI_RATIOS.retracements.forEach(ratio => {
    const price = isUptrend 
      ? endPrice - (range * ratio)
      : endPrice + (range * ratio);
    levels.push({
      level: ratio,
      price: parseFloat(price.toFixed(2)),
      label: `${(ratio * 100).toFixed(1)}% Retracement`,
      type: 'retracement'
    });
  });
  
  // Extension levels
  FIBONACCI_RATIOS.extensions.forEach(ratio => {
    const price = isUptrend
      ? endPrice + (range * (ratio - 1))
      : endPrice - (range * (ratio - 1));
    levels.push({
      level: ratio,
      price: parseFloat(price.toFixed(2)),
      label: `${(ratio * 100).toFixed(1)}% Extension`,
      type: 'extension'
    });
  });
  
  return levels;
}

// Identify current wave position
function identifyWavePosition(pivots: ZigZagPoint[], currentPrice: number): {
  currentWave: number;
  waveType: 'impulse' | 'corrective';
  wavePhase: 'motive' | 'corrective';
  trendDirection: 'up' | 'down';
  waveProgress: number;
  confidence: number;
} {
  if (pivots.length < 3) {
    return {
      currentWave: 1,
      waveType: 'impulse',
      wavePhase: 'motive',
      trendDirection: 'up',
      waveProgress: 50,
      confidence: 30
    };
  }
  
  // Analyze the last several pivots to determine wave count
  const recentPivots = pivots.slice(-8);
  
  // Determine overall trend
  const firstPivot = recentPivots[0];
  const lastPivot = recentPivots[recentPivots.length - 1];
  const trendDirection: 'up' | 'down' = lastPivot.price > firstPivot.price ? 'up' : 'down';
  
  // Count waves based on pivot alternation
  let waveCount = 0;
  let impulseWaves = 0;
  let correctiveWaves = 0;
  
  for (let i = 1; i < recentPivots.length; i++) {
    const prev = recentPivots[i - 1];
    const curr = recentPivots[i];
    
    if (trendDirection === 'up') {
      if (curr.type === 'high' && curr.price > prev.price) {
        impulseWaves++;
      } else if (curr.type === 'low') {
        correctiveWaves++;
      }
    } else {
      if (curr.type === 'low' && curr.price < prev.price) {
        impulseWaves++;
      } else if (curr.type === 'high') {
        correctiveWaves++;
      }
    }
    waveCount++;
  }
  
  // Determine current wave (1-5 for impulse, 6-8 for A-B-C corrective)
  const totalWaves = impulseWaves + correctiveWaves;
  let currentWave: number;
  let waveType: 'impulse' | 'corrective';
  let wavePhase: 'motive' | 'corrective';
  
  if (totalWaves <= 5) {
    // In impulse phase
    currentWave = Math.min(totalWaves, 5);
    if (currentWave === 0) currentWave = 1;
    waveType = 'impulse';
    wavePhase = currentWave % 2 === 1 ? 'motive' : 'corrective';
  } else {
    // In corrective phase (A-B-C)
    const correctivePosition = (totalWaves - 5) % 3;
    currentWave = 6 + correctivePosition; // 6=A, 7=B, 8=C
    waveType = 'corrective';
    wavePhase = correctivePosition === 1 ? 'motive' : 'corrective'; // B is counter-trend
  }
  
  // Calculate wave progress
  const lastTwoPivots = recentPivots.slice(-2);
  let waveProgress = 50;
  if (lastTwoPivots.length === 2) {
    const waveStart = lastTwoPivots[0].price;
    const waveRange = Math.abs(lastTwoPivots[1].price - waveStart);
    if (waveRange > 0) {
      waveProgress = Math.min(100, Math.abs(currentPrice - waveStart) / waveRange * 100);
    }
  }
  
  // Calculate confidence based on wave clarity
  const confidence = Math.min(85, 40 + (recentPivots.length * 5) + (impulseWaves > correctiveWaves ? 10 : 0));
  
  return {
    currentWave,
    waveType,
    wavePhase,
    trendDirection,
    waveProgress: parseFloat(waveProgress.toFixed(1)),
    confidence
  };
}

// Get wave label
function getWaveLabel(waveNumber: number): string {
  if (waveNumber <= 5) return `Wave ${waveNumber}`;
  const labels = ['A', 'B', 'C'];
  return `Wave ${labels[waveNumber - 6] || 'C'}`;
}

// Calculate next wave target
function calculateNextWaveTarget(
  pivots: ZigZagPoint[],
  currentWave: number,
  trendDirection: 'up' | 'down',
  currentPrice: number
): { target: number; invalidation: number } {
  if (pivots.length < 2) {
    return { target: currentPrice * 1.05, invalidation: currentPrice * 0.95 };
  }
  
  const lastPivot = pivots[pivots.length - 1];
  const prevPivot = pivots[pivots.length - 2];
  const waveRange = Math.abs(lastPivot.price - prevPivot.price);
  
  let target: number;
  let invalidation: number;
  
  // Calculate target based on current wave
  switch (currentWave) {
    case 1:
    case 3:
    case 5:
      // Impulse waves - target is extension
      target = trendDirection === 'up'
        ? lastPivot.price + waveRange * 1.618
        : lastPivot.price - waveRange * 1.618;
      invalidation = trendDirection === 'up'
        ? lastPivot.price - waveRange * 0.5
        : lastPivot.price + waveRange * 0.5;
      break;
    case 2:
    case 4:
      // Corrective waves - target is retracement
      target = trendDirection === 'up'
        ? lastPivot.price - waveRange * 0.618
        : lastPivot.price + waveRange * 0.618;
      invalidation = trendDirection === 'up'
        ? prevPivot.price // Wave 2 cannot go below Wave 1 start
        : prevPivot.price;
      break;
    case 6: // Wave A
    case 8: // Wave C
      target = trendDirection === 'up'
        ? lastPivot.price - waveRange * 1.0
        : lastPivot.price + waveRange * 1.0;
      invalidation = lastPivot.price;
      break;
    case 7: // Wave B
      target = trendDirection === 'up'
        ? lastPivot.price + waveRange * 0.618
        : lastPivot.price - waveRange * 0.618;
      invalidation = trendDirection === 'up'
        ? lastPivot.price - waveRange * 0.5
        : lastPivot.price + waveRange * 0.5;
      break;
    default:
      target = currentPrice * (trendDirection === 'up' ? 1.05 : 0.95);
      invalidation = currentPrice * (trendDirection === 'up' ? 0.95 : 1.05);
  }
  
  return {
    target: parseFloat(target.toFixed(2)),
    invalidation: parseFloat(invalidation.toFixed(2))
  };
}

// Generate wave description
function generateWaveDescription(
  currentWave: number,
  waveType: 'impulse' | 'corrective',
  wavePhase: 'motive' | 'corrective',
  trendDirection: 'up' | 'down',
  waveProgress: number
): string {
  const waveLabel = getWaveLabel(currentWave);
  const trendText = trendDirection === 'up' ? 'uptrend' : 'downtrend';
  const phaseText = wavePhase === 'motive' ? 'impulse move' : 'corrective pullback';
  
  let description = `Currently in ${waveLabel} of ${waveType} pattern. `;
  
  if (waveType === 'impulse') {
    if (currentWave === 1) {
      description += `Early stage of new ${trendText}. Initial ${phaseText} underway.`;
    } else if (currentWave === 2) {
      description += `Corrective pullback after Wave 1. Looking for support at 50-61.8% retracement.`;
    } else if (currentWave === 3) {
      description += `Strongest wave in progress. Typically extends to 161.8% of Wave 1.`;
    } else if (currentWave === 4) {
      description += `Corrective consolidation. Should not overlap Wave 1 territory.`;
    } else if (currentWave === 5) {
      description += `Final impulse wave. Watch for divergence signals indicating completion.`;
    }
  } else {
    if (currentWave === 6) { // Wave A
      description += `First leg of correction. Expect sharp move against prior trend.`;
    } else if (currentWave === 7) { // Wave B
      description += `Counter-trend bounce. Often retraces 50-78.6% of Wave A.`;
    } else if (currentWave === 8) { // Wave C
      description += `Final corrective wave. Typically equals Wave A in length.`;
    }
  }
  
  description += ` Wave is approximately ${waveProgress.toFixed(0)}% complete.`;
  
  return description;
}

// Main Elliott Wave analysis function
export function analyzeElliottWave(historicalData: HistoricalData[]): ElliottWaveAnalysis {
  if (historicalData.length < 20) {
    return {
      currentWave: 1,
      waveType: 'impulse',
      wavePhase: 'motive',
      trendDirection: 'up',
      waveProgress: 0,
      pivotPoints: [],
      fibonacciLevels: [],
      nextWaveTarget: historicalData[historicalData.length - 1]?.close || 0,
      invalidationLevel: 0,
      waveDescription: 'Insufficient data for Elliott Wave analysis',
      confidence: 0
    };
  }
  
  const currentPrice = historicalData[historicalData.length - 1].close;
  
  // Find pivot points
  const zigzagPivots = findPivotPoints(historicalData, 0.03);
  
  // Identify wave position
  const wavePosition = identifyWavePosition(zigzagPivots, currentPrice);
  
  // Convert to PivotPoint format
  const pivotPoints: PivotPoint[] = zigzagPivots.slice(-8).map((p, i) => ({
    type: p.type,
    price: p.price,
    date: p.date,
    waveLabel: `P${i + 1}`
  }));
  
  // Calculate Fibonacci levels
  let fibonacciLevels: FibonacciLevel[] = [];
  if (zigzagPivots.length >= 2) {
    const lastTwo = zigzagPivots.slice(-2);
    fibonacciLevels = calculateFibonacciLevels(
      lastTwo[0].price,
      lastTwo[1].price,
      wavePosition.trendDirection === 'up'
    );
  }
  
  // Calculate targets
  const { target, invalidation } = calculateNextWaveTarget(
    zigzagPivots,
    wavePosition.currentWave,
    wavePosition.trendDirection,
    currentPrice
  );
  
  // Generate description
  const waveDescription = generateWaveDescription(
    wavePosition.currentWave,
    wavePosition.waveType,
    wavePosition.wavePhase,
    wavePosition.trendDirection,
    wavePosition.waveProgress
  );
  
  return {
    currentWave: wavePosition.currentWave,
    waveType: wavePosition.waveType,
    wavePhase: wavePosition.wavePhase,
    trendDirection: wavePosition.trendDirection,
    waveProgress: wavePosition.waveProgress,
    pivotPoints,
    fibonacciLevels,
    nextWaveTarget: target,
    invalidationLevel: invalidation,
    waveDescription,
    confidence: wavePosition.confidence
  };
}

// Generate Elliott Wave signals
export function generateElliottWaveSignals(elliottWave: ElliottWaveAnalysis, currentPrice: number): Signal[] {
  const signals: Signal[] = [];
  
  if (elliottWave.confidence < 30) {
    return signals;
  }
  
  const { currentWave, waveType, wavePhase, trendDirection, waveProgress, nextWaveTarget, invalidationLevel } = elliottWave;
  
  // Wave position signals
  if (waveType === 'impulse') {
    if (currentWave === 3 && waveProgress < 50) {
      signals.push({
        name: 'Elliott Wave 3',
        type: trendDirection === 'up' ? 'bullish' : 'bearish',
        strength: 0.85,
        description: `In Wave 3 (strongest wave) - ${trendDirection === 'up' ? 'bullish' : 'bearish'} momentum expected`
      });
    } else if (currentWave === 5 && waveProgress > 70) {
      signals.push({
        name: 'Elliott Wave 5 Completion',
        type: trendDirection === 'up' ? 'bearish' : 'bullish',
        strength: 0.7,
        description: 'Wave 5 nearing completion - potential trend reversal ahead'
      });
    } else if (currentWave === 2 && waveProgress > 50) {
      signals.push({
        name: 'Elliott Wave 2 Support',
        type: trendDirection === 'up' ? 'bullish' : 'bearish',
        strength: 0.65,
        description: 'Wave 2 correction may be ending - Wave 3 setup forming'
      });
    } else if (currentWave === 4 && waveProgress > 50) {
      signals.push({
        name: 'Elliott Wave 4 Support',
        type: trendDirection === 'up' ? 'bullish' : 'bearish',
        strength: 0.6,
        description: 'Wave 4 correction may be ending - Wave 5 setup forming'
      });
    }
  } else {
    // Corrective wave signals
    if (currentWave === 8 && waveProgress > 60) { // Wave C
      signals.push({
        name: 'Elliott Wave C Completion',
        type: trendDirection === 'up' ? 'bullish' : 'bearish',
        strength: 0.75,
        description: 'Corrective Wave C nearing completion - new impulse may begin'
      });
    }
  }
  
  // Fibonacci level signals
  elliottWave.fibonacciLevels.forEach(fib => {
    const priceDistance = Math.abs(currentPrice - fib.price) / currentPrice;
    if (priceDistance < 0.02) { // Within 2% of Fibonacci level
      if (fib.type === 'retracement' && (fib.level === 0.618 || fib.level === 0.5)) {
        signals.push({
          name: `Fib ${(fib.level * 100).toFixed(1)}% Level`,
          type: wavePhase === 'corrective' ? (trendDirection === 'up' ? 'bullish' : 'bearish') : 'neutral',
          strength: 0.6,
          description: `Price at key ${fib.label} - potential support/resistance`
        });
      }
    }
  });
  
  // Target proximity signal
  const targetDistance = Math.abs(currentPrice - nextWaveTarget) / currentPrice;
  if (targetDistance < 0.03) {
    signals.push({
      name: 'Wave Target Reached',
      type: 'neutral',
      strength: 0.5,
      description: `Price approaching wave target at $${nextWaveTarget.toFixed(2)}`
    });
  }
  
  // Invalidation warning
  if (trendDirection === 'up' && currentPrice < invalidationLevel) {
    signals.push({
      name: 'Wave Count Invalid',
      type: 'bearish',
      strength: 0.8,
      description: `Price below invalidation level ($${invalidationLevel.toFixed(2)}) - wave count may need revision`
    });
  } else if (trendDirection === 'down' && currentPrice > invalidationLevel) {
    signals.push({
      name: 'Wave Count Invalid',
      type: 'bullish',
      strength: 0.8,
      description: `Price above invalidation level ($${invalidationLevel.toFixed(2)}) - wave count may need revision`
    });
  }
  
  return signals;
}
