import { describe, it, expect } from 'vitest';
import { formatNumber, formatCompactNumber, formatPrice } from '../formatters';

describe('Formatters', () => {
  describe('formatNumber', () => {
    it('should format billions with B', () => {
      expect(formatNumber(1_500_000_000)).toBe('1.50B');
    });
    it('should format millions with M', () => {
      expect(formatNumber(1_500_000)).toBe('1.50M');
    });
    it('should format thousands with K', () => {
      expect(formatNumber(1_500)).toBe('1.50K');
    });
    it('should format small numbers normally', () => {
      expect(formatNumber(123.456)).toBe('123.46');
    });
  });

  describe('formatPrice', () => {
    it('should format standard prices with 2 decimals', () => {
      expect(formatPrice(123.456)).toBe('123.46');
    });
    it('should format small crypto prices with 4 decimals', () => {
        expect(formatPrice(0.054321)).toBe('0.0543');
    });
    it('should format very small prices with 8 decimals', () => {
        expect(formatPrice(0.00001234)).toBe('0.00001234');
    });
  });
});
