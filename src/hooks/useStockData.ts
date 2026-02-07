'use client';

import { useState, useCallback, useEffect } from 'react';
import { StockQuote, HistoricalData, FundamentalData, TechnicalIndicators, PredictionResult } from '@/types/stock';
import { calculateAllIndicators } from '@/utils/technicalAnalysis';
import { generatePrediction } from '@/utils/prediction';

export interface StockData {
  symbol: string;
  quote: StockQuote | null;
  historicalData: HistoricalData[];
  fundamentalData: FundamentalData | null;
  technicalIndicators: TechnicalIndicators | null;
  prediction: PredictionResult | null;
  isLoading: boolean;
  error: string | null;
}

const initialStockData: StockData = {
  symbol: '',
  quote: null,
  historicalData: [],
  fundamentalData: null,
  technicalIndicators: null,
  prediction: null,
  isLoading: false,
  error: null
};

// Direct fetch functions that work in browser
async function fetchFromAPI(symbol: string, type: string): Promise<any> {
  const url = `/api/stock?symbol=${encodeURIComponent(symbol)}&type=${type}`;
  console.log('Fetching:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export function useStockData(initialSymbol: string = '') {
  const [stockData, setStockData] = useState<StockData>({
    ...initialStockData,
    symbol: initialSymbol,
    isLoading: false
  });

  // Fetch all stock data
  const fetchStockData = useCallback(async (symbol: string): Promise<StockData> => {
    console.log('fetchStockData called for:', symbol);
    
    try {
      // Fetch all data in parallel
      const [quoteJson, historicalJson, fundamentalJson] = await Promise.all([
        fetchFromAPI(symbol, 'quote'),
        fetchFromAPI(symbol, 'historical'),
        fetchFromAPI(symbol, 'fundamental')
      ]);

      console.log('Data fetched successfully');

      let indicators: TechnicalIndicators | null = null;
      let prediction: PredictionResult | null = null;

      if (Array.isArray(historicalJson) && historicalJson.length > 0) {
        indicators = calculateAllIndicators(historicalJson);
        if (indicators && fundamentalJson && quoteJson) {
          prediction = generatePrediction(quoteJson.price, indicators, fundamentalJson);
        }
      }

      return {
        symbol,
        quote: quoteJson,
        historicalData: historicalJson,
        fundamentalData: fundamentalJson,
        technicalIndicators: indicators,
        prediction,
        isLoading: false,
        error: null
      };
    } catch (error) {
      console.error('Error loading data for', symbol, ':', error);
      return {
        ...initialStockData,
        symbol,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data'
      };
    }
  }, []);

  // Load stock data and update state
  const loadStock = useCallback(async (symbol: string) => {
    console.log('loadStock called for:', symbol);
    setStockData(prev => ({ ...prev, symbol, isLoading: true, error: null }));
    
    const data = await fetchStockData(symbol);
    setStockData(data);
    return data;
  }, [fetchStockData]);

  // Refresh quote only
  const refreshQuote = useCallback(async () => {
    if (!stockData.symbol) return;

    try {
      const quoteJson = await fetchFromAPI(stockData.symbol, 'quote');

      setStockData(prev => {
        if (prev.technicalIndicators && prev.fundamentalData) {
          const prediction = generatePrediction(quoteJson.price, prev.technicalIndicators, prev.fundamentalData);
          return { ...prev, quote: quoteJson, prediction };
        }
        return { ...prev, quote: quoteJson };
      });
    } catch (error) {
      console.error('Error refreshing quote:', error);
    }
  }, [stockData.symbol]);

  // Reset stock data
  const reset = useCallback(() => {
    setStockData(initialStockData);
  }, []);

  return {
    stockData,
    loadStock,
    refreshQuote,
    fetchStockData,
    reset,
    isLoading: stockData.isLoading,
    error: stockData.error
  };
}

// Hook for managing multiple stocks (comparison)
export function useMultipleStocks(maxStocks: number = 3) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStockData = useCallback(async (symbol: string): Promise<StockData> => {
    try {
      const [quoteJson, historicalJson, fundamentalJson] = await Promise.all([
        fetchFromAPI(symbol, 'quote'),
        fetchFromAPI(symbol, 'historical'),
        fetchFromAPI(symbol, 'fundamental')
      ]);

      let indicators: TechnicalIndicators | null = null;
      let prediction: PredictionResult | null = null;

      if (Array.isArray(historicalJson) && historicalJson.length > 0) {
        indicators = calculateAllIndicators(historicalJson);
        if (indicators && fundamentalJson && quoteJson) {
          prediction = generatePrediction(quoteJson.price, indicators, fundamentalJson);
        }
      }

      return {
        symbol,
        quote: quoteJson,
        historicalData: historicalJson,
        fundamentalData: fundamentalJson,
        technicalIndicators: indicators,
        prediction,
        isLoading: false,
        error: null
      };
    } catch (error) {
      return {
        ...initialStockData,
        symbol,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data'
      };
    }
  }, []);

  const addStock = useCallback(async (symbol: string) => {
    if (stocks.length >= maxStocks || stocks.some(s => s.symbol === symbol)) return;

    setStocks(prev => [...prev, { ...initialStockData, symbol, isLoading: true }]);
    const data = await fetchStockData(symbol);
    setStocks(prev => prev.map(s => s.symbol === symbol ? data : s));
  }, [stocks, maxStocks, fetchStockData]);

  const removeStock = useCallback((symbol: string) => {
    setStocks(prev => prev.filter(s => s.symbol !== symbol));
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    const updatedStocks = await Promise.all(
      stocks.map(s => fetchStockData(s.symbol))
    );
    setStocks(updatedStocks);
    setIsLoading(false);
  }, [stocks, fetchStockData]);

  const clear = useCallback(() => {
    setStocks([]);
  }, []);

  return {
    stocks,
    addStock,
    removeStock,
    refreshAll,
    clear,
    isLoading,
    canAddMore: stocks.length < maxStocks
  };
}
