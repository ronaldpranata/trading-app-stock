"use client";

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setViewMode,
  setActiveTab,
  toggleAutoRefresh,
  updateLastRefresh,
  selectViewMode,
  selectActiveTab,
  selectAutoRefreshEnabled,
  selectLastRefresh,
  selectLastRefreshFormatted,
  selectIsCompareMode,
} from '@/store';
import type { ViewMode, ActiveTab } from '@/store';

interface UseAutoRefreshOptions {
  symbol?: string;
  onRefresh: () => void;
  interval?: number;
}

/**
 * Custom hook for UI state management
 * Provides a clean interface for components to interact with UI state
 */
export function useUI() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const viewMode = useAppSelector(selectViewMode);
  const activeTab = useAppSelector(selectActiveTab);
  const autoRefreshEnabled = useAppSelector(selectAutoRefreshEnabled);
  const lastRefresh = useAppSelector(selectLastRefresh);
  const lastRefreshFormatted = useAppSelector(selectLastRefreshFormatted);
  const isCompareMode = useAppSelector(selectIsCompareMode);

  // Actions
  const changeViewMode = useCallback(
    (mode: ViewMode) => {
      dispatch(setViewMode(mode));
    },
    [dispatch]
  );

  const changeActiveTab = useCallback(
    (tab: ActiveTab) => {
      dispatch(setActiveTab(tab));
    },
    [dispatch]
  );

  const toggleRefresh = useCallback(() => {
    dispatch(toggleAutoRefresh());
  }, [dispatch]);

  const recordRefresh = useCallback(() => {
    dispatch(updateLastRefresh());
  }, [dispatch]);

  return {
    // State
    viewMode,
    activeTab,
    autoRefreshEnabled,
    lastRefresh,
    lastRefreshFormatted,
    isCompareMode,
    
    // Actions
    setViewMode: changeViewMode,
    setActiveTab: changeActiveTab,
    toggleAutoRefresh: toggleRefresh,
    updateLastRefresh: recordRefresh,
  };
}

/**
 * Custom hook for auto-refresh functionality
 * Handles the interval-based refresh logic
 */
export function useAutoRefresh({ symbol, onRefresh, interval = 10000 }: UseAutoRefreshOptions) {
  const dispatch = useAppDispatch();
  const autoRefreshEnabled = useAppSelector(selectAutoRefreshEnabled);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (autoRefreshEnabled && symbol) {
      intervalId = setInterval(() => {
        onRefresh();
        dispatch(updateLastRefresh());
      }, interval);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefreshEnabled, symbol, onRefresh, interval, dispatch]);

  return { autoRefreshEnabled };
}
