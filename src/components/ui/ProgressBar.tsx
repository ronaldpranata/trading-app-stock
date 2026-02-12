'use client';

import { Box, LinearProgress, Typography, Stack, useTheme } from '@mui/material';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 4,
  md: 6,
  lg: 8
};

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className = ''
}: ProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <Box className={className} sx={{ width: '100%' }}>
      {showLabel && (
        <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">0</Typography>
          <Typography variant="caption" color="text.secondary">{max}</Typography>
        </Stack>
      )}
      <LinearProgress 
        variant="determinate" 
        value={normalizedValue} 
        color={color}
        sx={{ 
            height: sizeStyles[size], 
            borderRadius: sizeStyles[size] / 2,
            bgcolor: 'action.selected' 
        }}
      />
    </Box>
  );
}

interface ScoreBarProps {
  label: string;
  score: number;
  max?: number;
  showValue?: boolean;
  className?: string;
}

export function ScoreBar({ label, score, max = 100, showValue = true, className = '' }: ScoreBarProps) {
  const getColor = () => {
    const percentage = (score / max) * 100;
    if (percentage >= 60) return 'success';
    if (percentage <= 40) return 'error';
    return 'warning';
  };

  const statusColor = getColor();
  const textColor = statusColor === 'success' ? 'success.main' : statusColor === 'error' ? 'error.main' : 'warning.main';

  return (
    <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }} className={className}>
      <Stack direction="row" justifyContent="space-between" mb={0.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{label}</Typography>
        {showValue && (
          <Typography variant="caption" fontWeight="bold" sx={{ color: textColor, fontSize: '0.75rem' }}>
            {score.toFixed(0)}
          </Typography>
        )}
      </Stack>
      <LinearProgress 
         variant="determinate" 
         value={(score / max) * 100} 
         color={statusColor}
         sx={{ height: 6, borderRadius: 3, bgcolor: 'action.selected' }}
      />
    </Box>
  );
}

interface RangeIndicatorProps {
  value: number;
  min: number;
  max: number;
  showLabels?: boolean;
  className?: string;
}

export function RangeIndicator({ value, min, max, showLabels = true, className = '' }: RangeIndicatorProps) {
  const position = max > min ? ((value - min) / (max - min)) * 100 : 50;

  return (
    <Box className={className} sx={{ width: '100%' }}>
      {showLabels && (
        <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="error.main">${min.toFixed(2)}</Typography>
          <Typography variant="caption" color="success.main">${max.toFixed(2)}</Typography>
        </Stack>
      )}
      <Box sx={{ position: 'relative', height: 6, bgcolor: 'action.selected', borderRadius: 3 }}>
        <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            borderRadius: 3,
            background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)' // Gradient needs manual CSS or complicated variable usage
        }} />
        <Box 
            sx={{ 
                position: 'absolute', 
                height: 12, 
                width: 2, 
                bgcolor: 'common.white', 
                top: -3, 
                borderRadius: 1,
                left: `${Math.min(100, Math.max(0, position))}%`
            }} 
        />
      </Box>
    </Box>
  );
}
