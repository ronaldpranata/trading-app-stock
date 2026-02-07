'use client';

import { ArrowUp, ArrowDown, X, MousePointer2 } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

interface MeasurementResult {
  startPoint: { date: string; price: number; index: number };
  endPoint: { date: string; price: number; index: number };
  priceChange: number;
  percentChange: number;
  days: number;
  isGain: boolean;
}

interface MeasureDisplayProps {
  isActive: boolean;
  firstClick: { date: string; price: number } | null;
  result: MeasurementResult | null;
  onClear: () => void;
  className?: string;
}

export function MeasureDisplay({
  isActive,
  firstClick,
  result,
  onClear,
  className = ''
}: MeasureDisplayProps) {
  if (!isActive) return null;

  if (result) {
    return (
      <div className={`rounded-lg p-3 border ${
        result.isGain 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-red-500/10 border-red-500/30'
      } ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {result.isGain ? (
                <ArrowUp className="w-5 h-5 text-green-400" />
              ) : (
                <ArrowDown className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-2xl font-bold ${result.isGain ? 'text-green-400' : 'text-red-400'}`}>
                {result.isGain ? '+' : ''}{result.percentChange.toFixed(2)}%
              </span>
              <span className={`text-sm ${result.isGain ? 'text-green-400' : 'text-red-400'}`}>
                ({result.isGain ? '+' : ''}${result.priceChange.toFixed(2)})
              </span>
            </div>
            <div className="text-xs text-gray-400">
              <span className="text-white">${result.startPoint.price.toFixed(2)}</span>
              <span className="mx-2">→</span>
              <span className="text-white">${result.endPoint.price.toFixed(2)}</span>
              <span className="mx-2">•</span>
              <span>{result.days} days</span>
              <span className="mx-2">•</span>
              <span>{formatDate(result.startPoint.date)} → {formatDate(result.endPoint.date)}</span>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Clear measurement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-3 border bg-cyan-500/10 border-cyan-500/30 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MousePointer2 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400">
            {firstClick 
              ? `First point: $${firstClick.price.toFixed(2)} (${formatDate(firstClick.date)}) - Click second point`
              : 'Click on chart to select first point'
            }
          </span>
        </div>
        {firstClick && (
          <button
            onClick={onClear}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
