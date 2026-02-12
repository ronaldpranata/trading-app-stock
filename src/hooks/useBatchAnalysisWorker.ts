import { useEffect, useRef, useCallback } from 'react';
import { ReferenceData } from '../workers/analysis.worker';
import { AnalysisResult } from '@/types/stock';
import { useAppDispatch } from '@/store/hooks';
import { setAnalysisResult, setIsAnalyzing } from '@/features/stock/stockSlice';

/**
 * Hook to manage a shared Web Worker for multiple stock analysis requests.
 * Allows processing multiple stocks without instantiating multiple workers.
 */
export function useBatchAnalysisWorker(onComplete?: (symbol: string) => void) {
  const dispatch = useAppDispatch();
  const workerRef = useRef<Worker | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep ref callback up to date
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Initialize Single Shared Worker
    workerRef.current = new Worker(new URL('../workers/analysis.worker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (event: MessageEvent<AnalysisResult>) => {
      // Update global Redux state
      dispatch(setAnalysisResult(event.data));
      
      // Notify completion
      if (onCompleteRef.current) {
        onCompleteRef.current(event.data.symbol);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [dispatch]); // Removed onComplete from dependencies

  const analyze = useCallback((data: ReferenceData) => {
    if (!workerRef.current) return;
    workerRef.current.postMessage(data);
  }, []);

  return {
    analyze
  };
}
