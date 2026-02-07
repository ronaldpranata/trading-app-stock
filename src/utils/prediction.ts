import { TechnicalIndicators, FundamentalData, PredictionResult, Signal, TimeframePrediction, PredictionTimeframe } from '@/types/stock';
import { generateTechnicalSignals, calculateTechnicalScore } from './technicalAnalysis';
import { generateFundamentalSignals, calculateFundamentalScore } from './fundamentalAnalysis';

// Timeframe configuration
const TIMEFRAME_CONFIG: Record<PredictionTimeframe, {
  label: string;
  days: number;
  technicalWeight: number;
  fundamentalWeight: number;
  volatilityMultiplier: number;
}> = {
  day: {
    label: '1 Day',
    days: 1,
    technicalWeight: 0.85,
    fundamentalWeight: 0.15,
    volatilityMultiplier: 0.5
  },
  week: {
    label: '1 Week',
    days: 5,
    technicalWeight: 0.75,
    fundamentalWeight: 0.25,
    volatilityMultiplier: 1.2
  },
  month: {
    label: '1 Month',
    days: 22,
    technicalWeight: 0.60,
    fundamentalWeight: 0.40,
    volatilityMultiplier: 2.5
  },
  quarter: {
    label: '3 Months',
    days: 66,
    technicalWeight: 0.45,
    fundamentalWeight: 0.55,
    volatilityMultiplier: 4.0
  },
  year: {
    label: '1 Year',
    days: 252,
    technicalWeight: 0.30,
    fundamentalWeight: 0.70,
    volatilityMultiplier: 8.0
  }
};

export function generateTimeframePrediction(
  currentPrice: number,
  technicalIndicators: TechnicalIndicators,
  fundamentalData: FundamentalData,
  technicalScore: number,
  fundamentalScore: number,
  timeframe: PredictionTimeframe
): TimeframePrediction {
  const config = TIMEFRAME_CONFIG[timeframe];
  
  // Calculate weighted score based on timeframe
  const weightedScore = (technicalScore * config.technicalWeight) + (fundamentalScore * config.fundamentalWeight);
  
  // Determine direction
  let direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  if (weightedScore >= 58) {
    direction = 'BULLISH';
  } else if (weightedScore <= 42) {
    direction = 'BEARISH';
  } else {
    direction = 'NEUTRAL';
  }
  
  // Calculate confidence - longer timeframes have lower confidence
  const baseConfidence = Math.abs(weightedScore - 50) * 1.5 + 35;
  const timeframeConfidencePenalty = Math.log(config.days + 1) * 5;
  const confidence = Math.min(95, Math.max(25, baseConfidence - timeframeConfidencePenalty));
  
  // Calculate expected price movement based on ATR and timeframe
  const dailyVolatility = technicalIndicators.atr / currentPrice;
  const expectedVolatility = dailyVolatility * Math.sqrt(config.days) * config.volatilityMultiplier;
  
  // Adjust expected change based on direction and score strength
  const scoreStrength = (weightedScore - 50) / 50; // -1 to 1
  let expectedChangePercent = expectedVolatility * 100 * scoreStrength;
  
  // Add fundamental growth factor for longer timeframes
  if (config.days >= 22) {
    const annualGrowthFactor = fundamentalData.revenueGrowth / 100;
    const periodGrowthFactor = annualGrowthFactor * (config.days / 252);
    expectedChangePercent += periodGrowthFactor * 100 * config.fundamentalWeight;
  }
  
  // Cap the expected change based on historical volatility
  const maxChange = expectedVolatility * 200;
  expectedChangePercent = Math.max(-maxChange, Math.min(maxChange, expectedChangePercent));
  
  const expectedChange = currentPrice * (expectedChangePercent / 100);
  const targetPrice = currentPrice + expectedChange;
  
  // Calculate stop loss based on ATR and timeframe
  const stopLossDistance = technicalIndicators.atr * config.volatilityMultiplier * 0.75;
  const stopLoss = direction === 'BULLISH' 
    ? currentPrice - stopLossDistance 
    : currentPrice + stopLossDistance;
  
  // Calculate risk/reward ratio
  const potentialReward = Math.abs(targetPrice - currentPrice);
  const potentialRisk = Math.abs(currentPrice - stopLoss);
  const riskRewardRatio = potentialRisk > 0 ? potentialReward / potentialRisk : 0;
  
  return {
    timeframe,
    direction,
    confidence: parseFloat(confidence.toFixed(1)),
    targetPrice: parseFloat(targetPrice.toFixed(2)),
    expectedChange: parseFloat(expectedChange.toFixed(2)),
    expectedChangePercent: parseFloat(expectedChangePercent.toFixed(2)),
    stopLoss: parseFloat(stopLoss.toFixed(2)),
    riskRewardRatio: parseFloat(riskRewardRatio.toFixed(2))
  };
}

