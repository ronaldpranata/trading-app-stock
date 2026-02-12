import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Home from '@/app/page';
import * as hooks from '@/hooks';

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

// Mock child components
vi.mock('@/components/layout/AppLayout', () => ({
    default: ({ children }: any) => <div data-testid="app-layout">{children}</div>,
}));
vi.mock('@/features/stock/components/CompareStockSelector', () => ({
    default: () => <div data-testid="compare-selector">Compare Selector</div>,
}));
vi.mock('@/components/layout/StatusBar', () => ({
    default: () => <div data-testid="status-bar">Status Bar</div>,
}));
vi.mock('@/features/stock/components/CompareView', () => ({
    default: () => <div data-testid="compare-view">Compare View</div>,
}));
vi.mock('@/features/stock/components/SingleStockView', () => ({
    default: () => <div data-testid="single-stock-view">Single Stock View</div>,
}));

// Mock hooks
vi.mock('@/hooks', () => ({
  useAuth: vi.fn(),
  useStock: vi.fn(),
  useUI: vi.fn(),
  useAutoRefresh: vi.fn(), // Mock useAutoRefresh as it is used in the component
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks
    (hooks.useStock as any).mockReturnValue({
        primaryStock: { prediction: { direction: 'NEUTRAL' } 
    }});
    (hooks.useUI as any).mockReturnValue({
        isCompareMode: false 
    });
     (hooks.useAutoRefresh as any).mockReturnValue({});
  });

  it('redirects to login when not authenticated', () => {
    (hooks.useAuth as any).mockReturnValue({
      isAuthenticated: false,
      isChecking: false,
    });

    render(<Home />);
    expect(mockReplace).toHaveBeenCalledWith('/login');
    expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument();
  });

  it('renders loading spinner when checking auth', () => {
    (hooks.useAuth as any).mockReturnValue({
      isAuthenticated: false,
      isChecking: true,
    });

    render(<Home />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument();
  });

  it('renders app layout when authenticated', () => {
    (hooks.useAuth as any).mockReturnValue({
      isAuthenticated: true,
      isChecking: false,
    });

    render(<Home />);
    expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
