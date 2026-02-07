// Format utilities for numbers, prices, and percentages

export function formatPrice(price: number): string {
  if (price < 0.01) return price.toFixed(8);
  if (price < 1) return price.toFixed(4);
  if (price < 100) return price.toFixed(2);
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toFixed(0);
}

export function formatPercent(num: number, showSign: boolean = true): string {
  const sign = showSign && num >= 0 ? '+' : '';
  return sign + num.toFixed(2) + '%';
}

export function formatVolume(volume: number, isCrypto: boolean = false): string {
  if (isCrypto) {
    if (volume >= 1e12) return (volume / 1e12).toFixed(1) + 'T';
    if (volume >= 1e9) return (volume / 1e9).toFixed(1) + 'B';
    if (volume >= 1e6) return (volume / 1e6).toFixed(1) + 'M';
  }
  return (volume / 1000000).toFixed(1) + 'M';
}

export function formatDate(date: string, format: 'short' | 'medium' | 'full' = 'short'): string {
  if (format === 'short') return date.slice(5); // MM-DD
  if (format === 'medium') return date.slice(2); // YY-MM-DD
  return date; // YYYY-MM-DD
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
