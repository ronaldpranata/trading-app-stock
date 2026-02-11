import { Chip, ChipProps } from '@mui/material';
import { ReactNode } from 'react';

interface BadgeProps extends Omit<ChipProps, 'children' | 'variant'> {
  children: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export function Badge({ children, variant = 'default', size = 'small', className, ...props }: BadgeProps) {
  
  const getColor = () => {
    switch(variant) {
      case 'success': return 'success';
      case 'danger': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={children}
      size={size}
      color={getColor()}
      variant={variant === 'default' ? 'filled' : 'outlined'} // Style choice
      className={className}
      {...props}
    />
  );
}

interface StatusBadgeProps {
  status: 'live' | 'simulated' | 'loading' | 'error';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = {
    live: { text: 'LIVE', variant: 'success' as const },
    simulated: { text: 'SIM', variant: 'warning' as const },
    loading: { text: 'LOADING', variant: 'info' as const },
    error: { text: 'ERROR', variant: 'danger' as const }
  };

  const { text, variant } = config[status];
  return <Badge variant={variant} className={className}>{text}</Badge>;
}

interface AssetTypeBadgeProps {
  type: 'stock' | 'crypto';
  className?: string;
}

export function AssetTypeBadge({ type, className = '' }: AssetTypeBadgeProps) {
  return (
    <Badge 
      variant={type === 'crypto' ? 'warning' : 'info'} 
      className={className}
    >
      {type === 'crypto' ? 'CRYPTO' : 'STOCK'}
    </Badge>
  );
}
