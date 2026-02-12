"use client";

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setViewMode,
  setActiveTab,
  updateLastRefresh,
  selectViewMode,
  selectActiveTab,
  selectLastRefresh,
  selectLastRefreshFormatted,
  selectIsCompareMode,
} from '@/store';
import type { ViewMode, ActiveTab } from '@/store';



/**
 * Custom hook for UI state management
 * Provides a clean interface for components to interact with UI state
 */
export function useUI() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const viewMode = useAppSelector(selectViewMode);
  const activeTab = useAppSelector(selectActiveTab);
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



  const recordRefresh = useCallback(() => {
    dispatch(updateLastRefresh());
  }, [dispatch]);

  return {
    // State
    viewMode,
    activeTab,
    lastRefresh,
    lastRefreshFormatted,
    isCompareMode,
    
    // Actions
    setViewMode: changeViewMode,
    setActiveTab: changeActiveTab,
    updateLastRefresh: recordRefresh,
  };
}

/**
 * Custom hook for auto-refresh functionality
 * Handles the interval-based refresh logic
 */

