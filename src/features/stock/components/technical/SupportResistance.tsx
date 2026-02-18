'use client';

import { Box, Chip, Stack, Typography } from '@mui/material';
import { SupportResistanceLevel } from '@/features/stock/types';

interface SupportResistanceProps {
  levels: SupportResistanceLevel[];
  currentPrice: number;
}

export default function SupportResistance({ levels, currentPrice }: SupportResistanceProps) {
  if (!levels || levels.length === 0) {
    return null;
  }

  // Support: below current price, sorted descending (closest to price first)
  const support = levels
    .filter(l => l.type === 'support')
    .sort((a, b) => b.level - a.level)
    .slice(0, 3); // Top 3

  // Resistance: above current price, sorted ascending (closest to price first)
  const resistance = levels
    .filter(l => l.type === 'resistance')
    .sort((a, b) => a.level - b.level)
    .slice(0, 3); // Top 3

  return (
    <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
      <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">
        key Levels
      </Typography>
      
      <Stack direction="row" spacing={2}>
        {/* Resistance Column */}
        <Box flex={1}>
           <Typography variant="caption" color="error.main" fontWeight="bold" mb={0.5} display="block">Resistance</Typography>
           <Stack spacing={0.5}>
             {resistance.length > 0 ? resistance.map((l, i) => (
                <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight="medium">${l.level.toFixed(2)}</Typography>
                  <Typography variant="caption" color="error.main">+{l.percentageDiff.toFixed(1)}%</Typography>
                </Stack>
             )) : (
                <Typography variant="caption" color="text.secondary">-</Typography>
             )}
           </Stack>
        </Box>

        {/* Support Column */}
        <Box flex={1}>
           <Typography variant="caption" color="success.main" fontWeight="bold" mb={0.5} display="block">Support</Typography>
           <Stack spacing={0.5}>
             {support.length > 0 ? support.map((l, i) => (
                <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight="medium">${l.level.toFixed(2)}</Typography>
                  <Typography variant="caption" color="success.main">-{l.percentageDiff.toFixed(1)}%</Typography>
                </Stack>
             )) : (
                <Typography variant="caption" color="text.secondary">-</Typography>
             )}
           </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
