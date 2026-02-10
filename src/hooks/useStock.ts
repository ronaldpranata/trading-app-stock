"use client";

import { useCallback, useEffect, useRef } from 'react';
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
import { useGetStockDataQuery, stockApi } from '@/store/api/stockApi';
import { StockData } from '@/types/stock';
import { useBatchAnalysisWorker } from './useBatchAnalysisWorker';

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

  // 1. RTK Query for Primary Stock
  const { 
    data: primaryStock, 
    isLoading: isPrimaryLoading, 
    error: primaryError,
    refetch: refetchPrimary
  } = useGetStockDataQuery(symbol || '', { 
    skip: !symbol 
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

  // Select results from store
  const selectComparisonData = useCallback((state: any) => 
    comparisonSymbols.map(sym => ({
      symbol: sym,
      ...stockApi.endpoints.getStockData.select(sym)(state)
    })), [comparisonSymbols]);

  const comparisonResults = useAppSelector(selectComparisonData);

  // 3. Batch Worker Analysis
  // Single worker instance handles all predictions
  const { analyze, results: workerResults, processingStatus } = useBatchAnalysisWorker();
  const workerResultsRef = useRef<Record<string, number>>({}); // Track last processed price to avoid loops

  // Trigger analysis for Primary Stock
  useEffect(() => {
    if (!primaryStock || !symbol) return;
    
    // Safety check for historicalData
    if (!primaryStock.historicalData || primaryStock.historicalData.length === 0) return;
    
    // Only analyze if price changed or we haven't analyzed yet
    const lastPrice = workerResultsRef.current[symbol];
    const currentPrice = primaryStock.quote?.price || 0;
    const hasResult = !!workerResults[symbol];

    if (currentPrice !== lastPrice || !hasResult) {
      workerResultsRef.current[symbol] = currentPrice;
      analyze({
        symbol,
        historicalData: primaryStock.historicalData,
        fundamentalData: primaryStock.fundamentalData || null,
        currentPrice,
        headlines: primaryStock.sentimentData?.headlines
      });
    }
  }, [primaryStock, symbol, analyze, workerResults]);

  // Trigger analysis for Comparison Stocks
  useEffect(() => {
    comparisonResults.forEach(({ symbol: compSymbol, data }) => {
      if (!data || !compSymbol) return;

      const lastPrice = workerResultsRef.current[compSymbol];
      const currentPrice = data.quote?.price || 0;
      const hasResult = !!workerResults[compSymbol];

      if ((currentPrice !== lastPrice || !hasResult) && data.historicalData.length > 0) {
        workerResultsRef.current[compSymbol] = currentPrice;
        analyze({
          symbol: compSymbol,
          historicalData: data.historicalData,
          fundamentalData: data.fundamentalData || null,
          currentPrice,
          headlines: data.sentimentData?.headlines
        });
      }
    });
  }, [comparisonResults, analyze, workerResults]);

  // 4. Merge Data for Output
  const finalPrimaryStock: StockData | null = primaryStock ? {
    ...primaryStock,
    technicalIndicators: workerResults[symbol || '']?.technicalIndicators || primaryStock.technicalIndicators || null,
    prediction: workerResults[symbol || '']?.prediction || primaryStock.prediction || null,
    sentimentData: workerResults[symbol || '']?.sentimentData || primaryStock.sentimentData || undefined
  } : null;

  const compareStocks = comparisonResults.map(({ symbol: compSymbol, data, isLoading, error }) => {
    if (!data) return null;
    return {
      ...data,
      technicalIndicators: workerResults[compSymbol]?.technicalIndicators || null,
      prediction: workerResults[compSymbol]?.prediction || null,
      sentimentData: workerResults[compSymbol]?.sentimentData || data.sentimentData || undefined,
      isLoading,
      error: error ? String(error) : null
    };
  }).filter(Boolean) as StockData[];

  // Aggregated Loading & Error
  const isCompLoading = comparisonResults.some(r => r.isLoading);
  const isAnalyzing = Object.values(processingStatus).some(status => status);
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
