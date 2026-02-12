"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalysisResult } from '@/types/stock';

// Types
export interface StockState {
  primarySymbol: string | null;
  comparisonSymbols: string[];
  analysisResults: Record<string, AnalysisResult>;
  isAnalyzing: boolean;
}

// Initial state
const initialState: StockState = {
  primarySymbol: 'AAPL',
  comparisonSymbols: [],
  analysisResults: {},
  isAnalyzing: false,
};

// Slice
const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setPrimarySymbol: (state, action: PayloadAction<string>) => {
      state.primarySymbol = action.payload;
    },
    addComparisonSymbol: (state, action: PayloadAction<string>) => {
      if (
        state.comparisonSymbols.length < 5 &&
        !state.comparisonSymbols.includes(action.payload) &&
        action.payload !== state.primarySymbol
      ) {
        state.comparisonSymbols.push(action.payload);
      }
    },
    removeComparisonSymbol: (state, action: PayloadAction<string>) => {
      state.comparisonSymbols = state.comparisonSymbols.filter(
        (s) => s !== action.payload
      );
    },
    clearComparisons: (state) => {
      state.comparisonSymbols = [];
    },
    setAnalysisResult: (state, action: PayloadAction<AnalysisResult>) => {
      state.analysisResults[action.payload.symbol] = action.payload;
    },
    setIsAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.isAnalyzing = action.payload;
    },
    resetStock: () => initialState,
  },
});

// Export actions
export const {
  setPrimarySymbol,
  addComparisonSymbol,
  removeComparisonSymbol,
  clearComparisons,
  setAnalysisResult,
  setIsAnalyzing,
  resetStock,
} = stockSlice.actions;

// Export reducer
export const stockReducer = stockSlice.reducer;
