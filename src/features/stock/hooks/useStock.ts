"use client";

import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPrimarySymbol,
  addComparisonSymbol,
  removeComparisonSymbol,
} from '../store/stockSlice';
import {
  selectPrimarySymbol,
  selectComparisonSymbols,
  selectCanAddMoreComparisons,
  selectComparisonData,
  selectAnalysisResults,
  selectIsAnalyzing,
  selectIsAuthenticated
} from '@/store/selectors';
import { useGetStockDataQuery, stockApi } from '../services/stockApi';
import { StockData } from '../types';

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

  // 4. Merge Data for Output - Memoized to prevent re-renders
  const finalPrimaryStock: StockData | null = useMemo(() => {
    if (!primaryStock) return null;
    return {
      ...primaryStock,
      technicalIndicators: analysisResults[symbol || '']?.technicalIndicators || primaryStock.technicalIndicators || null,
      prediction: analysisResults[symbol || '']?.prediction || primaryStock.prediction || null,
      sentimentData: analysisResults[symbol || '']?.sentimentData || primaryStock.sentimentData || undefined
    };
  }, [primaryStock, analysisResults, symbol]);

  const compareStocks = useMemo(() => {
    return comparisonResults.map(({ symbol: compSymbol, data, isLoading, error }) => {
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
  }, [comparisonResults, analysisResults]);

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

  // Derived Values - Memoized
  const currentPrice = finalPrimaryStock?.quote?.price || 0;
  
  const priceChange = useMemo(() => ({
    change: finalPrimaryStock?.quote?.change || 0,
    changePercent: finalPrimaryStock?.quote?.changePercent || 0,
    isPositive: (finalPrimaryStock?.quote?.change || 0) >= 0,
  }), [finalPrimaryStock]);

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
