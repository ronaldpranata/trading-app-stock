import { baseApi } from '@/store/api/baseApi';
import { StockData, StockQuote, HistoricalData, FundamentalData, TechnicalIndicators, PredictionResult } from '../types';

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStockData: builder.query<StockData, string>({
      query: (symbol) => `stock?symbol=${symbol}&type=aggregated`,
      transformResponse: (response: any) => {
        // 1. Sanitize & Validate
        const symbol = response.symbol || 'UNKNOWN';
        const quote = response.quote;
        const historical = Array.isArray(response.historicalData) ? response.historicalData : [];
        const fundamental = response.fundamentalData;
        const news = Array.isArray(response.news) ? response.news : [];

        // 2. Initial Sentiment Construction
        const sentimentData = {
          score: 50,
          sentiment: 'neutral' as const,
          headlines: news.map((n: any) => n.title).filter(Boolean)
        };

        // 3. Construct StockData
        // Calculations (indicators, prediction) are handled by the worker
        return {
          symbol,
          quote,
          historicalData: historical,
          fundamentalData: fundamental,
          technicalIndicators: null, 
          prediction: null,
          sentimentData,
          isLoading: false,
          error: null,
        };
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
