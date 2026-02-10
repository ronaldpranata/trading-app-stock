"use client";

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPrimarySymbol,
  addComparisonSymbol,
  removeComparisonSymbol,
} from '@/store/slices/stockSlice';
import {
  selectPrimarySymbol,
  selectComparisonSymbols,
  selectCanAddMoreComparisons
} from '@/store/selectors';
import { useGetStockDataQuery, useGetQuoteQuery } from '@/store/api/stockApi';
import { StockData } from '@/types/stock';

/**
 * Custom hook for stock-related operations
 * Provides a clean interface for components to interact with stock state
 */
export function useStock() {
  const dispatch = useAppDispatch();
  
  // Selectors for symbols
  const symbol = useAppSelector(selectPrimarySymbol);
  const comparisonSymbols = useAppSelector(selectComparisonSymbols);
  const canAddMoreComparisons = useAppSelector(selectCanAddMoreComparisons);

  // RTK Query for Primary Stock
  const { 
    data: primaryStock, 
    isLoading: isPrimaryLoading, 
    error: primaryError,
    refetch: refetchPrimary
  } = useGetStockDataQuery(symbol || '', { 
    skip: !symbol 
  });

  // RTK Query for Comparison Stocks
  // We handle up to 2 comparisons
  const comp1 = comparisonSymbols[0];
  const comp2 = comparisonSymbols[1];

  const {
    data: comp1Data,
    isLoading: isComp1Loading,
    error: comp1Error,
  } = useGetStockDataQuery(comp1 || '', { skip: !comp1 });

  const {
    data: comp2Data,
    isLoading: isComp2Loading,
    error: comp2Error,
  } = useGetStockDataQuery(comp2 || '', { skip: !comp2 });

  const compareStocks = [comp1Data, comp2Data].filter(Boolean) as StockData[];

  // Aggregated Loading & Error
  const isLoading = isPrimaryLoading || isComp1Loading || isComp2Loading;
  
  // For error, we return the primary error string if present
  let error: string | null = null;
  if (primaryError) {
      if ('status' in primaryError) error = `Error ${primaryError.status}`;
      else error = primaryError.message || 'An error occurred';
  }

  // Derived Values
  const currentPrice = primaryStock?.quote?.price || 0;
  const priceChange = {
    change: primaryStock?.quote?.change || 0,
    changePercent: primaryStock?.quote?.changePercent || 0,
    isPositive: (primaryStock?.quote?.change || 0) >= 0,
  };

  // Actions
  const load = useCallback(
    (stockSymbol: string) => {
      dispatch(setPrimarySymbol(stockSymbol));
    },
    [dispatch]
  );

  const refresh = useCallback(() => {
    if (symbol) {
      refetchPrimary();
    }
  }, [symbol, refetchPrimary]);

  const addComparison = useCallback(
    (stockSymbol: string) => {
      if (canAddMoreComparisons && stockSymbol !== symbol) {
        dispatch(addComparisonSymbol(stockSymbol));
      }
    },
    [dispatch, canAddMoreComparisons, symbol]
  );

  const removeCompare = useCallback(
    (stockSymbol: string) => {
      dispatch(removeComparisonSymbol(stockSymbol));
    },
    [dispatch]
  );

  return {
    // State
    primaryStock: primaryStock || null,
    compareStocks,
    isLoading,
    error,
    symbol,
    currentPrice,
    priceChange,
    canAddMoreComparisons,
    
    // Actions
    load,
    refresh,
    addComparison,
    removeCompare,
  };
}
