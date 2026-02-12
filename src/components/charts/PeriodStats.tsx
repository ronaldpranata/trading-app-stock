'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatDate } from '@/lib/formatters';
import { PeriodStats } from './useChartData';
import { Box, Typography, Stack, Grid } from '@mui/material';

interface PeriodStatsDisplayProps {
  stats: PeriodStats;
  className?: string;
}

export function PeriodStatsDisplay({ stats, className = '' }: PeriodStatsDisplayProps) {
  return (
    <Box className={className}>
      <Grid container spacing={1}>
        {/* Max Drawdown */}
        <Grid size={{ xs: 6, md: 3 }}>
           <Box sx={{ 
               bgcolor: 'rgba(239, 68, 68, 0.1)', 
               p: 1.5, 
               borderRadius: 1, 
               border: 1, 
               borderColor: 'rgba(239, 68, 68, 0.2)' 
            }}>
             <Stack direction="row" alignItems="center" gap={0.5} mb={0.5}>
                 <ArrowDown size={12} className="text-red-400" />
                 <Typography variant="caption" color="error.main">Max Drawdown</Typography>
             </Stack>
             <Typography variant="body2" fontWeight="bold" color="error.main">
                -{stats.maxDrawdown.toFixed(2)}%
             </Typography>
             <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                {formatDate(stats.drawdownStart)} → {formatDate(stats.drawdownEnd)}
             </Typography>
           </Box>
        </Grid>

        {/* Max Rally */}
        <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ 
               bgcolor: 'rgba(34, 197, 94, 0.1)', 
               p: 1.5, 
               borderRadius: 1, 
               border: 1, 
               borderColor: 'rgba(34, 197, 94, 0.2)' 
            }}>
             <Stack direction="row" alignItems="center" gap={0.5} mb={0.5}>
                 <ArrowUp size={12} className="text-green-400" />
                 <Typography variant="caption" color="success.main">Max Rally</Typography>
             </Stack>
             <Typography variant="body2" fontWeight="bold" color="success.main">
                +{stats.maxGain.toFixed(2)}%
             </Typography>
             <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                {formatDate(stats.gainStart)} → {formatDate(stats.gainEnd)}
             </Typography>
           </Box>
        </Grid>

        {/* Period Range */}
        <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1, height: '100%' }}>
                <Typography variant="caption" color="text.secondary" mb={0.5} display="block">Period Range</Typography>
                <Stack direction="row" justifyItems="space-between" width="100%">
                    <Box flex={1}>
                        <Typography variant="caption" color="text.secondary" display="block">High</Typography>
                        <Typography variant="caption" fontWeight="bold" color="success.main">${stats.periodHigh.toFixed(2)}</Typography>
                    </Box>
                    <Box flex={1} textAlign="right">
                        <Typography variant="caption" color="text.secondary" display="block">Low</Typography>
                        <Typography variant="caption" fontWeight="bold" color="error.main">${stats.periodLow.toFixed(2)}</Typography>
                    </Box>
                </Stack>
            </Box>
        </Grid>

        {/* Volatility & Win Rate */}
        <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1, height: '100%' }}>
                <Typography variant="caption" color="text.secondary" mb={0.5} display="block">Statistics</Typography>
                <Stack direction="row" justifyItems="space-between" width="100%">
                    <Box flex={1}>
                        <Typography variant="caption" color="text.secondary" display="block">Volatility</Typography>
                        <Typography variant="caption" fontWeight="bold" color={stats.volatility > 30 ? 'error.main' : 'text.primary'}>
                             {stats.volatility.toFixed(1)}%
                        </Typography>
                    </Box>
                    <Box flex={1} textAlign="right">
                        <Typography variant="caption" color="text.secondary" display="block">Win Rate</Typography>
                        <Typography variant="caption" fontWeight="bold" color={stats.winRate > 50 ? 'success.main' : 'error.main'}>
                             {stats.winRate.toFixed(1)}%
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

interface PeriodSummaryProps {
  stats: PeriodStats;
  className?: string;
}

export function PeriodSummary({ stats, className = '' }: PeriodSummaryProps) {
  const isPositive = stats.priceChangePercent >= 0;

  return (
    <Box sx={{ 
        p: 2, 
        borderRadius: 1, 
        border: 1, 
        borderColor: isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
        bgcolor: isPositive ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)'
    }} className={className}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" gap={2}>
           <Stack direction="row" alignItems="center" gap={0.5} color={isPositive ? 'success.main' : 'error.main'}>
                {isPositive ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
                <Typography variant="h5" fontWeight="bold">
                    {isPositive ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
                </Typography>
           </Stack>
           <Typography variant="caption" color="text.secondary">
               <span style={{ color: isPositive ? '#4ade80' : '#f87171' }}>
                  {isPositive ? '+' : ''}${stats.priceChange.toFixed(2)}
               </span>
               <span style={{ margin: '0 4px' }}>•</span>
               <span>{stats.tradingDays} days</span>
           </Typography>
        </Stack>

        <Box textAlign="right">
            <Typography variant="caption" color="text.secondary" display="block">
                {formatDate(stats.startDate)} → {formatDate(stats.endDate)}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
                ${stats.startPrice.toFixed(2)} → ${stats.endPrice.toFixed(2)}
            </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
