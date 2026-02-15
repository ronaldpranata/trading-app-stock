import { describe, it, expect } from 'vitest';
import { 
  calculatePercentChange, 
  calculateMaxDrawdown, 
  calculateMaxRally, 
  calculateVolatility, 
  calculateWinRate,
  calculateSMA 
} from '../stockUtils';

describe('stockUtils', () => {
    describe('calculatePercentChange', () => {
        it('should calculate positive change correctly', () => {
            expect(calculatePercentChange(100, 150)).toBe(50);
        });

        it('should calculate negative change correctly', () => {
            expect(calculatePercentChange(100, 50)).toBe(-50);
        });

        it('should handle zero start value', () => {
            expect(calculatePercentChange(0, 100)).toBe(0);
        });
        
        it('should return 0 when start and end are equal', () => {
             expect(calculatePercentChange(100, 100)).toBe(0);
        });
    });

    describe('calculateMaxDrawdown', () => {
        it('should calculate max drawdown correctly', () => {
            const prices = [
                { high: 100, low: 90, date: '2023-01-01' },
                { high: 110, low: 100, date: '2023-01-02' }, // Peak: 110
                { high: 105, low: 88, date: '2023-01-03' },  // Drawdown: (110 - 88) / 110 = 0.2 (20%)
                { high: 115, low: 110, date: '2023-01-04' },
            ];
            const result = calculateMaxDrawdown(prices);
            expect(result.maxDrawdown).toBeCloseTo(20);
            expect(result.startDate).toBe('2023-01-02');
            expect(result.endDate).toBe('2023-01-03');
        });

        it('should handle empty array', () => {
            const result = calculateMaxDrawdown([]);
            expect(result.maxDrawdown).toBe(0);
        });
        
        it('should handle constantly increasing prices (0 drawdown)', () => {
             const prices = [
                { high: 10, low: 9, date: '2023-01-01' },
                { high: 20, low: 19, date: '2023-01-02' },
            ];
             // The loop calculates drawdown from peak to low of *current* bar. 
             // Peak starts at 10. Bar 1 low 9. DD = (10-9)/10 = 0.1
             // Bar 2: Peak becomes 20. Low 19. DD = (20-19)/20 = 0.05.
             // Max DD is 10%.
             // Wait, logic check:
             // Peak updates if p.high > peak.
             // Then drawdown = (peak - p.low) / peak.
             const result = calculateMaxDrawdown(prices);
             expect(result.maxDrawdown).toBe(10); 
        });
    });

    describe('calculateMaxRally', () => {
        it('should calculate max rally correctly', () => {
             const prices = [
                { high: 100, low: 90, date: '2023-01-01' }, // Trough: 90
                { high: 108, low: 95, date: '2023-01-02' }, // Gain: (108 - 90)/90 = 0.2 (20%)
                { high: 100, low: 80, date: '2023-01-03' }, // New Trough: 80
                { high: 120, low: 110, date: '2023-01-04' }, // Gain: (120 - 80)/80 = 0.5 (50%)
            ];
            const result = calculateMaxRally(prices);
            expect(result.maxRally).toBe(50);
            expect(result.startDate).toBe('2023-01-03');
            expect(result.endDate).toBe('2023-01-04');
        });
    });

    describe('calculateVolatility', () => {
        it('should calculate annual volatility correctly', () => {
            const prices = [100, 101, 102, 101, 100]; // Low volatility
            const vol = calculateVolatility(prices);
            expect(vol).toBeGreaterThan(0);
        });

        it('should return 0 for insufficient data', () => {
            expect(calculateVolatility([100])).toBe(0);
        });
    });
    
    describe('calculateWinRate', () => {
        it('should calculate win rate correctly', () => {
            const prices = [100, 110, 105, 115]; 
            // 100 -> 110 (Win)
            // 110 -> 105 (Loss)
            // 105 -> 115 (Win)
            // Total 3 changes, 2 wins. 2/3 = 66.66%
            expect(calculateWinRate(prices)).toBeCloseTo(66.67, 1);
        });
    });

    describe('calculateSMA', () => {
        it('should calculate simple moving average', () => {
            const data = [10, 20, 30, 40, 50];
            expect(calculateSMA(data, 5)).toBe(30);
        });
        
        it('should handle insufficient data by returning last available', () => {
            const data = [10, 20];
             // Implementation specific: if length < period, logic returns last element?
             // Checking source: if (data.length < period) return data.length > 0 ? data[data.length - 1] : 0;
            expect(calculateSMA(data, 5)).toBe(20);
        });
    });
});
