import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStock } from '../useStock';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { stockReducer } from '../../features/stock/stockSlice';

// Mock the RTK Query hooks
// We mock the *module* so useStock imports our mocked versions
const mockUseGetStockDataQuery = vi.fn();
const mockUseGetQuoteQuery = vi.fn();

vi.mock('@/features/stock/stockApi', () => ({
  useGetStockDataQuery: (...args: unknown[]) => mockUseGetStockDataQuery(...args),
  useGetQuoteQuery: (...args: unknown[]) => mockUseGetQuoteQuery(...args),
  stockApi: {
      reducerPath: 'stockApi',
      reducer: (state = {}) => state,
      middleware: (getDefaultMiddleware: () => unknown) => getDefaultMiddleware(),
  } 
}));

// Setup a real Redux store for the slice part
const createTestStore = () => configureStore({
  reducer: {
    stock: stockReducer,
    // We don't need the real API reducer for this test since we mocked the hook
    stockApi: (state = {}) => state,
    auth: (state = { user: null, token: null, isAuthenticated: false, loading: false, error: null }) => state, 
  }, 
});

describe('useStock Hook', () => {
    let store: ReturnType<typeof createTestStore>;

    beforeEach(() => {
        store = createTestStore();
        vi.clearAllMocks();
        
        // Default mock return
        mockUseGetStockDataQuery.mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
            refetch: vi.fn(),
        });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
    );

    it('should return initial state', () => {
        const { result } = renderHook(() => useStock(), { wrapper });
        
        expect(result.current.symbol).toBe('AAPL');
        expect(result.current.primaryStock).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('should dispatch setPrimarySymbol when load is called', () => {
        const { result } = renderHook(() => useStock(), { wrapper });
        
        act(() => {
            result.current.load('AAPL');
        });

        expect(result.current.symbol).toBe('AAPL');
    });

    it('should reflect loading state from RTK Query', () => {
        // Setup mock to return loading
        mockUseGetStockDataQuery.mockReturnValue({
            isLoading: true,
            data: null
        });

        // We need to set a symbol so the hook actually calls the query
        // The hook calls query with skip: !symbol
        const { result, rerender } = renderHook(() => useStock(), { wrapper });
        
        act(() => {
             result.current.load('AAPL');
        });
        
        // Rerender to pick up the new symbol and the mock result
        rerender();

        expect(result.current.isLoading).toBe(true);
    });

    it('should return data when query succeeds', () => {
        const mockData = {
            symbol: 'AAPL',
            quote: { price: 150, change: 5, changePercent: 3.5 },
        };
        
        mockUseGetStockDataQuery.mockReturnValue({
            isLoading: false,
            data: mockData,
        });

        const { result } = renderHook(() => useStock(), { wrapper });
        act(() => { result.current.load('AAPL'); });

        expect(result.current.primaryStock).toEqual({
            ...mockData,
            technicalIndicators: null,
            prediction: null
        });
        expect(result.current.currentPrice).toBe(150);
        expect(result.current.priceChange.isPositive).toBe(true);
    });
});
