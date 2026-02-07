"use client";

import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { stockReducer } from './slices/stockSlice';
import { uiReducer } from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stock: stockReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['ui/setLastRefresh'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['ui.lastRefresh'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export everything for convenience
export * from './slices/authSlice';
export * from './slices/stockSlice';
export * from './slices/uiSlice';
export * from './hooks';
export * from './selectors';
