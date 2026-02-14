import { baseApi } from '@/store/api/baseApi';
import { StockData, StockQuote, HistoricalData, FundamentalData, TechnicalIndicators, PredictionResult } from '../types';

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStockData: builder.query<StockData, string>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const symbol = _arg;
        
        // Fetch data in parallel
        const [quoteResult, historicalResult, fundamentalResult, newsResult] = await Promise.all([
          fetchWithBQ(`stock?symbol=${symbol}&type=quote`),
          fetchWithBQ(`stock?symbol=${symbol}&type=historical`),
          fetchWithBQ(`stock?symbol=${symbol}&type=fundamental`),
          fetchWithBQ(`stock?symbol=${symbol}&type=news`)
        ]);

        if (quoteResult.error) return { error: quoteResult.error };
        if (historicalResult.error) return { error: historicalResult.error };
        if (fundamentalResult.error) return { error: fundamentalResult.error };
        // News error is non-critical, we can proceed without it

        const quote = quoteResult.data as StockQuote;
        const historical = historicalResult.data as HistoricalData[];
        const fundamental = fundamentalResult.data as FundamentalData;
        const news = (newsResult.data as any[]) || [];

        let indicators: TechnicalIndicators | null = null;
        let prediction: PredictionResult | null = null;
        
        // Initial sentiment structure (will be populated by worker)
        const sentimentData = {
          score: 50,
          sentiment: 'neutral' as const,
          headlines: news.map((n: any) => n.title).filter(Boolean)
        };

        if (Array.isArray(historical) && historical.length > 0) {
          // Worker will handle calculations
          indicators = null; 
          prediction = null;
        }

        const stockData: StockData = {
          symbol,
          quote,
          historicalData: historical,
          fundamentalData: fundamental,
          technicalIndicators: indicators,
          prediction,
          sentimentData,
          isLoading: false,
          error: null,
        };

        return { data: stockData };
      },
      providesTags: (result, error, symbol) => [{ type: 'Stock', id: symbol }],
      keepUnusedDataFor: 15, 
    }),
    getQuote: builder.query<StockQuote, string>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        // This endpoint is for quick refreshes of just the price
         const result = await fetchWithBQ(`stock?symbol=${_arg}&type=quote`);
         if (result.error) return { error: result.error };
         return { data: result.data as StockQuote };
      },
      keepUnusedDataFor: 10, 
    }),
    searchStocks: builder.query<any[], string>({
      query: (query) => `stock?type=search&query=${encodeURIComponent(query)}`,
      keepUnusedDataFor: 300, 
    }),
  }),
  overrideExisting: false,
});

export const { useGetStockDataQuery, useGetQuoteQuery, useLazySearchStocksQuery } = stockApi;
