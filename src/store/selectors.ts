"use client";

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { stockApi } from './api/stockApi';
import { StockData } from '@/types/stock';

// ============================================
// Auth Selectors
// ============================================

export const selectAuthState = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated
);

export const selectIsCheckingAuth = createSelector(
  selectAuthState,
  (auth) => auth.isChecking
);

export const selectAuthError = createSelector(
  selectAuthState,
  (auth) => auth.error
);

// ============================================
// Stock Selectors
// ============================================

export const selectStockState = (state: RootState) => state.stock;

export const selectPrimarySymbol = createSelector(
  selectStockState,
  (stock) => stock.primarySymbol
);

export const selectComparisonSymbols = createSelector(
  selectStockState,
  (stock) => stock.comparisonSymbols
);

export const selectCompareStockCount = createSelector(
  selectComparisonSymbols,
  (symbols) => symbols.length
);

export const selectCanAddMoreComparisons = createSelector(
  selectCompareStockCount,
  (count) => count < 5
);

export const selectAnalysisResults = createSelector(
  selectStockState,
  (stock) => stock.analysisResults
);

export const selectIsAnalyzing = createSelector(
  selectStockState,
  (stock) => stock.isAnalyzing
);

// ============================================
// UI Selectors
// ============================================

export const selectUIState = (state: RootState) => state.ui;

export const selectViewMode = createSelector(
  selectUIState,
  (ui) => ui.viewMode
);

export const selectActiveTab = createSelector(
  selectUIState,
  (ui) => ui.activeTab
);

export const selectAutoRefreshEnabled = createSelector(
  selectUIState,
  (ui) => ui.autoRefreshEnabled
);

export const selectLastRefresh = createSelector(
  selectUIState,
  (ui) => (ui.lastRefresh ? new Date(ui.lastRefresh) : null)
);

export const selectLastRefreshFormatted = createSelector(
  selectLastRefresh,
  (lastRefresh) => (lastRefresh ? lastRefresh.toLocaleTimeString() : null)
);

// ============================================
// Combined Selectors
// ============================================

export const selectIsCompareMode = createSelector(
  selectViewMode,
  (viewMode) => viewMode === 'compare'
);



// Helper to select API state
const selectStockApiState = (state: RootState) => state[stockApi.reducerPath];

export const selectComparisonData = createSelector(
  [selectComparisonSymbols, selectStockApiState],
  (symbols, apiState) => {
    return symbols.map(sym => {
      const cacheKey = `getStockData("${sym}")`;
      const queryResult = apiState.queries[cacheKey];
      
      return {
        symbol: sym,
        data: (queryResult?.data as StockData | undefined) ?? null,
        isLoading: queryResult?.status === 'pending',
        error: queryResult?.error ?? null,
        isSuccess: queryResult?.status === 'fulfilled',
        isUninitialized: queryResult?.status === 'uninitialized',
      };
    });
  }
);
