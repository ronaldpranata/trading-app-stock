"use client";

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  checkAuth,
  login,
  logout,
  clearAuthError,
  selectIsAuthenticated,
  selectIsCheckingAuth,
  selectAuthError,
} from '@/store';
import { resetStock } from '@/features/stock/stockSlice';
import { stockApi } from '@/store/api/stockApi';

/**
 * Custom hook for authentication operations
 * Provides a clean interface for components to interact with auth state
 * @returns Object containing auth state and actions
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Selectors
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isChecking = useAppSelector(selectIsCheckingAuth);
  const error = useAppSelector(selectAuthError);

  // Check auth on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Actions
  const handleLogin = useCallback(
    async (password: string): Promise<boolean> => {
      const result = await dispatch(login(password));
      return !login.rejected.match(result);
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
    dispatch(resetStock());
    dispatch(stockApi.util.resetApiState());
    
    router.refresh(); // Invalidate server components
    router.push('/');
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    // State
    isAuthenticated,
    isChecking,
    error,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError,
  };
}
