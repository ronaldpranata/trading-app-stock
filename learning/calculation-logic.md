# Calculation Logic Documentation

This document explicitly details the mathematical formulas and logic used in the Stock Predictor AI application. All calculations are performed client-side or in web workers to ensure real-time performance.

## 1. Technical Indicators (`src/utils/technicalAnalysis.ts`)

The application calculates a suite of technical indicators to assess market trends.

### Moving Averages
- **SMA (Simple Moving Average)**: Arithmetic mean of closing prices over a specific period (20, 50, 200).
- **EMA (Exponential Moving Average)**: Weighted average giving more importance to recent price data.
  - *Formula*: `EMA = (Close - PreviousEMA) * (2 / (Period + 1)) + PreviousEMA`

### Trending & Momentum
- **RSI (Relative Strength Index)**: Measures the speed and change of price movements.
  - *Range*: 0-100.
  - *Logic*: RSI > 70 = Overbought, RSI < 30 = Oversold.
- **MACD (Moving Average Convergence Divergence)**:
  - `MACD Line` = EMA(12) - EMA(26)
  - `Signal Line` = EMA(9) of MACD Line
  - `Histogram` = MACD Line - Signal Line
- **Stochastic Oscillator**: Compares a closing price to a price range over a period (14 days).
  - *Signal*: K% crossing below 20 (Bullish), K% crossing above 80 (Bearish).

### Volatility
- **Bollinger Bands**:
  - `Middle Band` = SMA(20)
  - `Upper Band` = SMA(20) + (Standard Deviation * 2)
  - `Lower Band` = SMA(20) - (Standard Deviation * 2)
- **ATR (Average True Range)**: Measures market volatility by decomposing the entire range of an asset price for that period.

## 2. Fundamental Analysis (`src/utils/fundamentalAnalysis.ts`)

Fundamental scores are derived from key financial metrics.

### PEG Ratio (Price/Earnings-to-Growth)
*The most heavily weighted metric in our fundamental score.*
- **Formula**: `(P/E Ratio) / Annual EPS Growth`
- **Interpretation**:
  - `< 0.5`: Significantly Undervalued (Strong Buy)
  - `< 1.0`: Undervalued (Buy)
  - `1.0 - 1.5`: Fair Value
  - `> 2.0`: Overvalued

### Other Key Metrics
- **ROE (Return on Equity)**: > 15% is considered good capital efficiency.
- **Profit Margin**: > 25% is treated as a high-quality business signal.
- **Debt-to-Equity**: > 2.0 triggers a high-risk warning.

## 3. Signal Generation Logic

The app aggregates individual indicators into "Signals" with assigned strengths (0.0 to 1.0) and types (Bullish/Bearish).

**Example Signal Generation:**
```typescript
if (indicators.rsi < 30) {
  signals.push({
    name: 'RSI Oversold',
    type: 'bullish',
    strength: (30 - rsi) / 30, // Stronger signal as RSI gets lower
  });
}
```

## 4. Prediction Engine (`src/utils/prediction.ts`)

The final prediction score (0-100) is a weighted composite of:
1.  **Technical Score**: Derived from the aggregate strength of technical signals.
2.  **Fundamental Score**: Derived from valuation metrics (PEG, P/E).
3.  **Sentiment Score**: Analysis of news headlines (if available).

*Note: The exact weighting algorithm adjusts dynamically based on the volatility of the asset.*
