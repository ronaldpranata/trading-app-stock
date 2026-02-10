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
