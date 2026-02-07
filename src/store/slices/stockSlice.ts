"use client";

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { 
  StockData, 
  StockQuote, 
  HistoricalData, 
  FundamentalData, 
  TechnicalIndicators, 
  PredictionResult 
} from '@/types/stock';
import { calculateAllIndicators } from '@/utils/technicalAnalysis';
import { generatePrediction } from '@/utils/prediction';

// Types
export interface StockState {
  primary: StockData | null;
  comparisons: StockData[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: StockState = {
  primary: null,
  comparisons: [],
  loading: false,
  error: null,
};

// API helper
const fetchFromAPI = async (symbol: string, type: string): Promise<any> => {
  const url = `/api/stock?symbol=${encodeURIComponent(symbol)}&type=${type}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Helper to create stock data from API responses
const createStockData = (
  symbol: string,
  quote: StockQuote,
  historical: HistoricalData[],
  fundamental: FundamentalData
): StockData => {
  let indicators: TechnicalIndicators | null = null;
  let prediction: PredictionResult | null = null;

  if (Array.isArray(historical) && historical.length > 0) {
    indicators = calculateAllIndicators(historical);
    if (indicators && fundamental && quote) {
      prediction = generatePrediction(quote.price, indicators, fundamental);
    }
  }

  return {
    symbol,
    quote,
    historicalData: historical,
    fundamentalData: fundamental,
    technicalIndicators: indicators,
    prediction,
    isLoading: false,
    error: null,
  };
};

// Async thunks
export const loadStock = createAsyncThunk(
  'stock/loadStock',
  async (symbol: string, { rejectWithValue }) => {
    try {
      const [quote, historical, fundamental] = await Promise.all([
        fetchFromAPI(symbol, 'quote'),
        fetchFromAPI(symbol, 'historical'),
        fetchFromAPI(symbol, 'fundamental'),
      ]);

      return createStockData(symbol, quote, historical, fundamental);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load stock'
      );
    }
  }
);

export const refreshQuote = createAsyncThunk(
  'stock/refreshQuote',
  async (symbol: string, { getState, rejectWithValue }) => {
    try {
      const quote = await fetchFromAPI(symbol, 'quote');
      const state = getState() as { stock: StockState };
      const currentStock = state.stock.primary;

      if (!currentStock) {
        return rejectWithValue('No primary stock to refresh');
      }

      let newPrediction = currentStock.prediction;
      if (currentStock.technicalIndicators && currentStock.fundamentalData) {
        newPrediction = generatePrediction(
          quote.price,
          currentStock.technicalIndicators,
          currentStock.fundamentalData
        );
      }

      return {
        ...currentStock,
        quote,
        prediction: newPrediction,
      };
    } catch (error) {
      return rejectWithValue('Failed to refresh quote');
    }
  }
);

export const addCompareStock = createAsyncThunk(
  'stock/addCompare',
  async (symbol: string, { getState, rejectWithValue }) => {
    const state = getState() as { stock: StockState };
    
    // Check if already comparing this stock
    if (state.stock.comparisons.some((s) => s.symbol === symbol)) {
      return rejectWithValue('Stock already in comparison');
    }
    
    // Check max comparisons
    if (state.stock.comparisons.length >= 2) {
      return rejectWithValue('Maximum 2 comparison stocks allowed');
    }

    try {
      const [quote, historical, fundamental] = await Promise.all([
        fetchFromAPI(symbol, 'quote'),
        fetchFromAPI(symbol, 'historical'),
        fetchFromAPI(symbol, 'fundamental'),
      ]);

      return createStockData(symbol, quote, historical, fundamental);
    } catch (error) {
      return rejectWithValue('Failed to add comparison stock');
    }
  }
);

// Slice
const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setPrimaryStock: (state, action: PayloadAction<StockData>) => {
      state.primary = action.payload;
      state.loading = false;
      state.error = null;
    },
    addComparison: (state, action: PayloadAction<StockData>) => {
      if (
        state.comparisons.length < 2 &&
        !state.comparisons.some((s) => s.symbol === action.payload.symbol)
      ) {
        state.comparisons.push(action.payload);
      }
    },
    removeComparison: (state, action: PayloadAction<string>) => {
      state.comparisons = state.comparisons.filter(
        (s) => s.symbol !== action.payload
      );
    },
    clearComparisons: (state) => {
      state.comparisons = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStock: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Load stock
      .addCase(loadStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadStock.fulfilled, (state, action) => {
        state.primary = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Refresh quote
      .addCase(refreshQuote.pending, (state) => {
        // Don't set loading for refresh to avoid UI flicker
      })
      .addCase(refreshQuote.fulfilled, (state, action) => {
        state.primary = action.payload;
      })
      .addCase(refreshQuote.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Add compare stock
      .addCase(addCompareStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCompareStock.fulfilled, (state, action) => {
        state.comparisons.push(action.payload);
        state.loading = false;
      })
      .addCase(addCompareStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setPrimaryStock,
  addComparison,
  removeComparison,
  clearComparisons,
  setLoading,
  setError,
  clearError,
  resetStock,
} = stockSlice.actions;

// Export reducer
export const stockReducer = stockSlice.reducer;
