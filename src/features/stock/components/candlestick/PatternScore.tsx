"use client";

import { Box, Typography, Stack, LinearProgress } from '@mui/material';

interface PatternScoreProps {
  score: number;
}

export default function PatternScore({ score }: PatternScoreProps) {
  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="text.secondary">Pattern Score</Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ 
          color: score >= 60 ? 'success.main' : score <= 40 ? 'error.main' : 'warning.main'
        }}>
          {score.toFixed(0)}
        </Typography>
      </Stack>
      <LinearProgress 
        variant="determinate" 
        value={score} 
        color={score >= 60 ? 'success' : score <= 40 ? 'error' : 'warning'}
        sx={{ height: 8, borderRadius: 4, bgcolor: 'action.selected' }}
      />
    </Box>
  );
}
