'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceChangeProps {
  change: number;
  changePercent: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showDollar?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg'
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
};

export function PriceChange({
  change,
  changePercent,
  size = 'md',
  showIcon = true,
  showDollar = true,
  className = ''
}: PriceChangeProps) {
  const isPositive = change >= 0;
  const color = isPositive ? 'text-green-400' : 'text-red-400';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={`flex items-center gap-1 ${color} ${sizeStyles[size]} ${className}`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      <span className="font-semibold">
        {showDollar && (
          <>{isPositive ? '+' : ''}{change.toFixed(2)} </>
        )}
        ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
      </span>
    </div>
  );
}

interface DirectionBadgeProps {
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function DirectionBadge({
  direction,
  size = 'md',
  showIcon = true,
  className = ''
}: DirectionBadgeProps) {
  const config = {
    BULLISH: { color: 'text-green-400', bg: 'bg-green-500/10', Icon: TrendingUp },
    BEARISH: { color: 'text-red-400', bg: 'bg-red-500/10', Icon: TrendingDown },
    NEUTRAL: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', Icon: Minus }
  };

  const { color, bg, Icon } = config[direction];

  return (
    <div className={`flex items-center gap-1 ${color} ${sizeStyles[size]} ${className}`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      <span className="font-bold">{direction}</span>
    </div>
  );
}

interface PercentChangeBadgeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PercentChangeBadge({ value, size = 'md', className = '' }: PercentChangeBadgeProps) {
  const isPositive = value >= 0;
  const color = isPositive ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10';

  return (
    <span className={`px-2 py-0.5 rounded ${color} ${sizeStyles[size]} font-medium ${className}`}>
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}
