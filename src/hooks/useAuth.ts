import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearAuthError,
  selectIsAuthenticated,
  selectIsCheckingAuth,
  selectAuthError,
} from '@/store';
import { useLoginMutation, useLogoutMutation } from '@/features/auth/authApi';
import { resetStock } from '@/features/stock/stockSlice';
import { baseApi } from '@/store/api/baseApi';

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

  // API Mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  // Actions
  const handleLogin = useCallback(
    async (password: string): Promise<string | null> => {
      try {
        const result = await loginMutation(password).unwrap();
        // If unwrap succeeds, login was successful
        return null; 
      } catch (err: any) {
        // If unwrap throws, login failed
        const errorMessage = err?.data?.error || "Login failed";
        return errorMessage;
      }
    },
    [loginMutation]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (e) {
      console.error("Logout failed", e);
    }
    
    // Client-side cleanup
    dispatch(resetStock());
    dispatch(baseApi.util.resetApiState());
    
    router.refresh(); // Invalidate server components
    router.replace('/login');
  }, [dispatch, router, logoutMutation]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    // State
    isAuthenticated,
    isChecking: isChecking || isLoginLoading || isLogoutLoading,
    error,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError,
  };
}
