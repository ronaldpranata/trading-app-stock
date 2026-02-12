"use client";

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

// Async thunks
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/check');
      return response.ok;
    } catch (error) {
      return rejectWithValue('Auth check failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return true;
      } else {
        return rejectWithValue(data.error || 'Invalid password');
      }
    } catch (error) {
      return rejectWithValue('Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

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
      .addCase(checkAuth.pending, (state) => {
        state.isChecking = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
        state.isChecking = false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isChecking = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
        state.isChecking = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isChecking = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isChecking = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isChecking = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isChecking = false;
        state.error = action.payload as string;
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
