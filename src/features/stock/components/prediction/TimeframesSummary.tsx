"use client";

import { TimeframePrediction } from '@/features/stock/types';
import { AccessTime, TrendingUp, TrendingDown } from '@mui/icons-material';
import { Box, Typography, Stack } from '@mui/material';

interface TimeframesSummaryProps {
  predictions: TimeframePrediction[];
  currentPrice: number;
}

export default function TimeframesSummary({ predictions, currentPrice }: TimeframesSummaryProps) {
  if (predictions.length <= 1) return null;

  const getLabel = (tf: string) => {
      switch(tf) {
          case 'day': return '1D';
          case 'week': return '1W';
          case 'month': return '1M';
          case 'quarter': return '3M';
          case 'year': return '1Y';
          default: return tf;
      }
  };

  return (
     <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
        <Typography variant="subtitle2" color="text.secondary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <AccessTime sx={{ fontSize: 16 }} /> All Timeframes
        </Typography>
        <Stack direction="row" justifyContent="space-between">
             {predictions.map((p, i) => {
                 const potential = ((p.targetPrice - currentPrice) / currentPrice) * 100;
                 const isUp = potential > 0;
                 return (
                    <Box key={i} textAlign="center">
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            {getLabel(p.timeframe)}
                        </Typography>
                        {isUp ? (
                            <TrendingUp sx={{ fontSize: 16, color: "#22c55e", display: 'block', margin: '0 auto 4px' }} />
                        ) : (
                            <TrendingDown sx={{ fontSize: 16, color: "#ef4444", display: 'block', margin: '0 auto 4px' }} />
                        )}
                        <Typography variant="caption" fontWeight="bold" color={isUp ? 'success.main' : 'error.main'}>
                            {potential > 0 ? '+' : ''}{potential.toFixed(1)}%
                        </Typography>
                    </Box>
                 );
             })}
        </Stack>
     </Box>
  );
}
