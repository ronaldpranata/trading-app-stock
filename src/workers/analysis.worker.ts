import { HistoricalData, TechnicalIndicators, PredictionResult, FundamentalData } from '@/types/stock';
import { 
  calculateAllIndicators 
} from '../utils/technicalAnalysis';
import { generatePrediction } from '../utils/prediction';

// Define input and output types for type safety
export interface ReferenceData {
  historicalData: HistoricalData[];
  fundamentalData: FundamentalData | null;
  currentPrice: number;
  symbol: string;
}

export interface AnalysisResult {
  symbol: string;
  technicalIndicators: TechnicalIndicators;
  prediction: PredictionResult;
}

// Global context for the worker
const ctx = self as unknown as Worker;

ctx.onmessage = (event: MessageEvent<ReferenceData>) => {
  try {
    const { historicalData, fundamentalData, currentPrice, symbol } = event.data;
    
    // 1. Heavy Calculation: Technical Indicators (SMA, MACD, Elliott Wave, etc.)
    // This can take 50-200ms for large datasets with complex patterns
    const technicalIndicators = calculateAllIndicators(historicalData);
    
    // 2. Generate Prediction using shared utility
    // This ensures consistency with the previous logic and includes all timeframes
    const prediction = generatePrediction(
      currentPrice,
      technicalIndicators,
      fundamentalData || {
        // Fallback if no fundamental data
        marketCap: 0,
        peRatio: 0,
        pbRatio: 0,
        psRatio: 0,
        pegRatio: 0,
        eps: 0,
        epsGrowth: 0,
        dividendYield: 0,
        beta: 0,
        fiftyTwoWeekHigh: 0,
        fiftyTwoWeekLow: 0,
        avgVolume: 0,
        debtToEquity: 0,
        roe: 0,
        revenueGrowth: 0,
        profitMargin: 0,
        evToEbitda: 0,
        dcf: { source: 'calculated', bull: 0, base: 0, bear: 0 }
      }
    );

    const result: AnalysisResult = {
      symbol, // Added symbol to identify result
      technicalIndicators,
      prediction
    };

    // Send results back to main thread
    ctx.postMessage(result);
    
  } catch (error) {
    console.error('Worker Analysis Failed:', error);
    // In a real app, post an error message back
  }
};
