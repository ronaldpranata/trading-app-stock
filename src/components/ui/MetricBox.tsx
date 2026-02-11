import { Box, Typography } from '@mui/material';

interface MetricBoxProps {
  label: string;
  value: number | string | undefined;
  format?: (v: number | string) => string;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
  colorize?: boolean;
  thresholds?: { good: number; bad: number; inverse?: boolean };
  className?: string;
}

export function MetricBox({
  label,
  value,
  format,
  suffix = '',
  size = 'md',
  colorize = false,
  thresholds,
  className = ''
}: MetricBoxProps) {
  
  const getColor = () => {
    if (!colorize || value === undefined || typeof value === 'string') return 'text.primary';
    
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    
    if (thresholds) {
      const isGood = thresholds.inverse ? numValue < thresholds.good : numValue > thresholds.good;
      const isBad = thresholds.inverse ? numValue > thresholds.bad : numValue < thresholds.bad;
      if (isGood) return 'success.main';
      if (isBad) return 'error.main';
      return 'text.primary';
    }
    
    if (numValue > 0) return 'success.main';
    if (numValue < 0) return 'error.main';
    return 'text.primary';
  };

  const displayValue = value !== undefined 
    ? (format ? format(value as number | string) : String(value)) + suffix
    : 'N/A';
    
  // Map size to typography variant
  const labelVariant = size === 'lg' ? 'caption' : 'caption';
  const valueVariant = size === 'lg' ? 'h5' : size === 'sm' ? 'body2' : 'body1';

  return (
    <Box className={`bg-gray-800/30 rounded-lg p-2 ${className}`} sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1 }}>
      <Typography variant={labelVariant} color="text.secondary" sx={{ fontSize: '0.7rem' }}>
        {label}
      </Typography>
      <Typography variant={valueVariant} fontWeight="bold" color={getColor()}>
        {displayValue}
      </Typography>
    </Box>
  );
}

interface MetricRowProps {
  label: string;
  value: number | string | undefined;
  format?: (v: number | string) => string;
  colorize?: boolean;
  thresholds?: { good: number; bad: number; inverse?: boolean };
}

export function MetricRow({
  label,
  value,
  format,
  colorize = false,
  thresholds
}: MetricRowProps) {
  const getColor = () => {
    if (!colorize || value === undefined || typeof value === 'string') return 'text.primary';
    
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    
    if (thresholds) {
      const isGood = thresholds.inverse ? numValue < thresholds.good : numValue > thresholds.good;
      const isBad = thresholds.inverse ? numValue > thresholds.bad : numValue < thresholds.bad;
      if (isGood) return 'success.main';
      if (isBad) return 'error.main';
    }
    
    if (numValue > 0) return 'success.main';
    if (numValue < 0) return 'error.main';
    return 'text.primary';
  };

  const displayValue = value !== undefined 
    ? (format ? format(value as number | string) : String(value))
    : 'N/A';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="bold" color={getColor()}>
        {displayValue}
      </Typography>
    </Box>
  );
}
