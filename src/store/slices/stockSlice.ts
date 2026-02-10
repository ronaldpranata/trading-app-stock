"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface StockState {
  primarySymbol: string | null;
  comparisonSymbols: string[];
}

// Initial state
const initialState: StockState = {
  primarySymbol: null,
  comparisonSymbols: [],
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
    resetStock: () => initialState,
  },
});

// Export actions
export const {
  setPrimarySymbol,
  addComparisonSymbol,
  removeComparisonSymbol,
  clearComparisons,
  resetStock,
} = stockSlice.actions;

// Export reducer
export const stockReducer = stockSlice.reducer;
