"use client";

import { Box, Typography } from '@mui/material';

interface MetricBoxProps {
  label: string;
  value: number | undefined;
  format: (v: number) => string;
  good?: number;
  bad?: number;
  inverse?: boolean;
  small?: boolean;
  fullWidth?: boolean;
  prefix?: string;
  suffix?: string;
}

export default function MetricBox({ 
  label, 
  value, 
  format, 
  good, 
  bad, 
  inverse = false,
  small = false,
  fullWidth = false,
}: MetricBoxProps) {
  const getColor = () => {
    if (value === undefined || value === 0) return 'text.primary';
    if (good !== undefined && bad !== undefined) {
      const isGood = inverse ? value < good : value > good;
      const isBad = inverse ? value > bad : value < bad;
      if (isGood) return 'success.main';
      if (isBad) return 'error.main';
    }
    return 'text.primary';
  };

  return (
    <Box sx={{ 
        bgcolor: 'action.hover', 
        p: 1.5, 
        borderRadius: 1, 
        display: fullWidth ? 'flex' : 'block',
        alignItems: fullWidth ? 'center' : 'initial',
        justifyContent: fullWidth ? 'space-between' : 'initial'
    }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant={small ? "caption" : "body2"} fontWeight="bold" color={getColor()}>
        {value !== undefined ? format(value) : 'N/A'}
      </Typography>
    </Box>
  );
}
