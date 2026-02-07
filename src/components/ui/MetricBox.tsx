'use client';

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
    if (!colorize || value === undefined || typeof value === 'string') return 'text-white';
    
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    
    if (thresholds) {
      const isGood = thresholds.inverse ? numValue < thresholds.good : numValue > thresholds.good;
      const isBad = thresholds.inverse ? numValue > thresholds.bad : numValue < thresholds.bad;
      if (isGood) return 'text-green-400';
      if (isBad) return 'text-red-400';
      return 'text-white';
    }
    
    // Default: positive is green, negative is red
    if (numValue > 0) return 'text-green-400';
    if (numValue < 0) return 'text-red-400';
    return 'text-white';
  };

  const sizeStyles = {
    sm: { label: 'text-[10px]', value: 'text-xs' },
    md: { label: 'text-[10px]', value: 'text-sm' },
    lg: { label: 'text-xs', value: 'text-lg' }
  };

  const displayValue = value !== undefined 
    ? (format ? format(value as number | string) : String(value)) + suffix
    : 'N/A';

  return (
    <div className={`bg-gray-800/30 rounded-lg p-2 ${className}`}>
      <div className={`text-gray-500 ${sizeStyles[size].label}`}>{label}</div>
      <div className={`font-bold ${sizeStyles[size].value} ${getColor()}`}>
        {displayValue}
      </div>
    </div>
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
    if (!colorize || value === undefined || typeof value === 'string') return 'text-white';
    
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    
    if (thresholds) {
      const isGood = thresholds.inverse ? numValue < thresholds.good : numValue > thresholds.good;
      const isBad = thresholds.inverse ? numValue > thresholds.bad : numValue < thresholds.bad;
      if (isGood) return 'text-green-400';
      if (isBad) return 'text-red-400';
    }
    
    if (numValue > 0) return 'text-green-400';
    if (numValue < 0) return 'text-red-400';
    return 'text-white';
  };

  const displayValue = value !== undefined 
    ? (format ? format(value as number | string) : String(value))
    : 'N/A';

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-sm font-bold ${getColor()}`}>{displayValue}</span>
    </div>
  );
}
