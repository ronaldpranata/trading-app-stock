"use client";

import { Box, Grid, Typography } from '@mui/material';
import { CandlestickPattern } from '@/types/stock';

interface PatternSummaryCountsProps {
  patterns: CandlestickPattern[];
}

export default function PatternSummaryCounts({ patterns }: PatternSummaryCountsProps) {
  const bullishPatterns = patterns.filter(p => p.direction === 'bullish');
  const bearishPatterns = patterns.filter(p => p.direction === 'bearish');
  const neutralPatterns = patterns.filter(p => p.direction === 'neutral');

  return (
    <Grid container spacing={1} mb={3}>
      <Grid size={{ xs: 4 }}>
        <Box sx={{ 
          bgcolor: 'rgba(34, 197, 94, 0.1)', 
          borderRadius: 2, 
          p: 1.5, 
          textAlign: 'center', 
          border: 1, 
          borderColor: 'rgba(34, 197, 94, 0.2)' 
        }}>
          <Typography variant="h6" fontWeight="bold" color="success.main">{bullishPatterns.length}</Typography>
          <Typography variant="caption" color="success.main">Bullish</Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 4 }}>
        <Box sx={{ 
          bgcolor: 'rgba(234, 179, 8, 0.1)', 
          borderRadius: 2, 
          p: 1.5, 
          textAlign: 'center', 
          border: 1, 
          borderColor: 'rgba(234, 179, 8, 0.2)' 
        }}>
          <Typography variant="h6" fontWeight="bold" color="warning.main">{neutralPatterns.length}</Typography>
          <Typography variant="caption" color="warning.main">Neutral</Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 4 }}>
        <Box sx={{ 
          bgcolor: 'rgba(239, 68, 68, 0.1)', 
          borderRadius: 2, 
          p: 1.5, 
          textAlign: 'center', 
          border: 1, 
          borderColor: 'rgba(239, 68, 68, 0.2)' 
        }}>
          <Typography variant="h6" fontWeight="bold" color="error.main">{bearishPatterns.length}</Typography>
          <Typography variant="caption" color="error.main">Bearish</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
