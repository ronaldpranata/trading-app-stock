"use client";

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Box, Grid, Typography, Stack } from '@mui/material';

interface MovingAveragesProps {
  sma20: number;
  sma50: number;
  sma200: number;
  currentPrice: number;
}

export default function MovingAverages({ sma20, sma50, sma200, currentPrice }: MovingAveragesProps) {
  return (
    <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
      <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">Moving Averages</Typography>
      <Grid container spacing={1}>
        <Grid size={4}>
            <Typography variant="caption" color="text.secondary" display="block">SMA20</Typography>
            <Typography variant="body2" fontWeight="bold" color={currentPrice > sma20 ? 'success.main' : 'error.main'}>
              ${sma20.toFixed(2)}
            </Typography>
        </Grid>
        <Grid size={4}>
            <Typography variant="caption" color="text.secondary" display="block">SMA50</Typography>
             <Typography variant="body2" fontWeight="bold" color={currentPrice > sma50 ? 'success.main' : 'error.main'}>
              ${sma50.toFixed(2)}
            </Typography>
        </Grid>
        <Grid size={4}>
             <Typography variant="caption" color="text.secondary" display="block">SMA200</Typography>
             <Typography variant="body2" fontWeight="bold" color={currentPrice > sma200 ? 'success.main' : 'error.main'}>
              ${sma200.toFixed(2)}
            </Typography>
        </Grid>
      </Grid>
      <Box mt={1}>
           {sma50 > sma200 ? (
            <Stack direction="row" alignItems="center" gap={0.5}>
              <TrendingUp size={12} color="#4ade80" /> 
              <Typography variant="caption" color="success.main">Golden Cross Active</Typography>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center" gap={0.5}>
              <TrendingDown size={12} color="#f87171" />
              <Typography variant="caption" color="error.main">Death Cross Active</Typography>
            </Stack>
          )}
      </Box>
    </Box>
  );
}
