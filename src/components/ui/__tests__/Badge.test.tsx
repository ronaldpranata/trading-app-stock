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
    // Default is filled, default color
    expect(badge.closest('.MuiChip-root')?.className).toContain('MuiChip-filledDefault');
  });

  it('applies variant styles', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');
    // Success is outlined, success color
    expect(badge.closest('.MuiChip-root')?.className).toContain('MuiChip-outlinedSuccess');
  });
});

describe('StatusBadge Component', () => {
  it('renders LIVE status correctly', () => {
    render(<StatusBadge status="live" />);
    const badge = screen.getByText('LIVE');
    // Live -> Success -> Outlined Success
    expect(badge.closest('.MuiChip-root')?.className).toContain('MuiChip-outlinedSuccess');
  });

  it('renders LOADING status correctly', () => {
    render(<StatusBadge status="loading" />);
    const badge = screen.getByText('LOADING');
    // Loading -> Info -> Outlined Info
    expect(badge.closest('.MuiChip-root')?.className).toContain('MuiChip-outlinedInfo');
  });
});
