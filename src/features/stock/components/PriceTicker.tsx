'use client';

import { memo } from 'react';

import { StockQuote } from '@/types/stock';
import { TrendingUp, TrendingDown, Wifi, Database, Bitcoin } from 'lucide-react';
import { Card, CardContent, Typography, Box, Stack, Chip, useTheme } from '@mui/material';

interface PriceTickerProps {
  quote: StockQuote | null;
  isLoading: boolean;
}

function isCrypto(symbol: string): boolean {
  return symbol.includes('-USD') || symbol.includes('-EUR') || symbol.includes('-GBP');
}

function formatPrice(price: number): string {
  const absPrice = Math.abs(price);
  if (absPrice < 0.01 && absPrice > 0) return price.toFixed(8);
  if (absPrice < 1) return price.toFixed(4);
  if (absPrice < 100) return price.toFixed(2);
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(volume: number, isCryptoAsset: boolean): string {
  if (isCryptoAsset) {
    if (volume >= 1e12) return (volume / 1e12).toFixed(1) + 'T';
    if (volume >= 1e9) return (volume / 1e9).toFixed(1) + 'B';
    if (volume >= 1e6) return (volume / 1e6).toFixed(1) + 'M';
  }
  return (volume / 1000000).toFixed(1) + 'M';
}

function PriceTicker({ quote, isLoading }: PriceTickerProps) {
  const theme = useTheme();

  if (isLoading || !quote) {
    return (
      <Card sx={{ animation: 'pulse 2s infinite' }} data-testid="loading-skeleton">
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
           <Box sx={{ width: 100, height: 40, bgcolor: 'action.hover', borderRadius: 1 }} />
           <Box sx={{ width: 140, height: 24, bgcolor: 'action.hover', borderRadius: 1 }} />
        </CardContent>
      </Card>
    );
  }

  const isPositive = quote.change >= 0;
  const isCryptoAsset = isCrypto(quote.symbol);
  const trendColor = isPositive ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: `16px !important` }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          {/* Left: Symbol & Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isCryptoAsset ? (
                <Bitcoin size={24} className="text-orange-400" />
              ) : (
                <TrendingUp size={24} className="text-blue-400" />
              )}
              <Typography variant="h5" fontWeight="bold">
                {quote.symbol}
              </Typography>
              <Chip 
                label={quote.simulated ? "SIM" : "LIVE"} 
                size="small" 
                color={quote.simulated ? "warning" : "success"}
                variant="outlined"
                icon={quote.simulated ? <Database size={12} /> : <Wifi size={12} />}
                sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.65rem' } }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <Typography variant="h4" fontWeight="bold">
                ${formatPrice(quote.price)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: trendColor }} data-testid="price-change">
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <Typography variant="subtitle1" fontWeight="bold" color="inherit">
                  {isPositive ? '+' : ''}{formatPrice(quote.change)} ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right: OHLV */}
          <Stack direction="row" spacing={3}>
            <MetricItem label="Open" value={formatPrice(quote.open)} />
            <MetricItem label="High" value={formatPrice(quote.high)} color="success.main" />
            <MetricItem label="Low" value={formatPrice(quote.low)} color="error.main" />
            <MetricItem label="Vol" value={quote.volume > 0 ? formatVolume(quote.volume, isCryptoAsset) : 'N/A'} />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default memo(PriceTicker);

function MetricItem({ label, value, color = 'text.primary' }: { label: string; value: string; color?: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="medium" color={color}>
        {value}
      </Typography>
    </Box>
  );
}
