'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-500/20 text-gray-400',
  success: 'bg-green-500/20 text-green-400',
  danger: 'bg-red-500/20 text-red-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  info: 'bg-cyan-500/20 text-cyan-400'
};

const sizeStyles = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5'
};

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span className={`rounded ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
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
