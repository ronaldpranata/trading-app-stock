"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectPrimarySymbol,
  selectComparisonData,
  selectAnalysisResults,
  selectIsAuthenticated
} from '@/store/selectors';
import { useGetStockDataQuery } from '@/features/stock/stockApi';
import { useBatchAnalysisWorker } from '@/hooks/useBatchAnalysisWorker';
import { setIsAnalyzing } from '@/features/stock/stockSlice';

export default function StockAnalysisManager() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  // Reset analyzing state on mount (cleanup from potentially stuck previous state)
  useEffect(() => {
    dispatch(setIsAnalyzing(false));
  }, [dispatch]);
  
  const symbol = useAppSelector(selectPrimarySymbol);
  const comparisonResults = useAppSelector(selectComparisonData);
  const analysisResults = useAppSelector(selectAnalysisResults);
  
  // Pending Counter
  const pendingRef = useRef<number>(0);
  
  const handleComplete = useCallback((completedSymbol: string) => {
    pendingRef.current = Math.max(0, pendingRef.current - 1);
    if (pendingRef.current === 0) {
      dispatch(setIsAnalyzing(false));
    }
  }, [dispatch]);

  // Single worker instance with completion callback
  const { analyze } = useBatchAnalysisWorker(handleComplete);
  
  // Track last processed prices
  const workerResultsRef = useRef<Record<string, number>>({});
  
  // Using RTK Query hook to get primary stock data accessible here
  const { data: primaryStock } = useGetStockDataQuery(symbol || '', { 
    skip: !symbol || !isAuthenticated,
    refetchOnMountOrArgChange: true
  });
  
  const incrementPending = () => {
    pendingRef.current += 1;
    dispatch(setIsAnalyzing(true));
  };

  // Monitor Primary Stock for Analysis
  useEffect(() => {
    if (!primaryStock || !symbol) return;
    if (!primaryStock.historicalData || primaryStock.historicalData.length === 0) return;
    
    // Logic: If price changed OR no result yet
    const lastPrice = workerResultsRef.current[symbol];
    const currentPrice = primaryStock.quote?.price || 0;
    const hasResult = !!analysisResults[symbol];
    
    if (currentPrice !== lastPrice || !hasResult) {
      // Check if we already have a pending task for this? (Simple version: no, just fire)
      
      workerResultsRef.current[symbol] = currentPrice;
      incrementPending(); // Mark global busy
      
      analyze({
        symbol,
        historicalData: primaryStock.historicalData,
        fundamentalData: primaryStock.fundamentalData || null,
        currentPrice,
        headlines: primaryStock.sentimentData?.headlines
      });
    }
  }, [primaryStock, symbol, analyze, analysisResults]);

  // Monitor Comparison Stocks
  useEffect(() => {
    comparisonResults.forEach(({ symbol: compSymbol, data }) => {
      if (!data || !compSymbol) return;
      if (data.historicalData.length === 0) return;

      const lastPrice = workerResultsRef.current[compSymbol];
      const currentPrice = data.quote?.price || 0;
      const hasResult = !!analysisResults[compSymbol];

      if (currentPrice !== lastPrice || !hasResult) {
        workerResultsRef.current[compSymbol] = currentPrice;
        incrementPending();
        
        analyze({
          symbol: compSymbol,
          historicalData: data.historicalData,
          fundamentalData: data.fundamentalData || null,
          currentPrice,
          headlines: data.sentimentData?.headlines
        });
      }
    });
  }, [comparisonResults, analyze, analysisResults]);
  
  return null;
}
