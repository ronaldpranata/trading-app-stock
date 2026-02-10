import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, StatusBadge } from '../Badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeDefined();
  });

  it('applies default styles', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge.className).toContain('bg-gray-500/20');
  });

  it('applies variant styles', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');
    expect(badge.className).toContain('bg-green-500/20');
  });
});

describe('StatusBadge Component', () => {
  it('renders LIVE status correctly', () => {
    render(<StatusBadge status="live" />);
    const badge = screen.getByText('LIVE');
    expect(badge.className).toContain('bg-green-500/20');
  });

  it('renders LOADING status correctly', () => {
    render(<StatusBadge status="loading" />);
    const badge = screen.getByText('LOADING');
    expect(badge.className).toContain('bg-cyan-500/20');
  });
});
