import { describe, it, expect } from 'vitest';
import { analyzeCandlestickPatterns } from '../candlestickPatterns';
import { HistoricalData } from '@/types/stock';

const createCandle = (open: number, high: number, low: number, close: number): HistoricalData => ({
  date: '2023-01-01',
  open, high, low, close,
  volume: 1000,
  adjClose: close,
  symbol: 'MOCK'
});

describe('Candlestick Patterns', () => {
  it('should detect a Bullish Engulfing pattern', () => {
    const data = [
      // Previous context (downtrend)
      createCandle(100, 100, 90, 90),
      createCandle(90, 90, 80, 80),
      createCandle(80, 80, 70, 70),
      // Bearish candle
      createCandle(70, 70, 60, 60), 
      // Bullish Engulfing (Opens lower, closes higher than prev open)
      createCandle(58, 75, 58, 75)
    ];

    // Need enough data for the "analysisWindow"
    const paddedData = [...Array(20).fill(createCandle(100,100,100,100)), ...data];
    
    const result = analyzeCandlestickPatterns(paddedData);
    const engulfing = result.patterns.find(p => p.type === 'bullish_engulfing');
    
    expect(engulfing).toBeDefined();
    expect(engulfing?.direction).toBe('bullish');
  });

  it('should detect a Doji', () => {
    const data = [
      createCandle(100, 105, 95, 100.1) // Open ~= Close, High/Low exist
    ];
     const paddedData = [...Array(20).fill(createCandle(100,100,100,100)), ...data];

     const result = analyzeCandlestickPatterns(paddedData);
     const doji = result.patterns.find(p => p.type.includes('doji'));
     
     expect(doji).toBeDefined();
  });
});
