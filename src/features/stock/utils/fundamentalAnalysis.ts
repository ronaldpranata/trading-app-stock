import { FundamentalData, Signal } from '../types';

// Generate fundamental signals including PEG ratio
export function generateFundamentalSignals(fundamentals: FundamentalData): Signal[] {
  const signals: Signal[] = [];
  
  // PEG Ratio Analysis (most important valuation metric)
  // PEG < 1: Undervalued relative to growth
  // PEG 1-2: Fairly valued
  // PEG > 2: Overvalued relative to growth
  if (fundamentals.pegRatio > 0) {
    if (fundamentals.pegRatio < 0.5) {
      signals.push({
        name: 'Very Low PEG Ratio',
        type: 'bullish',
        strength: 0.9,
        description: `PEG ratio of ${fundamentals.pegRatio.toFixed(2)} - significantly undervalued relative to growth`
      });
    } else if (fundamentals.pegRatio < 1) {
      signals.push({
        name: 'Low PEG Ratio',
        type: 'bullish',
        strength: 0.75,
        description: `PEG ratio of ${fundamentals.pegRatio.toFixed(2)} - undervalued relative to growth`
      });
    } else if (fundamentals.pegRatio > 3) {
      signals.push({
        name: 'Very High PEG Ratio',
        type: 'bearish',
        strength: 0.8,
        description: `PEG ratio of ${fundamentals.pegRatio.toFixed(2)} - significantly overvalued relative to growth`
      });
    } else if (fundamentals.pegRatio > 2) {
      signals.push({
        name: 'High PEG Ratio',
        type: 'bearish',
        strength: 0.6,
        description: `PEG ratio of ${fundamentals.pegRatio.toFixed(2)} - overvalued relative to growth`
      });
    } else {
      signals.push({
        name: 'Fair PEG Ratio',
        type: 'neutral',
        strength: 0.3,
        description: `PEG ratio of ${fundamentals.pegRatio.toFixed(2)} - fairly valued relative to growth`
      });
    }
  }
  
  // EPS Growth Analysis
  if (fundamentals.epsGrowth > 0) {
    if (fundamentals.epsGrowth > 25) {
      signals.push({
        name: 'Strong EPS Growth',
        type: 'bullish',
        strength: 0.8,
        description: `EPS growth of ${fundamentals.epsGrowth.toFixed(2)}% - excellent earnings momentum`
      });
    } else if (fundamentals.epsGrowth > 15) {
      signals.push({
        name: 'Good EPS Growth',
        type: 'bullish',
        strength: 0.6,
        description: `EPS growth of ${fundamentals.epsGrowth.toFixed(2)}% - solid earnings growth`
      });
    }
  } else if (fundamentals.epsGrowth < -10) {
    signals.push({
      name: 'Declining EPS',
      type: 'bearish',
      strength: 0.7,
      description: `EPS declining at ${fundamentals.epsGrowth.toFixed(2)}% - earnings deteriorating`
    });
  }
  
  // P/E Ratio Analysis
  if (fundamentals.peRatio > 0 && fundamentals.peRatio < 15) {
    signals.push({
      name: 'Low P/E Ratio',
      type: 'bullish',
      strength: 0.6,
      description: `P/E ratio of ${fundamentals.peRatio.toFixed(2)} suggests undervaluation`
    });
  } else if (fundamentals.peRatio > 40 && fundamentals.evToEbitda > 20) {
    // Only heavily penalize high P/E if enterprise value vs cash flow is also bloated
    signals.push({
      name: 'High P/E Ratio',
      type: 'bearish',
      strength: 0.5,
      description: `P/E ratio of ${fundamentals.peRatio.toFixed(2)} suggests overvaluation`
    });
  }
  
  // P/B Ratio Analysis
  if (fundamentals.pbRatio > 0 && fundamentals.pbRatio < 1) {
    signals.push({
      name: 'Low P/B Ratio',
      type: 'bullish',
      strength: 0.6,
      description: `P/B ratio of ${fundamentals.pbRatio.toFixed(2)} - trading below book value`
    });
  } else if (fundamentals.pbRatio > 8 && fundamentals.roe < 15) {
    // High P/B is okay if ROE (capital efficiency) is exceptional
    signals.push({
      name: 'High P/B Ratio',
      type: 'bearish',
      strength: 0.4,
      description: `P/B ratio of ${fundamentals.pbRatio.toFixed(2)} - premium valuation without matching ROE`
    });
  }

  // EV/EBITDA Analysis (Cash-generative valuation proxy)
  if (fundamentals.evToEbitda > 0) {
    if (fundamentals.evToEbitda < 10) {
      signals.push({
        name: 'Strong EV/EBITDA',
        type: 'bullish',
        strength: 0.7,
        description: `EV/EBITDA of ${fundamentals.evToEbitda.toFixed(2)} indicates strong cash generation vs enterprise value`
      });
    } else if (fundamentals.evToEbitda > 25) {
      signals.push({
        name: 'Weak EV/EBITDA',
        type: 'bearish',
        strength: 0.6,
        description: `EV/EBITDA of ${fundamentals.evToEbitda.toFixed(2)} indicates bloated enterprise value`
      });
    }
  }
  
  // ROE Analysis
  if (fundamentals.roe > 25) {
    signals.push({
      name: 'Excellent ROE',
      type: 'bullish',
      strength: 0.7,
      description: `ROE of ${fundamentals.roe.toFixed(2)}% indicates excellent capital efficiency`
    });
  } else if (fundamentals.roe > 15) {
    signals.push({
      name: 'Good ROE',
      type: 'bullish',
      strength: 0.5,
      description: `ROE of ${fundamentals.roe.toFixed(2)}% indicates good capital efficiency`
    });
  } else if (fundamentals.roe < 5 && fundamentals.roe > 0) {
    signals.push({
      name: 'Weak ROE',
      type: 'bearish',
      strength: 0.5,
      description: `ROE of ${fundamentals.roe.toFixed(2)}% indicates poor capital efficiency`
    });
  }
  
  // Debt to Equity Analysis
  if (fundamentals.debtToEquity < 0.3) {
    signals.push({
      name: 'Very Low Debt',
      type: 'bullish',
      strength: 0.6,
      description: `D/E ratio of ${fundamentals.debtToEquity.toFixed(2)} - very conservative leverage`
    });
  } else if (fundamentals.debtToEquity > 2) {
    signals.push({
      name: 'High Debt',
      type: 'bearish',
      strength: 0.7,
      description: `D/E ratio of ${fundamentals.debtToEquity.toFixed(2)} - high leverage risk`
    });
  }
  
  // Revenue Growth Analysis
  if (fundamentals.revenueGrowth > 20) {
    signals.push({
      name: 'Strong Revenue Growth',
      type: 'bullish',
      strength: 0.7,
      description: `Revenue growth of ${fundamentals.revenueGrowth.toFixed(2)}% YoY`
    });
  } else if (fundamentals.revenueGrowth < -5) {
    signals.push({
      name: 'Revenue Decline',
      type: 'bearish',
      strength: 0.65,
      description: `Revenue declining at ${fundamentals.revenueGrowth.toFixed(2)}% YoY`
    });
  }
  
  // Profit Margin Analysis
  if (fundamentals.profitMargin > 25) {
    signals.push({
      name: 'High Profit Margin',
      type: 'bullish',
      strength: 0.6,
      description: `Profit margin of ${fundamentals.profitMargin.toFixed(2)}% - excellent profitability`
    });
  } else if (fundamentals.profitMargin < 5 && fundamentals.profitMargin > 0) {
    signals.push({
      name: 'Low Profit Margin',
      type: 'bearish',
      strength: 0.5,
      description: `Profit margin of ${fundamentals.profitMargin.toFixed(2)}% - thin margins`
    });
  }
  
  // Dividend Yield Analysis
  if (fundamentals.dividendYield > 4) {
    signals.push({
      name: 'High Dividend Yield',
      type: 'bullish',
      strength: 0.5,
      description: `Dividend yield of ${fundamentals.dividendYield.toFixed(2)}% - attractive income`
    });
  }
  
  // Beta Analysis
  if (fundamentals.beta < 0.7) {
    signals.push({
      name: 'Low Volatility',
      type: 'neutral',
      strength: 0.3,
      description: `Beta of ${fundamentals.beta.toFixed(2)} - defensive stock, less volatile than market`
    });
  } else if (fundamentals.beta > 1.5) {
    signals.push({
      name: 'High Volatility',
      type: 'neutral',
      strength: 0.3,
      description: `Beta of ${fundamentals.beta.toFixed(2)} - aggressive stock, more volatile than market`
    });
  }
  
  return signals;
}

