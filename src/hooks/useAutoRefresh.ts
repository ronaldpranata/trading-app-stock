'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoRefreshOptions {
  interval?: number;
  enabled?: boolean;
  onRefresh: () => void | Promise<void>;
}

export function useAutoRefresh({ interval = 10000, enabled = false, onRefresh }: UseAutoRefreshOptions) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    await onRefresh();
    setLastRefresh(new Date());
  }, [onRefresh]);

  useEffect(() => {
    if (isEnabled) {
      intervalRef.current = setInterval(refresh, interval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, interval, refresh]);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const start = useCallback(() => {
    setIsEnabled(true);
  }, []);

  const stop = useCallback(() => {
    setIsEnabled(false);
  }, []);

  return {
    isEnabled,
    lastRefresh,
    toggle,
    start,
    stop,
    refresh
  };
}
