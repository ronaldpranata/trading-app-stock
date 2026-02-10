import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriceTicker from '../PriceTicker';
import { StockQuote } from '@/types/stock';

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
  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(<PriceTicker quote={null} isLoading={true} />);
    expect(container.getElementsByClassName('animate-pulse').length).toBe(1);
  });

  it('renders price and symbol correctly', () => {
    render(<PriceTicker quote={mockQuote} isLoading={false} />);
    expect(screen.getByText('AAPL')).toBeDefined();
    expect(screen.getByText('$150.00')).toBeDefined();
  });

  it('renders positive change with green color', () => {
    render(<PriceTicker quote={mockQuote} isLoading={false} />);
    const changeElement = screen.getByText('+5.00 (+3.45%)');
    expect(changeElement.parentElement?.className).toContain('text-green-400');
  });

  it('renders negative change with red color', () => {
    const negativeQuote = { ...mockQuote, change: -5.00, changePercent: -3.45 };
    render(<PriceTicker quote={negativeQuote} isLoading={false} />);
    const changeElement = screen.getByText('-5.00 (-3.45%)');
    expect(changeElement.parentElement?.className).toContain('text-red-400');
  });

  it('formats large volume correctly', () => {
     render(<PriceTicker quote={{...mockQuote, volume: 1500000}} isLoading={false} />);
     expect(screen.getByText('1.5M')).toBeDefined();
  });
});
