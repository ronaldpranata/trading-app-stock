"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface AuthState {
  isAuthenticated: boolean;
  isChecking: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isChecking: true,
  error: null,
};

import { authApi } from './authApi';
// Thunks replaced by authApi endpoints

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      state.isChecking = false;
    },
    setChecking: (state, action: PayloadAction<boolean>) => {
      state.isChecking = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth
      .addMatcher(authApi.endpoints.checkAuth.matchPending, (state) => {
        state.isChecking = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.checkAuth.matchFulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
        state.isChecking = false;
      })
      .addMatcher(authApi.endpoints.checkAuth.matchRejected, (state, action) => {
        state.isAuthenticated = false;
        state.isChecking = false;
        // Optional: set error if check fails, but usually we just want to know strict boolean
      })
      // Login
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isAuthenticated = true; // API returns true on success
        state.isChecking = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isAuthenticated = false;
        state.isChecking = false;
        state.error = (action.payload as any)?.data?.error || 'Login failed';
      })
      // Logout
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isChecking = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.isAuthenticated = false;
        state.isChecking = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state, action) => {
        state.isChecking = false;
        state.isAuthenticated = false; // Assume logout happened anyway on client side
      });
  },
});

// Export actions
export const { 
  setAuthenticated, 
  setChecking, 
  setAuthError, 
  clearAuthError 
} = authSlice.actions;

// Export reducer
export const authReducer = authSlice.reducer;
