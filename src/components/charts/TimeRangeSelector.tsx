'use client';

interface TimeRangeOption {
  id: string;
  label: string;
  days: number;
}

interface TimeRangeSelectorProps {
  value: string;
  onChange: (range: string) => void;
  ranges: TimeRangeOption[];
  className?: string;
}

export function TimeRangeSelector({
  value,
  onChange,
  ranges,
  className = ''
}: TimeRangeSelectorProps) {
  return (
    <div className={`flex bg-gray-800/50 rounded-lg p-0.5 ${className}`}>
      {ranges.map(range => (
        <button
          key={range.id}
          onClick={() => onChange(range.id)}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
            value === range.id
              ? 'bg-blue-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
