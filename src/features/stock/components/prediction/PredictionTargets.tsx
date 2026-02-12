"use client";

import { TimeframePrediction } from '@/types/stock';
import { Target, Shield } from 'lucide-react';
import { Box, Typography, Stack, Grid } from '@mui/material';

interface PredictionTargetsProps {
  prediction: TimeframePrediction;
  currentPrice: number;
}

export default function PredictionTargets({ prediction, currentPrice }: PredictionTargetsProps) {
  const profitPotential = ((prediction.targetPrice - currentPrice) / currentPrice) * 100;
  const riskPotential = ((currentPrice - prediction.stopLoss) / currentPrice) * 100;
  const riskRewardRatio = Math.abs(riskPotential) > 0 ? Math.abs(profitPotential / riskPotential) : 0;

  return (
    <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 6 }}>
           <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', border: 1, borderColor: 'divider' }}>
               <Stack direction="row" alignItems="center" gap={1} mb={1}>
                   <Target size={16} color="#9ca3af" />
                   <Typography variant="body2" color="text.secondary">Target Price</Typography>
               </Stack>
               <Typography variant="h6" fontWeight="bold" color="text.primary">
                    ${prediction.targetPrice.toFixed(2)}
               </Typography>
               <Typography variant="caption" color="success.main" fontWeight="bold">
                    {profitPotential > 0 ? '+' : ''}{profitPotential.toFixed(2)}%
               </Typography>
           </Box>
        </Grid>

        <Grid size={{ xs: 6 }}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', border: 1, borderColor: 'divider' }}>
               <Stack direction="row" alignItems="center" gap={1} mb={1}>
                   <Shield size={16} color="#9ca3af" />
                   <Typography variant="body2" color="text.secondary">Stop Loss</Typography>
               </Stack>
               <Typography variant="h6" fontWeight="bold" color="text.primary">
                    ${prediction.stopLoss.toFixed(2)}
               </Typography>
               <Typography variant="caption" color="text.secondary">
                    R/R: {riskRewardRatio.toFixed(2)}
               </Typography>
           </Box>
        </Grid>
    </Grid>
  );
}
