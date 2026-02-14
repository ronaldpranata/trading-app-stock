"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export type ViewMode = 'single' | 'compare';
export type ActiveTab = 'overview' | 'technical' | 'fundamental' | 'prediction';

export interface UIState {
  viewMode: ViewMode;
  activeTab: ActiveTab;
  lastRefresh: string | null; // ISO string for serialization
}

// Initial state
const initialState: UIState = {
  viewMode: 'single',
  activeTab: 'overview',
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
  setLastRefresh,
  updateLastRefresh,
  resetUI,
} = uiSlice.actions;

// Export reducer
export const uiReducer = uiSlice.reducer;
