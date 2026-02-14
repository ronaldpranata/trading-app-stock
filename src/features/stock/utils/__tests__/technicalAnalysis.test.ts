import { describe, it, expect } from 'vitest';
import { calculateSMA, calculateEMA, calculateRSI } from '../technicalAnalysis';

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
});
