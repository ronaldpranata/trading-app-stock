'use client';

import { CircularProgress, Box, Skeleton as MuiSkeleton, Paper } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number | string;
  className?: string;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
}

export function LoadingSpinner({ size = 24, className = '', color = 'primary' }: LoadingSpinnerProps) {
  return <CircularProgress size={size} color={color} className={className} />;
}

interface LoadingCardProps {
  height?: number | string;
  className?: string;
}

export function LoadingCard({ height = 256, className = '' }: LoadingCardProps) {
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.paper' 
      }}
      className={className}
    >
      <LoadingSpinner size={40} />
    </Paper>
  );
}

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  className?: string;
}

export function Skeleton({ width, height, variant = 'rounded', className = '' }: SkeletonProps) {
  return <MuiSkeleton variant={variant} width={width} height={height} animation="wave" className={className} sx={{ bgcolor: 'action.hover' }} />;
}

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className = '' }: SkeletonCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }} className={className}>
      <MuiSkeleton variant="rounded" width={96} height={24} sx={{ mb: 2, bgcolor: 'action.hover' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <MuiSkeleton 
            key={i} 
            variant="rounded" 
            height={16} 
            width={i === lines - 1 ? '75%' : '100%'} 
            sx={{ mb: 1, bgcolor: 'action.hover' }} 
        />
      ))}
    </Paper>
  );
}
