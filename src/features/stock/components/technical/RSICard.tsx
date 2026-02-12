"use client";

import { Box, Typography, Stack, Chip } from '@mui/material';

interface RSICardProps {
  rsi: number;
}

export default function RSICard({ rsi }: RSICardProps) {
  const getRSIColor = (val: number) => {
    if (val < 30) return 'success';
    if (val > 70) return 'error';
    return 'warning';
  };

  const getRSILabel = (val: number) => {
    if (val < 30) return 'Oversold';
    if (val > 70) return 'Overbought';
    return 'Neutral';
  };

  const color = getRSIColor(rsi);

  return (
    <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
       <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="caption" color="text.secondary" fontWeight="medium">RSI (14)</Typography>
          <Chip label={getRSILabel(rsi)} size="small" color={color} variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
       </Stack>
       <Typography variant="h5" fontWeight="bold" color={`${color}.main`}>
          {rsi.toFixed(1)}
       </Typography>
       <Box sx={{ height: 6, bgcolor: 'action.selected', borderRadius: 99, mt: 1, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ 
              position: 'absolute', 
              height: '100%', 
              width: `${Math.min(100, Math.max(0, rsi))}%`, 
              bgcolor: rsi < 30 ? 'success.main' : rsi > 70 ? 'error.main' : 'warning.main',
              transition: 'width 0.5s ease'
          }} />
       </Box>
    </Box>
  );
}
