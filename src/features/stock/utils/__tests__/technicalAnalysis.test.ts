import { describe, it, expect } from 'vitest';
import { calculateSMA, calculateEMA, calculateRSI, calculateSupportResistance } from '../technicalAnalysis';

describe('Technical Analysis Utils', () => {
  describe('calculateSMA (Simple Moving Average)', () => {
    it('should calculate SMA correctly for a simple dataset', () => {
      const data = [10, 20, 30, 40, 50];
      const sma = calculateSMA(data, 5);
      expect(sma).toBe(30); // (10+20+30+40+50) / 5 = 30
    });

    it('should handle data shorter than period', () => {
      const data = [10, 20];
      const sma = calculateSMA(data, 5);
      expect(sma).toBe(20); // Returns last element
    });

    it('should calculate SMA for a specific period', () => {
      const data = [10, 20, 30, 40, 50];
      const sma = calculateSMA(data, 3);
      // Last 3: 30, 40, 50 -> Sum = 120 -> Avg = 40
      expect(sma).toBe(40);
    });
  });

  describe('calculateEMA (Exponential Moving Average)', () => {
    it('should calculate EMA close to SMA for initial values', () => {
        const data = [10, 10, 10, 10, 10];
        const ema = calculateEMA(data, 5);
        expect(ema).toBe(10);
    });
  });

  describe('calculateRSI (Relative Strength Index)', () => {
    it('should return 50 if not enough data', () => {
        const data = [10, 20];
        const rsi = calculateRSI(data, 14);
        expect(rsi).toBe(50); 
    });
  });

  describe('calculateSupportResistance', () => {
    it('should identify a simple resistance level', () => {
      // Fractal pattern: 20 is highest among neighbors
      const highs = [10, 10, 20, 10, 10];
      const lows = [5, 5, 5, 5, 5]; 
      const currentPrice = 18; // Closer to 20 to be within 25% range
      const levels = calculateSupportResistance(highs, lows, currentPrice, 5);
      
      expect(levels).toHaveLength(1);
      expect(levels[0].type).toBe('resistance');
      expect(levels[0].level).toBe(20);
    });

    it('should identify a simple support level', () => {
      // Fractal pattern: 10 is lowest among neighbors
      const highs = [25, 25, 25, 25, 25]; 
      const lows = [20, 20, 10, 20, 20];
      const currentPrice = 12; // Closer to 10 to be within 25% range
      const levels = calculateSupportResistance(highs, lows, currentPrice, 5);
      
      expect(levels).toHaveLength(1);
      expect(levels[0].type).toBe('support');
      expect(levels[0].level).toBe(10);
    });

    it('should handle insufficient data gracefully', () => {
      const highs = [10, 20];
      const lows = [5, 15];
      const currentPrice = 15;
      const levels = calculateSupportResistance(highs, lows, currentPrice, 5);
      expect(levels).toEqual([]);
    });
  });
});
