import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriceTicker from '../PriceTicker';
import { StockQuote } from '@/features/stock/types';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { stockReducer } from '../../store/stockSlice';

// Mock the RTK Query hooks
import { vi } from 'vitest';
const mockUseGetStockDataQuery = vi.fn();
const mockUseGetQuoteQuery = vi.fn();

vi.mock('@/features/stock/services/stockApi', () => ({
  useGetStockDataQuery: (...args: unknown[]) => mockUseGetStockDataQuery(...args),
  useGetQuoteQuery: (...args: unknown[]) => mockUseGetQuoteQuery(...args),
  stockApi: {
      reducerPath: 'stockApi',
      reducer: (state = {}) => state,
      middleware: (getDefaultMiddleware: () => unknown) => getDefaultMiddleware(),
  } 
}));
const mockQuote: StockQuote = {
  symbol: 'AAPL',
  price: 150.00,
  open: 145.00,
  high: 155.00,
  low: 144.00, 
  volume: 1000000,
  change: 5.00,
  changePercent: 3.45,
  timestamp: 1672531200000,
  simulated: false,
  previousClose: 145.00
};



describe('PriceTicker Component', () => {
  const store = configureStore({
      reducer: {
          stock: stockReducer,
          stockApi: (state = {}) => state,
          auth: (state = { user: null, token: null, isAuthenticated: false }) => state,
      }
  });

  // Default mock return
  mockUseGetStockDataQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
  });

  const renderWithProvider = (ui: React.ReactNode) => {
      return render(
          <Provider store={store}>
              {ui}
          </Provider>
      );
  };

  it('renders loading skeleton when isLoading is true', () => {
    mockUseGetStockDataQuery.mockReturnValue({
       data: null,
       isLoading: true,
       error: null,
       refetch: vi.fn(),
    });
    renderWithProvider(<PriceTicker />);
    expect(screen.getByTestId('loading-skeleton')).toBeDefined();
  });

  it('renders price and symbol correctly', () => {
    mockUseGetStockDataQuery.mockReturnValue({
       data: { quote: mockQuote },
       isLoading: false,
       error: null,
       refetch: vi.fn(),
    });
    renderWithProvider(<PriceTicker />);
    expect(screen.getByText('AAPL')).toBeDefined();
    expect(screen.getByText('$150.00')).toBeDefined();
  });

  it('renders positive change', () => {
    mockUseGetStockDataQuery.mockReturnValue({
       data: { quote: mockQuote },
       isLoading: false,
       error: null,
       refetch: vi.fn(),
    });
    renderWithProvider(<PriceTicker />);
    const changeElement = screen.getByTestId('price-change');
    expect(changeElement.textContent).toContain('+5.00 (3.45%)');
  });

  it('renders negative change', () => {
    const negativeQuote = { ...mockQuote, change: -5.00, changePercent: -3.45 };
    mockUseGetStockDataQuery.mockReturnValue({
       data: { quote: negativeQuote },
       isLoading: false,
       error: null,
       refetch: vi.fn(),
    });
    renderWithProvider(<PriceTicker />);
    const changeElement = screen.getByTestId('price-change');
    expect(changeElement.textContent).toContain('-5.00 (-3.45%)');
  });
});
