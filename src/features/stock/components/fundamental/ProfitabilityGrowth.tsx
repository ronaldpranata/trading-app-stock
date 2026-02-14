"use client";

import { FundamentalData } from '@/features/stock/types';
import { formatNumber } from '@/features/stock/utils/fundamentalAnalysis';
import { Box, Grid, Typography, Stack } from '@mui/material';
import MetricBox from './MetricBox';

interface ProfitabilityGrowthProps {
  data: FundamentalData;
  currentPrice: number;
}

export default function ProfitabilityGrowth({ data, currentPrice }: ProfitabilityGrowthProps) {
  const fiftyTwoWeekPosition = data.fiftyTwoWeekHigh > data.fiftyTwoWeekLow 
    ? ((currentPrice - data.fiftyTwoWeekLow) / (data.fiftyTwoWeekHigh - data.fiftyTwoWeekLow)) * 100
    : 50;

  return (
    <>
        {/* Profitability */}
        <Grid container spacing={1}>
            <Grid size={6}>
                    <MetricBox label="ROE" value={data.roe} format={(v) => `${v.toFixed(1)}%`} good={15} bad={5} />
            </Grid>
            <Grid size={6}>
                    <MetricBox label="Profit Margin" value={data.profitMargin} format={(v) => `${v.toFixed(1)}%`} good={15} bad={5} />
            </Grid>
        </Grid>
            {/* Growth & Health */}
        <Grid container spacing={1}>
            <Grid size={6}>
                <MetricBox label="Revenue Growth" value={data.revenueGrowth} format={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`} good={10} bad={0} />
            </Grid>
            <Grid size={6}>
                <MetricBox label="Beta" value={data.beta} format={(v) => v.toFixed(2)} />
            </Grid>
        </Grid>

            {/* Other */}
        <Grid container spacing={1}>
            <Grid size={6}>
                <MetricBox label="Div Yield" value={data.dividendYield} format={(v) => `${v.toFixed(2)}%`} />
            </Grid>
            <Grid size={6}>
                <MetricBox label="Avg Vol" value={data.avgVolume} format={(v) => formatNumber(v)} />
            </Grid>
        </Grid>

        {/* 52-Week Range */}
        {data.fiftyTwoWeekHigh > 0 && (
            <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>52-Week Range</Typography>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="error.main">${formatNumber(data.fiftyTwoWeekLow)}</Typography>
                <Typography variant="caption" color="success.main">${formatNumber(data.fiftyTwoWeekHigh)}</Typography>
            </Stack>
            <Box sx={{ position: 'relative', height: 6, bgcolor: 'action.selected', borderRadius: 99 }}>
                <Box sx={{ 
                    position: 'absolute', 
                    left: 0, top: 0, bottom: 0, right: 0, 
                    background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)',
                    borderRadius: 99,
                    opacity: 0.5
                }} />
                <Box sx={{ 
                    position: 'absolute', 
                    left: `${Math.min(100, Math.max(0, fiftyTwoWeekPosition))}%`, 
                    top: -2, 
                    width: 2, 
                    height: 10, 
                    bgcolor: 'common.white',
                    borderRadius: 1
                }} />
            </Box>
            <Typography variant="caption" color="text.secondary" align="center" display="block" mt={0.5}>
                    Current: ${currentPrice.toFixed(2)} ({fiftyTwoWeekPosition.toFixed(0)}%)
            </Typography>
            </Box>
        )}
    </>
  );
}
