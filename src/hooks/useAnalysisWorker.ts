import { useState, useEffect, useRef } from 'react';
import { HistoricalData, FundamentalData } from '@/types/stock';
import { AnalysisResult } from '@/types/stock';
import { ReferenceData } from '../workers/analysis.worker';

interface UseAnalysisWorkerProps {
  symbol: string | null;
  historicalData: HistoricalData[] | null;
  fundamentalData: FundamentalData | null; // Added
  currentPrice: number | null;
  enabled?: boolean;
}

export function useAnalysisWorker({ 
  symbol, 
  historicalData, 
  fundamentalData,
  currentPrice,
  enabled = true 
}: UseAnalysisWorkerProps) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Worker
    // Note: Vite handles this import.meta.url pattern automatically
    workerRef.current = new Worker(new URL('../workers/analysis.worker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (event: MessageEvent<AnalysisResult>) => {
      setResult(event.data);
      setIsMeasuring(false);
    };

    return () => {
      // Cleanup worker on unmount
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!enabled || !symbol || !historicalData || !currentPrice || !workerRef.current) return;

    if (historicalData.length > 0) {
      // Use setTimeout to avoid synchronous state update warning
      setTimeout(() => {
        setIsMeasuring(true);
        const payload: ReferenceData = {
          symbol,
          historicalData,
          fundamentalData,
          currentPrice
        };
        workerRef.current?.postMessage(payload);
      }, 0);
    }
  }, [symbol, historicalData, fundamentalData, currentPrice, enabled]);

  return { 
    analysisResult: result,
    isCalculating: isMeasuring
  };
}
