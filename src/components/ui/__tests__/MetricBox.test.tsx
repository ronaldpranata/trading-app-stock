import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricBox } from '../MetricBox';

describe('MetricBox Component', () => {
  it('renders label and value', () => {
    render(<MetricBox label="Test Label" value={100} />);
    expect(screen.getByText('Test Label')).toBeDefined();
    expect(screen.getByText('100')).toBeDefined();
  });

  it('handles N/A value', () => {
    render(<MetricBox label="Missing" value={undefined} />);
    expect(screen.getByText('N/A')).toBeDefined();
  });

  it('formats value with formatter', () => {
    const formatter = (v: any) => `$${v}`;
    render(<MetricBox label="Price" value={50} format={formatter} />);
    expect(screen.getByText('$50')).toBeDefined();
  });

  it('colors positive value green by default when colorize is true', () => {
    render(<MetricBox label="Profit" value={10} colorize={true} />);
    const value = screen.getByText('10');
    expect(value).toBeInTheDocument();
  });

  it('colors negative value red by default when colorize is true', () => {
    render(<MetricBox label="Loss" value={-10} colorize={true} />);
    const value = screen.getByText('-10');
    expect(value).toBeInTheDocument();
  });
});
