"use client";

import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPrimarySymbol,
  addComparisonSymbol,
  removeComparisonSymbol,
} from '@/features/stock/stockSlice';
import {
  selectPrimarySymbol,
  selectComparisonSymbols,
  selectCanAddMoreComparisons,
  selectComparisonData,
  selectAnalysisResults,
  selectIsAnalyzing,
  selectIsAuthenticated
} from '@/store/selectors';
import { useGetStockDataQuery, stockApi } from '@/features/stock/stockApi';
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
  const analysisResults = useAppSelector(selectAnalysisResults);
  
  // Auth check
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // 1. RTK Query for Primary Stock
  const { 
    data: primaryStock, 
    isLoading: isPrimaryLoading, 
    error: primaryError,
    refetch: refetchPrimary
  } = useGetStockDataQuery(symbol || '', { 
    skip: !symbol || !isAuthenticated
  });

  // 2. Dynamic RTK Query for Comparison Stocks
  // We manually initiate queries for all comparison symbols
  useEffect(() => {
    comparisonSymbols.forEach(sym => {
      if (sym) {
        dispatch(stockApi.endpoints.getStockData.initiate(sym));
      }
    });
  }, [comparisonSymbols, dispatch]);

  // Select results from store using memoized selector
  const comparisonResults = useAppSelector(selectComparisonData);

  // 4. Merge Data for Output
  const finalPrimaryStock: StockData | null = primaryStock ? {
    ...primaryStock,
    technicalIndicators: analysisResults[symbol || '']?.technicalIndicators || primaryStock.technicalIndicators || null,
    prediction: analysisResults[symbol || '']?.prediction || primaryStock.prediction || null,
    sentimentData: analysisResults[symbol || '']?.sentimentData || primaryStock.sentimentData || undefined
  } : null;

  const compareStocks = comparisonResults.map(({ symbol: compSymbol, data, isLoading, error }) => {
    if (!data) return null;
    return {
      ...data,
      technicalIndicators: analysisResults[compSymbol]?.technicalIndicators || null,
      prediction: analysisResults[compSymbol]?.prediction || null,
      sentimentData: analysisResults[compSymbol]?.sentimentData || data.sentimentData || undefined,
      isLoading,
      error: error ? String(error) : null
    };
  }).filter(Boolean) as StockData[];

  // Aggregated Loading & Error
  const isCompLoading = comparisonResults.some(r => r.isLoading);
  const isAnalyzing = useAppSelector(selectIsAnalyzing);
  const isLoading = isPrimaryLoading || isCompLoading || isAnalyzing;
  
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
    comparisonSymbols.forEach(sym => {
      dispatch(stockApi.util.invalidateTags([{ type: 'Stock', id: sym }]));
    });
  }, [symbol, comparisonSymbols, refetchPrimary, dispatch]);

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
    primaryStock: finalPrimaryStock,
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
