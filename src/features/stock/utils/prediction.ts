import { TechnicalIndicators, FundamentalData, PredictionResult, Signal, TimeframePrediction, PredictionTimeframe } from '../types';
import { generateTechnicalSignals, calculateTechnicalScore } from './technicalAnalysis';
import { generateFundamentalSignals, calculateFundamentalScore } from './fundamentalAnalysis';

// Timeframe configuration
const TIMEFRAME_CONFIG: Record<PredictionTimeframe, {
  label: string;
  days: number;
  technicalWeight: number;
  fundamentalWeight: number;
  dcfWeight: number;
  volatilityMultiplier: number;
}> = {
  day: {
    label: '1 Day',
    days: 1,
    technicalWeight: 0.90,
    fundamentalWeight: 0.10,
    dcfWeight: 0.0,
    volatilityMultiplier: 0.5
  },
  week: {
    label: '1 Week',
    days: 5,
    technicalWeight: 0.70,
    fundamentalWeight: 0.25,
    dcfWeight: 0.05,
    volatilityMultiplier: 1.2
  },
  month: {
    label: '1 Month',
    days: 22,
    technicalWeight: 0.50,
    fundamentalWeight: 0.35,
    dcfWeight: 0.15,
    volatilityMultiplier: 2.5
  },
  quarter: {
    label: '3 Months',
    days: 66,
    technicalWeight: 0.35,
    fundamentalWeight: 0.40,
    dcfWeight: 0.25,
    volatilityMultiplier: 4.0
  },
  year: {
    label: '1 Year',
    days: 252,
    technicalWeight: 0.20,
    fundamentalWeight: 0.45,
    dcfWeight: 0.35,
    volatilityMultiplier: 8.0
  }
};

