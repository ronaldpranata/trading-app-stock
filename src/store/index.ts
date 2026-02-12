"use client";


import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth/authSlice';
import { stockReducer } from '@/features/stock/stockSlice';
import { uiReducer } from '@/features/ui/uiSlice';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stock: stockReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
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
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export everything for convenience
export * from '@/features/auth/authSlice';
export * from '@/features/stock/stockSlice';
export * from '@/features/ui/uiSlice';
export * from './hooks';
export * from './selectors';
