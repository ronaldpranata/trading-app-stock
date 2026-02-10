import { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisResult, ReferenceData } from '../workers/analysis.worker';

/**
 * Hook to manage a shared Web Worker for multiple stock analysis requests.
 * Allows processing multiple stocks without instantiating multiple workers.
 */
export function useBatchAnalysisWorker() {
  const [results, setResults] = useState<Record<string, AnalysisResult>>({});
  const [processingStatus, setProcessingStatus] = useState<Record<string, boolean>>({});
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Single Shared Worker
    workerRef.current = new Worker(new URL('../workers/analysis.worker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (event: MessageEvent<AnalysisResult>) => {
      const { symbol } = event.data;
      
      // Update results
      setResults(prev => ({
        ...prev,
        [symbol]: event.data
      }));

      // Mark as done
      setProcessingStatus(prev => ({
        ...prev,
        [symbol]: false
      }));
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const analyze = useCallback((data: ReferenceData) => {
    if (!workerRef.current) return;
    
    // Mark as processing
    setProcessingStatus(prev => ({
      ...prev,
      [data.symbol]: true
    }));

    // Send to worker
    workerRef.current.postMessage(data);
  }, []);

  return {
    results,
    processingStatus,
    analyze
  };
}
