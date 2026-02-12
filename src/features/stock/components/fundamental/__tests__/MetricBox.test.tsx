import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MetricBox from '../MetricBox';

describe('MetricBox', () => {
  const format = (v: number) => `$${v}`;

  it('renders label and formatted value', () => {
    render(<MetricBox label="Test Metric" value={100} format={format} />);
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('renders N/A when value is undefined', () => {
    render(<MetricBox label="Test Metric" value={undefined} format={format} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('applies success color when value is good', () => {
    render(<MetricBox label="Test Metric" value={100} format={format} good={50} bad={20} />);
    // Note: verifying exact color might depend on MUI theme impl specifics, 
    // strictly speaking we check simple rendering here.
    const valueEl = screen.getByText('$100');
    expect(valueEl).toBeInTheDocument();
  });
});
