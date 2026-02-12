"use client";

import { TimeframePrediction } from '@/types/stock';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Box, Typography, Stack, LinearProgress } from '@mui/material';

interface PredictionDirectionCardProps {
  prediction: TimeframePrediction;
}

export default function PredictionDirectionCard({ prediction }: PredictionDirectionCardProps) {
  const isBullish = prediction.direction === 'BULLISH';

  return (
    <Box sx={{ 
        p: 2, 
        borderRadius: 2, 
        border: 1, 
        borderColor: isBullish ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
        bgcolor: isBullish ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)',
        mb: 3
    }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
             <Stack direction="row" alignItems="center" gap={1}>
                {isBullish ? <TrendingUp size={20} color="#22c55e" /> : <TrendingDown size={20} color="#ef4444" />}
                <Typography variant="h5" fontWeight="bold" color={isBullish ? 'success.main' : 'error.main'}>
                    {prediction.direction}
                </Typography>
             </Stack>
             <Box textAlign="right">
                 <Typography variant="caption" color="text.secondary">Confidence</Typography>
                 <Typography variant="h6" fontWeight="bold" color={prediction.confidence > 70 ? 'success.main' : 'warning.main'} sx={{ lineHeight: 1 }}>
                     {prediction.confidence.toFixed(0)}%
                 </Typography>
             </Box>
        </Stack>
        <LinearProgress 
            variant="determinate" 
            value={prediction.confidence} 
            color={prediction.confidence > 70 ? 'success' : 'warning'}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'action.selected' }} 
        />
    </Box>
  );
}
