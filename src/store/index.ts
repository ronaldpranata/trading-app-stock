"use client";

import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/store/authSlice";
import { stockReducer } from "@/features/stock/store/stockSlice";
import { uiReducer } from "@/features/ui/store/uiSlice";
import { authorReducer } from "@/features/author/store/authorSlice";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stock: stockReducer,
    ui: uiReducer,
    author: authorReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["ui/setLastRefresh", "persist/PERSIST"],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          "payload.timestamp", 
          "meta.arg", 
          "meta.baseQueryMeta", 
          "meta.request",
          "meta.response"
        ],
        // Ignore these paths in the state
        ignoredPaths: ["ui.lastRefresh"],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export everything for convenience
export * from "@/features/auth/store/authSlice";
export * from "@/features/stock/store/stockSlice";
export * from "@/features/ui/store/uiSlice";
export * from "@/features/author/store/authorSlice";
export * from "./hooks";
export * from "./selectors";
