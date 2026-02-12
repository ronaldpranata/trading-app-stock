"use client";

import { CandlestickPattern } from '@/types/stock';
import { Box, Typography, Stack, Chip } from '@mui/material';

interface PatternCardProps {
  pattern: CandlestickPattern;
  compact?: boolean;
}

export default function PatternCard({ pattern, compact = false }: PatternCardProps) {
  const getPatternStyles = (direction: string) => {
    switch (direction) {
      case 'bullish': return { bgcolor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)', color: 'success.main', chipBg: 'rgba(34, 197, 94, 0.1)' };
      case 'bearish': return { bgcolor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'error.main', chipBg: 'rgba(239, 68, 68, 0.1)' };
      default: return { bgcolor: 'rgba(234, 179, 8, 0.05)', borderColor: 'rgba(234, 179, 8, 0.2)', color: 'warning.main', chipBg: 'rgba(234, 179, 8, 0.1)' };
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.8) return 'success.main';
    if (reliability >= 0.65) return 'info.main';
    if (reliability >= 0.5) return 'warning.main';
    return 'text.secondary';
  };

  const styles = getPatternStyles(pattern.direction);

  if (compact) {
    return (
      <Box sx={{ 
        p: 1.5, 
        borderRadius: 2, 
        border: 1, 
        bgcolor: styles.bgcolor, 
        borderColor: styles.borderColor 
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" fontWeight="medium" sx={{ color: styles.color }}>
            {pattern.name}
          </Typography>
          <Typography variant="caption" sx={{ color: getReliabilityColor(pattern.reliability) }}>
            {(pattern.reliability * 100).toFixed(0)}%
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 2, 
      borderRadius: 2, 
      border: 1, 
      bgcolor: styles.bgcolor, 
      borderColor: styles.borderColor 
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="body2" fontWeight="medium" sx={{ color: styles.color }}>
          {pattern.name}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          <Chip 
            label={pattern.direction} 
            size="small" 
            sx={{ 
              bgcolor: styles.chipBg, 
              color: styles.color, 
              height: 20, 
              fontSize: '0.65rem',
              textTransform: 'capitalize' 
            }} 
          />
          <Typography variant="caption" fontWeight="medium" sx={{ color: getReliabilityColor(pattern.reliability) }}>
            {(pattern.reliability * 100).toFixed(0)}% reliable
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {pattern.description}
      </Typography>
    </Box>
  );
}
