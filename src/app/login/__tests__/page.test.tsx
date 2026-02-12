import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LoginPage from '@/app/login/page';
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

// Mock LoginForm component
vi.mock('@/features/auth/components/LoginForm', () => ({
  default: () => <div data-testid="login-form">Login Form</div>,
}));

// Mock useAuth hook
vi.mock('@/hooks', () => ({
  useAuth: vi.fn(),
  useStock: vi.fn(), // Mock other hooks if necessary
  useUI: vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner when checking auth', () => {
    (hooks.useAuth as any).mockReturnValue({
      isAuthenticated: false,
      isChecking: true,
    });

    render(<LoginPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders login form when not authenticated', () => {
    (hooks.useAuth as any).mockReturnValue({
      isAuthenticated: false,
      isChecking: false,
    });

    render(<LoginPage />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('redirects to home when authenticated', () => {
    (hooks.useAuth as any).mockReturnValue({
      isAuthenticated: true,
      isChecking: false,
    });

    render(<LoginPage />);
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
