"use client";

import { TechnicalIndicators } from '@/features/stock/types';
import { Box, Grid, Typography, Stack } from '@mui/material';

interface BollingerStochasticProps {
  bollingerBands: TechnicalIndicators['bollingerBands'];
  stochastic: TechnicalIndicators['stochastic'];
  atr: number;
}

export default function BollingerStochastic({ bollingerBands, stochastic, atr }: BollingerStochasticProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={6}>
           <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
               <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">Bollinger Bands</Typography>
               <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                       <Typography variant="caption" color="text.secondary">Upper</Typography>
                       <Typography variant="caption" color="error.main">${bollingerBands.upper.toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                       <Typography variant="caption" color="text.secondary">Middle</Typography>
                       <Typography variant="caption" color="text.primary">${bollingerBands.middle.toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                       <Typography variant="caption" color="text.secondary">Lower</Typography>
                       <Typography variant="caption" color="success.main">${bollingerBands.lower.toFixed(2)}</Typography>
                  </Stack>
               </Stack>
           </Box>
      </Grid>
      <Grid size={6}>
           <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
               <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">Stochastic</Typography>
               <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                       <Typography variant="caption" color="text.secondary">%K</Typography>
                       <Typography variant="caption" color={stochastic.k < 20 ? 'success.main' : stochastic.k > 80 ? 'error.main' : 'text.primary'}>
                          {stochastic.k.toFixed(1)}
                       </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                       <Typography variant="caption" color="text.secondary">%D</Typography>
                       <Typography variant="caption" color="text.primary">{stochastic.d.toFixed(1)}</Typography>
                  </Stack>
                   <Stack direction="row" justifyContent="space-between">
                       <Typography variant="caption" color="text.secondary">ATR</Typography>
                       <Typography variant="caption" color="text.primary">${atr.toFixed(2)}</Typography>
                  </Stack>
               </Stack>
           </Box>
      </Grid>
    </Grid>
  );
}
