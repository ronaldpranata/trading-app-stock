"use client";

import { TechnicalIndicators } from '@/types/stock';
import { Calendar } from 'lucide-react';
import { Box, Grid, Typography, Stack } from '@mui/material';

interface PerformanceMetricsProps {
  metrics: NonNullable<TechnicalIndicators['yearlyMetrics']>;
}

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <Box sx={{ 
        background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))',
        p: 1.5,
        borderRadius: 1,
        border: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)'
    }}>
      <Stack direction="row" alignItems="center" gap={1} mb={1}>
        <Calendar size={12} className="text-blue-400" />
        <Typography variant="caption" color="primary.light" fontWeight="medium">1-Year Performance</Typography>
      </Stack>
      <Grid container spacing={1}>
        <Grid size={3}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Return</Typography>
            <Typography variant="body2" fontWeight="bold" color={metrics.yearlyReturn >= 0 ? 'success.main' : 'error.main'}>
              {metrics.yearlyReturn >= 0 ? '+' : ''}{metrics.yearlyReturn.toFixed(1)}%
            </Typography>
          </Box>
        </Grid>
        <Grid size={3}>
            <Box>
                <Typography variant="caption" color="text.secondary" display="block">Volatility</Typography>
                <Typography variant="body2" fontWeight="bold">{metrics.volatility.toFixed(1)}%</Typography>
            </Box>
        </Grid>
        <Grid size={3}>
            <Box>
                <Typography variant="caption" color="text.secondary" display="block">Sharpe</Typography>
                <Typography variant="body2" fontWeight="bold" color={metrics.sharpeRatio > 1 ? 'success.main' : 'text.primary'}>
                    {metrics.sharpeRatio.toFixed(2)}
                </Typography>
            </Box>
        </Grid>
        <Grid size={3}>
            <Box>
                <Typography variant="caption" color="text.secondary" display="block">Max DD</Typography>
                <Typography variant="body2" fontWeight="bold" color="error.main">-{metrics.maxDrawdown.toFixed(1)}%</Typography>
            </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
