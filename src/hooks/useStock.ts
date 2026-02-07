"use client";

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadStock,
  refreshQuote,
  addCompareStock,
  removeComparison,
  selectPrimaryStock,
  selectCompareStocks,
  selectStockLoading,
  selectStockError,
  selectPrimarySymbol,
  selectCurrentPrice,
  selectPriceChange,
  selectCanAddMoreComparisons,
} from '@/store';

/**
 * Custom hook for stock-related operations
 * Provides a clean interface for components to interact with stock state
 */
export function useStock() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const primaryStock = useAppSelector(selectPrimaryStock);
  const compareStocks = useAppSelector(selectCompareStocks);
  const isLoading = useAppSelector(selectStockLoading);
  const error = useAppSelector(selectStockError);
  const symbol = useAppSelector(selectPrimarySymbol);
  const currentPrice = useAppSelector(selectCurrentPrice);
  const priceChange = useAppSelector(selectPriceChange);
  const canAddMoreComparisons = useAppSelector(selectCanAddMoreComparisons);

  // Actions
  const load = useCallback(
    (stockSymbol: string) => {
      dispatch(loadStock(stockSymbol));
    },
    [dispatch]
  );

  const refresh = useCallback(() => {
    if (symbol) {
      dispatch(refreshQuote(symbol));
    }
  }, [dispatch, symbol]);

  const addComparison = useCallback(
    (stockSymbol: string) => {
      if (canAddMoreComparisons && stockSymbol !== symbol) {
        dispatch(addCompareStock(stockSymbol));
      }
    },
    [dispatch, canAddMoreComparisons, symbol]
  );

  const removeCompare = useCallback(
    (stockSymbol: string) => {
      dispatch(removeComparison(stockSymbol));
    },
    [dispatch]
  );

  return {
    // State
    primaryStock,
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
