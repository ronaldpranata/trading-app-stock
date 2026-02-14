// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../store/authSlice';
import { baseApi } from '../../../store/api/baseApi';
import { useAuth } from '../hooks/useAuth';
import { ReactNode } from 'react';

// Mock useRouter
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

// Mock baseApi to use absolute URL for tests
vi.mock('../../../store/api/baseApi', async () => {
  const { createApi, fetchBaseQuery } = await import('@reduxjs/toolkit/query/react');
  return {
    baseApi: createApi({
      reducerPath: 'api',
      baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost/api' }),
      tagTypes: ['Stock'],
      endpoints: () => ({}),
    }),
  };
});

// Create a test store factory
const createTestStore = () => configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

describe('Auth Integration', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
    
    // Mock global fetch
    global.fetch = vi.fn();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should handle login success', async () => {
    // Mock successful login response
    (global.fetch as any).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const error = await result.current.login('password123');
      expect(error).toBeNull();
    });

    const fetchCall = (global.fetch as any).mock.calls[0];
    const request = fetchCall[0] as Request;
    
    expect(request.url).toBe('http://localhost/api/auth/login');
    expect(request.method).toBe('POST');
    const body = await request.clone().json();
    expect(body).toEqual({ password: 'password123' });

    // Verify state update
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle login failure', async () => {
    // Mock failed login response
    (global.fetch as any).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Invalid password' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const error = await result.current.login('wrongpassword');
      expect(error).toBe('Invalid password');
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout', async () => {
    // Mock successful logout response
    (global.fetch as any).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    const fetchCall = (global.fetch as any).mock.calls[0];
    const request = fetchCall[0] as Request;
    
    expect(request.url).toBe('http://localhost/api/auth/logout');
    expect(request.method).toBe('POST');

    expect(result.current.isAuthenticated).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});
