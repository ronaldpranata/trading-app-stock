'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  gradient: 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500'
};

const sizeStyles = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2'
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = ''
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>0</span>
          <span>{max}</span>
        </div>
      )}
      <div className={`bg-gray-700 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`h-full transition-all ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
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
    if (percentage >= 60) return { bar: 'bg-green-500', text: 'text-green-400' };
    if (percentage <= 40) return { bar: 'bg-red-500', text: 'text-red-400' };
    return { bar: 'bg-yellow-500', text: 'text-yellow-400' };
  };

  const colors = getColor();

  return (
    <div className={`bg-gray-800/30 rounded-lg p-2 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-400">{label}</span>
        {showValue && (
          <span className={`text-xs font-bold ${colors.text}`}>{score.toFixed(0)}</span>
        )}
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${colors.bar}`} style={{ width: `${(score / max) * 100}%` }} />
      </div>
    </div>
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
    <div className={className}>
      {showLabels && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-red-400">${min.toFixed(2)}</span>
          <span className="text-green-400">${max.toFixed(2)}</span>
        </div>
      )}
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden relative">
        <div className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full" />
        <div 
          className="absolute h-3 w-0.5 bg-white -top-0.5 rounded"
          style={{ left: `${Math.min(100, Math.max(0, position))}%` }}
        />
      </div>
    </div>
  );
}
