"use client";

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

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

export const selectPrimaryStock = createSelector(
  selectStockState,
  (stock) => stock.primary
);

export const selectCompareStocks = createSelector(
  selectStockState,
  (stock) => stock.comparisons
);

export const selectStockLoading = createSelector(
  selectStockState,
  (stock) => stock.loading
);

export const selectStockError = createSelector(
  selectStockState,
  (stock) => stock.error
);

// Derived selectors
export const selectPrimarySymbol = createSelector(
  selectPrimaryStock,
  (stock) => stock?.symbol || ''
);

export const selectPrimaryQuote = createSelector(
  selectPrimaryStock,
  (stock) => stock?.quote || null
);

export const selectPrimaryHistoricalData = createSelector(
  selectPrimaryStock,
  (stock) => stock?.historicalData || []
);

export const selectPrimaryFundamentalData = createSelector(
  selectPrimaryStock,
  (stock) => stock?.fundamentalData || null
);

export const selectPrimaryTechnicalIndicators = createSelector(
  selectPrimaryStock,
  (stock) => stock?.technicalIndicators || null
);

export const selectPrimaryPrediction = createSelector(
  selectPrimaryStock,
  (stock) => stock?.prediction || null
);

export const selectAllStocks = createSelector(
  selectPrimaryStock,
  selectCompareStocks,
  (primary, comparisons) => {
    if (!primary) return comparisons;
    return [primary, ...comparisons];
  }
);

export const selectCompareStockCount = createSelector(
  selectCompareStocks,
  (comparisons) => comparisons.length
);

export const selectCanAddMoreComparisons = createSelector(
  selectCompareStockCount,
  (count) => count < 2
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

export const selectPredictionDirection = createSelector(
  selectPrimaryPrediction,
  (prediction) => prediction?.direction || 'NEUTRAL'
);

export const selectPredictionConfidence = createSelector(
  selectPrimaryPrediction,
  (prediction) => prediction?.confidence || 0
);

export const selectCurrentPrice = createSelector(
  selectPrimaryQuote,
  (quote) => quote?.price || 0
);

export const selectPriceChange = createSelector(
  selectPrimaryQuote,
  (quote) => ({
    change: quote?.change || 0,
    changePercent: quote?.changePercent || 0,
    isPositive: (quote?.change || 0) >= 0,
  })
);
