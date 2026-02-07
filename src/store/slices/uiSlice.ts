"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export type ViewMode = 'single' | 'compare';
export type ActiveTab = 'overview' | 'technical' | 'fundamental' | 'prediction';

export interface UIState {
  viewMode: ViewMode;
  activeTab: ActiveTab;
  autoRefreshEnabled: boolean;
  lastRefresh: string | null; // ISO string for serialization
}

// Initial state
const initialState: UIState = {
  viewMode: 'single',
  activeTab: 'overview',
  autoRefreshEnabled: false,
  lastRefresh: null,
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload;
    },
    setAutoRefreshEnabled: (state, action: PayloadAction<boolean>) => {
      state.autoRefreshEnabled = action.payload;
    },
    toggleAutoRefresh: (state) => {
      state.autoRefreshEnabled = !state.autoRefreshEnabled;
    },
    setLastRefresh: (state, action: PayloadAction<string | null>) => {
      state.lastRefresh = action.payload;
    },
    updateLastRefresh: (state) => {
      state.lastRefresh = new Date().toISOString();
    },
    resetUI: () => initialState,
  },
});

// Export actions
export const {
  setViewMode,
  setActiveTab,
  setAutoRefreshEnabled,
  toggleAutoRefresh,
  setLastRefresh,
  updateLastRefresh,
  resetUI,
} = uiSlice.actions;

// Export reducer
export const uiReducer = uiSlice.reducer;