export function generatePrediction(
  currentPrice: number,
  technicalIndicators: TechnicalIndicators,
  fundamentalData: FundamentalData
): PredictionResult {
  // Generate signals
  const technicalSignals = generateTechnicalSignals(technicalIndicators, currentPrice);
  const fundamentalSignals = generateFundamentalSignals(fundamentalData);
  
  // Calculate scores
  const technicalScore = calculateTechnicalScore(technicalSignals);
  const fundamentalScore = calculateFundamentalScore(fundamentalSignals);
  
  // Generate predictions for all timeframes
  const timeframes: PredictionTimeframe[] = ['day', 'week', 'month', 'quarter', 'year'];
  const timeframePredictions = timeframes.map(tf => 
    generateTimeframePrediction(
      currentPrice,
      technicalIndicators,
      fundamentalData,
      technicalScore,
      fundamentalScore,
      tf
    )
  );
  
  // Use week prediction as the default/main prediction
  const mainPrediction = timeframePredictions.find(p => p.timeframe === 'week') || timeframePredictions[0];
  
  // Generate recommendation
  const recommendation = generateRecommendation(
    mainPrediction.direction, 
    mainPrediction.confidence, 
    technicalScore, 
    fundamentalScore,
    timeframePredictions
  );
  
  return {
    direction: mainPrediction.direction,
    confidence: mainPrediction.confidence,
    targetPrice: mainPrediction.targetPrice,
    stopLoss: mainPrediction.stopLoss,
    technicalScore,
    fundamentalScore,
    signals: [...technicalSignals, ...fundamentalSignals],
    recommendation,
    timeframePredictions
  };
}

function generateRecommendation(
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL',
  confidence: number,
  technicalScore: number,
  fundamentalScore: number,
  timeframePredictions: TimeframePrediction[]
): string {
  const recommendations: string[] = [];
  
  // Check if all timeframes agree
  const allBullish = timeframePredictions.every(p => p.direction === 'BULLISH');
  const allBearish = timeframePredictions.every(p => p.direction === 'BEARISH');
  const shortTermDirection = timeframePredictions[0]?.direction;
  const longTermDirection = timeframePredictions[timeframePredictions.length - 1]?.direction;
  
  if (direction === 'BULLISH') {
    if (confidence >= 70) {
      recommendations.push('Strong buy signal detected.');
    } else if (confidence >= 50) {
      recommendations.push('Moderate buy signal detected.');
    } else {
      recommendations.push('Weak buy signal - consider waiting for confirmation.');
    }
    
    if (technicalScore > fundamentalScore) {
      recommendations.push('Technical momentum is driving the bullish outlook.');
    } else {
      recommendations.push('Strong fundamentals support the bullish case.');
    }
  } else if (direction === 'BEARISH') {
    if (confidence >= 70) {
      recommendations.push('Strong sell signal detected.');
    } else if (confidence >= 50) {
      recommendations.push('Moderate sell signal detected.');
    } else {
      recommendations.push('Weak sell signal - monitor closely.');
    }
    
    if (technicalScore < fundamentalScore) {
      recommendations.push('Technical weakness is driving the bearish outlook.');
    } else {
      recommendations.push('Fundamental concerns support the bearish case.');
    }
  } else {
    recommendations.push('Mixed signals - no clear direction.');
    recommendations.push('Consider waiting for a clearer trend before taking action.');
  }
  
  // Add timeframe alignment analysis
  if (allBullish) {
    recommendations.push('All timeframes show bullish alignment - strong trend confirmation.');
  } else if (allBearish) {
    recommendations.push('All timeframes show bearish alignment - strong downtrend confirmation.');
  } else if (shortTermDirection !== longTermDirection) {
    recommendations.push(`Short-term ${shortTermDirection?.toLowerCase()} vs long-term ${longTermDirection?.toLowerCase()} - potential trend reversal.`);
  }
  
  if (technicalScore >= 70 && fundamentalScore >= 70) {
    recommendations.push('Both technical and fundamental analysis align positively.');
  } else if (technicalScore <= 30 && fundamentalScore <= 30) {
    recommendations.push('Both technical and fundamental analysis show weakness.');
  } else if (Math.abs(technicalScore - fundamentalScore) > 30) {
    recommendations.push('Divergence between technical and fundamental analysis - exercise caution.');
  }
  
  return recommendations.join(' ');
}

// Calculate price momentum
export function calculateMomentum(prices: number[]): number {
  if (prices.length < 2) return 0;
  const recent = prices.slice(-10);
  const older = prices.slice(-20, -10);
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
  
  return ((recentAvg - olderAvg) / olderAvg) * 100;
}

// Calculate trend strength
export function calculateTrendStrength(prices: number[]): { trend: 'up' | 'down' | 'sideways'; strength: number } {
  if (prices.length < 20) return { trend: 'sideways', strength: 0 };
  
  const recent = prices.slice(-20);
  let upMoves = 0;
  let downMoves = 0;
  
  for (let i = 1; i < recent.length; i++) {
    if (recent[i] > recent[i - 1]) upMoves++;
    else if (recent[i] < recent[i - 1]) downMoves++;
  }
  
  const total = upMoves + downMoves || 1;
  const upRatio = upMoves / total;
  const downRatio = downMoves / total;
  
  if (upRatio > 0.6) {
    return { trend: 'up', strength: upRatio };
  } else if (downRatio > 0.6) {
    return { trend: 'down', strength: downRatio };
  }
  
  return { trend: 'sideways', strength: Math.max(upRatio, downRatio) };
}

// Get timeframe label
export function getTimeframeLabel(timeframe: PredictionTimeframe): string {
  return TIMEFRAME_CONFIG[timeframe].label;
}
