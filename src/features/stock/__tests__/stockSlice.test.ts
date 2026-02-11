import { describe, it, expect } from 'vitest';
import { stockReducer, setPrimarySymbol, addComparisonSymbol, removeComparisonSymbol, clearComparisons, resetStock } from '../stockSlice';

describe('stockSlice', () => {
  const initialState = {
    primarySymbol: null,
    comparisonSymbols: [],
  };

  it('should handle initial state', () => {
    expect(stockReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setPrimarySymbol', () => {
    const actual = stockReducer(initialState, setPrimarySymbol('AAPL'));
    expect(actual.primarySymbol).toEqual('AAPL');
  });

  it('should handle addComparisonSymbol', () => {
    const actual = stockReducer(initialState, addComparisonSymbol('GOOGL'));
    expect(actual.comparisonSymbols).toContain('GOOGL');
  });

  it('should adhere to max 5 comparisons', () => {
    let state = stockReducer(initialState, addComparisonSymbol('GOOGL'));
    state = stockReducer(state, addComparisonSymbol('MSFT'));
    state = stockReducer(state, addComparisonSymbol('AMZN'));
    state = stockReducer(state, addComparisonSymbol('TSLA'));
    state = stockReducer(state, addComparisonSymbol('NFLX'));
    state = stockReducer(state, addComparisonSymbol('NVDA')); // Should be ignored

    expect(state.comparisonSymbols.length).toBe(5);
    expect(state.comparisonSymbols).toEqual(['GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NFLX']);
  });

  it('should not add duplicate comparison symbols', () => {
    let state = stockReducer(initialState, addComparisonSymbol('GOOGL'));
    state = stockReducer(state, addComparisonSymbol('GOOGL')); // Should be ignored

    expect(state.comparisonSymbols.length).toBe(1);
  });

  it('should handle removeComparisonSymbol', () => {
    const startState = {
      primarySymbol: 'AAPL',
      comparisonSymbols: ['GOOGL', 'MSFT'],
    };
    const actual = stockReducer(startState, removeComparisonSymbol('GOOGL'));
    expect(actual.comparisonSymbols).toEqual(['MSFT']);
  });

  it('should handle clearComparisons', () => {
    const startState = {
      primarySymbol: 'AAPL',
      comparisonSymbols: ['GOOGL', 'MSFT'],
    };
    const actual = stockReducer(startState, clearComparisons());
    expect(actual.comparisonSymbols).toEqual([]);
  });
  
  it('should handle resetStock', () => {
    const startState = {
        primarySymbol: 'AAPL',
        comparisonSymbols: ['GOOGL', 'MSFT'],
      };
      const actual = stockReducer(startState, resetStock());
    expect(actual).toEqual(initialState);
  });
});
