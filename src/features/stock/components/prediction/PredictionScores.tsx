"use client";

import { PredictionResult } from '@/features/stock/types';
import { Box, Typography, Stack, LinearProgress } from '@mui/material';

interface PredictionScoresProps {
  prediction: PredictionResult;
}

export default function PredictionScores({ prediction }: PredictionScoresProps) {
  const scores = [
      { label: 'Technical', score: prediction.technicalScore, color: '#eab308' },
      { label: 'Fundamental', score: prediction.fundamentalScore, color: '#eab308' },
      { label: 'Sentiment', score: prediction.sentimentScore || 50, color: '#22c55e' }
  ];

  return (
    <Stack direction="row" spacing={{ xs: 1, sm: 2 }} mb={3}>
         {scores.map((item, i) => (
             <Box key={i} sx={{ flex: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={0.5}>
                      <Typography variant="caption" color="text.secondary" noWrap>{item.label}</Typography>
                      <Typography variant="caption" fontWeight="bold" sx={{ color: item.color }}>{Math.round(item.score)}</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.score} 
                    sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: item.color } }} 
                  />
             </Box>
         ))}
    </Stack>
  );
}
