import { describe, it, expect } from 'vitest';
import { analyzeElliottWave } from '../elliottWave';
import { HistoricalData } from '@/types/stock';

// Helper to create mock data
const createMockData = (prices: number[]): HistoricalData[] => {
  return prices.map((price, i) => ({
    date: `2023-01-${String(i + 1).padStart(2, '0')}`,
    open: price,
    high: price * 1.01,
    low: price * 0.99,
    close: price,
    volume: 1000,
    adjClose: price,
    symbol: 'MOCK'
  }));
};

describe('Elliott Wave Analysis', () => {
  it('should return default state for insufficient data', () => {
    const data = createMockData([10, 11, 12]);
    const result = analyzeElliottWave(data);
    expect(result.waveDescription).toContain('Insufficient data');
    expect(result.confidence).toBe(0);
  });

  it('should detect a basic uptrend impulse', () => {
    // Simulate a basic 5-wave set up
    // Wave 1: 100 -> 110
    // Wave 2: 110 -> 105
    // Wave 3: 105 -> 120
    // Wave 4: 120 -> 115
    // Wave 5: 115 -> 125
    const prices = [
      100, 105, 110, // Wave 1 up
      108, 105,      // Wave 2 down
      110, 115, 120, // Wave 3 up
      118, 115,      // Wave 4 down
      120, 125       // Wave 5 up
    ];
    
    // We need enough data points for the zigzag algo to work
    // Interpolating points to make the array longer (~20 points)
    const expandedPrices: number[] = [];
    prices.forEach(p => {
        expandedPrices.push(p);
        expandedPrices.push(p); 
    });

    const data = createMockData(expandedPrices);
    const result = analyzeElliottWave(data);
    
    expect(result.currentWave).toBeDefined();
    expect(result.trendDirection).toBe('up');
    expect(result.confidence).toBeGreaterThan(0);
  });
});