// Calculate fundamental score (0-100) with PEG ratio weighting
export function calculateFundamentalScore(signals: Signal[]): number {
  if (signals.length === 0) return 50;
  
  let score = 50;
  let totalWeight = 0;
  let hasBullishPEG = false;
  let hasBearishDCF = false;
  
  signals.forEach(signal => {
    const weight = signal.strength;
    totalWeight += weight;
    
    // PEG ratio signals get extra weight
    const isPEGSignal = signal.name.includes('PEG');
    const multiplier = isPEGSignal ? 1.5 : 1;
    
    if (isPEGSignal && signal.type === 'bullish') hasBullishPEG = true;
    if (signal.name.includes('DCF') && signal.type === 'bearish') hasBearishDCF = true;
    
    if (signal.type === 'bullish') {
      score += weight * 10 * multiplier;
    } else if (signal.type === 'bearish') {
      score -= weight * 10 * multiplier;
    }
  });

  // DCF divergence penalty
  // If the PEG ratio looks incredibly undervalued but the mathematically constructed DCF model implies overvaluation,
  // we compress the score towards neutrality to model accounting trap risk.
  if (hasBullishPEG && hasBearishDCF && score > 60) {
    score = score - ((score - 50) * 0.5); // 50% retracement of bullish score
  }
  
  return Math.max(0, Math.min(100, score));
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

// Format percentage
export function formatPercent(num: number): string {
  return (num >= 0 ? '+' : '') + num.toFixed(2) + '%';
}

// Get PEG ratio interpretation
export function getPEGInterpretation(peg: number): { label: string; color: string; description: string } {
  if (peg <= 0) {
    return { label: 'N/A', color: 'text-gray-400', description: 'Not applicable (negative growth or P/E)' };
  }
  if (peg < 0.5) {
    return { label: 'Very Undervalued', color: 'text-green-400', description: 'Significantly undervalued relative to growth' };
  }
  if (peg < 1) {
    return { label: 'Undervalued', color: 'text-green-400', description: 'Undervalued relative to growth - potential buy' };
  }
  if (peg < 1.5) {
    return { label: 'Fair Value', color: 'text-yellow-400', description: 'Fairly valued relative to growth' };
  }
  if (peg < 2) {
    return { label: 'Slightly Overvalued', color: 'text-orange-400', description: 'Slightly overvalued relative to growth' };
  }
  if (peg < 3) {
    return { label: 'Overvalued', color: 'text-red-400', description: 'Overvalued relative to growth - caution advised' };
  }
  return { label: 'Very Overvalued', color: 'text-red-500', description: 'Significantly overvalued - high risk' };
}
