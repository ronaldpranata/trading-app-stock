'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderTop?: string;
}

const variantStyles = {
  default: 'bg-gray-900/50 border-gray-800/50',
  success: 'bg-green-500/10 border-green-500/30',
  danger: 'bg-red-500/10 border-red-500/30',
  warning: 'bg-yellow-500/10 border-yellow-500/30',
  info: 'bg-cyan-500/10 border-cyan-500/30'
};

const paddingStyles = {
  none: '',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4'
};

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'lg',
  borderTop
}: CardProps) {
  return (
    <div 
      className={`rounded-xl border ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      style={borderTop ? { borderTopColor: borderTop, borderTopWidth: '3px' } : undefined}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ children, icon, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-300">{children}</h3>
      </div>
      {action}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