export function generateTimeframePrediction(
  currentPrice: number,
  technicalIndicators: TechnicalIndicators,
  fundamentalData: FundamentalData,
  technicalScore: number,
  fundamentalScore: number,
  dcfScore: number,
  sentimentScore: number, // New parameter
  timeframe: PredictionTimeframe
): TimeframePrediction {
  const config = TIMEFRAME_CONFIG[timeframe];
  
  // Calculate weighted score based on timeframe
  // Add sentiment weight (impacts short term more)
  let sentimentWeight = 0;
  if (timeframe === 'day') sentimentWeight = 0.40;     // High impact on daily
  else if (timeframe === 'week') sentimentWeight = 0.25; // Moderate impact on weekly
  else if (timeframe === 'month') sentimentWeight = 0.10; // Low impact on monthly
  
  // Re-normalize weights to sum to 1
  const existingWeightSum = config.technicalWeight + config.fundamentalWeight + config.dcfWeight;
  const normalizationFactor = 1 - sentimentWeight;

  const weightedScore = 
    (technicalScore * config.technicalWeight * normalizationFactor) + 
    (fundamentalScore * config.fundamentalWeight * normalizationFactor) +
    (dcfScore * config.dcfWeight * normalizationFactor) +
    (sentimentScore * sentimentWeight);
  
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
  
  // Boost confidence if sentiment confirms direction
  let sentimentBoost = 0;
  if (direction === 'BULLISH' && sentimentScore > 60) sentimentBoost = 10;
  if (direction === 'BEARISH' && sentimentScore < 40) sentimentBoost = 10;

  const timeframeConfidencePenalty = Math.log(config.days + 1) * 5;
  const confidence = Math.min(95, Math.max(25, baseConfidence + sentimentBoost - timeframeConfidencePenalty));
  
  // ... rest of logic ...
  const dailyVolatility = technicalIndicators.atr / currentPrice;
  const expectedVolatility = dailyVolatility * Math.sqrt(config.days) * config.volatilityMultiplier;
  
  const scoreStrength = (weightedScore - 50) / 50; 
  let expectedChangePercent = expectedVolatility * 100 * scoreStrength;

  // Sentiment Momentum Bonus for short term
  if (timeframe === 'day' || timeframe === 'week') {
    const sentimentImpact = (sentimentScore - 50) / 50; // -1 to 1
    expectedChangePercent += sentimentImpact * expectedVolatility * 50; // Up to 50% extra volatility from sentiment
  }

  // ... (rest is same)
  if (config.days >= 22) {
    const annualGrowthFactor = fundamentalData.revenueGrowth / 100;
    const periodGrowthFactor = annualGrowthFactor * (config.days / 252);
    expectedChangePercent += periodGrowthFactor * 100 * config.fundamentalWeight;
  }
  
  const maxChange = expectedVolatility * 200;
  expectedChangePercent = Math.max(-maxChange, Math.min(maxChange, expectedChangePercent));
  
  const maxBullishChange = config.days <= 5 ? 20 : config.days <= 22 ? 50 : config.days <= 66 ? 100 : 200;
  const maxBearishChange = -80;
  
  expectedChangePercent = Math.max(maxBearishChange, Math.min(maxBullishChange, expectedChangePercent));
  
  const expectedChange = currentPrice * (expectedChangePercent / 100);
  let targetPrice = currentPrice + expectedChange;
  
  if (targetPrice <= 0) {
    targetPrice = currentPrice * 0.1;
    const adjustedExpectedChange = targetPrice - currentPrice;
    expectedChangePercent = (adjustedExpectedChange / currentPrice) * 100;
  }
  
  const stopLossDistance = technicalIndicators.atr * config.volatilityMultiplier * 0.75;
  const stopLoss = direction === 'BULLISH' 
    ? currentPrice - stopLossDistance 
    : currentPrice + stopLossDistance;
  
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

// ... calculateDcfScore ...
function calculateDcfScore(dcf: FundamentalData['dcf'], currentPrice: number): number {
  if (!dcf || dcf.base <= 0 || currentPrice <= 0) {
    return 50; // Neutral score if no valid dcf/analyst target or price
  }

  const dcfRatio = dcf.base / currentPrice;
  // Map ratio to a score from 0-100.
  // Using a logarithmic scale to temper the effect of extreme valuations.
  const score = 50 + 25 * Math.log2(dcfRatio);

  return Math.max(0, Math.min(100, score)); // Clamp between 0 and 100
}

export function generatePrediction(
  currentPrice: number,
  technicalIndicators: TechnicalIndicators,
  fundamentalData: FundamentalData,
  sentimentScore: number = 50 // Default neutral
): PredictionResult {
  const technicalSignals = generateTechnicalSignals(technicalIndicators, currentPrice);
  const fundamentalSignals = generateFundamentalSignals(fundamentalData);
  
  const technicalScore = calculateTechnicalScore(technicalSignals);
  const fundamentalScore = calculateFundamentalScore(fundamentalSignals);
  const dcfScore = calculateDcfScore(fundamentalData.dcf, currentPrice);
  
  const timeframes: PredictionTimeframe[] = ['day', 'week', 'month', 'quarter', 'year'];
  const timeframePredictions = timeframes.map(tf => 
    generateTimeframePrediction(
      currentPrice,
      technicalIndicators,
      fundamentalData,
      technicalScore,
      fundamentalScore,
      dcfScore,
      sentimentScore,
      tf
    )
  );
  
  const mainPrediction = timeframePredictions.find(p => p.timeframe === 'week') || timeframePredictions[0];
  
  const recommendation = generateRecommendation(
    mainPrediction.direction, 
    mainPrediction.confidence, 
    technicalScore, 
    fundamentalScore,
    dcfScore,
    sentimentScore,
    timeframePredictions
  );
  
  return {
    direction: mainPrediction.direction,
    confidence: mainPrediction.confidence,
    targetPrice: mainPrediction.targetPrice,
    stopLoss: mainPrediction.stopLoss,
    technicalScore,
    fundamentalScore,
    sentimentScore,
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
  dcfScore: number,
  sentimentScore: number,
  timeframePredictions: TimeframePrediction[]
): string {
  const recommendations: string[] = [];
  
  const allBullish = timeframePredictions.every(p => p.direction === 'BULLISH');
  const allBearish = timeframePredictions.every(p => p.direction === 'BEARISH');
  const shortTermDirection = timeframePredictions[0]?.direction;
  const longTermDirection = timeframePredictions[timeframePredictions.length - 1]?.direction;
  
  if (direction === 'BULLISH') {
    if (confidence >= 70) recommendations.push('Strong buy signal detected.');
    else if (confidence >= 50) recommendations.push('Moderate buy signal detected.');
    else recommendations.push('Weak buy signal - consider waiting for confirmation.');
    
    if (technicalScore > fundamentalScore) recommendations.push('Technical momentum is driving the bullish outlook.');
    else recommendations.push('Strong fundamentals support the bullish case.');
  } else if (direction === 'BEARISH') {
    if (confidence >= 70) recommendations.push('Strong sell signal detected.');
    else if (confidence >= 50) recommendations.push('Moderate sell signal detected.');
    else recommendations.push('Weak sell signal - monitor closely.');
    
    if (technicalScore < fundamentalScore) recommendations.push('Technical weakness is driving the bearish outlook.');
    else recommendations.push('Fundamental concerns support the bearish case.');
  } else {
    recommendations.push('Mixed signals - no clear direction.');
    recommendations.push('Consider waiting for a clearer trend before taking action.');
  }

  // Sentiment Analysis Commentary
  if (sentimentScore >= 70) recommendations.push('Recent news sentiment is very positive, potentially boosting short-term price.');
  else if (sentimentScore >= 60) recommendations.push('Positive news sentiment is supportive.');
  else if (sentimentScore <= 30) recommendations.push('Negative news sentiment is creating headwinds.');
  else if (sentimentScore <= 40) recommendations.push('Cautious sentiment around recent news.');

  
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
  
  if (dcfScore > 75) {
    recommendations.push('DCF valuation suggests the stock is significantly undervalued.');
  } else if (dcfScore > 60) {
    recommendations.push('DCF valuation indicates potential undervaluation.');
  } else if (dcfScore < 25) {
    recommendations.push('DCF valuation suggests the stock is significantly overvalued.');
  } else if (dcfScore < 40) {
    recommendations.push('DCF valuation indicates potential overvaluation.');
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
