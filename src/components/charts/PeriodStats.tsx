'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatDate } from '@/lib/formatters';
import { PeriodStats } from './useChartData';

interface PeriodStatsDisplayProps {
  stats: PeriodStats;
  className?: string;
}

export function PeriodStatsDisplay({ stats, className = '' }: PeriodStatsDisplayProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 ${className}`}>
      {/* Max Drawdown */}
      <div className="bg-red-500/10 rounded-lg p-2 border border-red-500/20">
        <div className="flex items-center gap-1 text-[10px] text-red-400 mb-1">
          <ArrowDown className="w-3 h-3" />
          Max Drawdown
        </div>
        <div className="text-sm font-bold text-red-400">
          -{stats.maxDrawdown.toFixed(2)}%
        </div>
        <div className="text-[10px] text-gray-500">
          {formatDate(stats.drawdownStart)} → {formatDate(stats.drawdownEnd)}
        </div>
      </div>

      {/* Max Rally */}
      <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20">
        <div className="flex items-center gap-1 text-[10px] text-green-400 mb-1">
          <ArrowUp className="w-3 h-3" />
          Max Rally
        </div>
        <div className="text-sm font-bold text-green-400">
          +{stats.maxGain.toFixed(2)}%
        </div>
        <div className="text-[10px] text-gray-500">
          {formatDate(stats.gainStart)} → {formatDate(stats.gainEnd)}
        </div>
      </div>

      {/* Period Range */}
      <div className="bg-gray-800/30 rounded-lg p-2">
        <div className="text-[10px] text-gray-400 mb-1">Period Range</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500">High</div>
            <div className="text-xs font-bold text-green-400">${stats.periodHigh.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500">Low</div>
            <div className="text-xs font-bold text-red-400">${stats.periodLow.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Volatility & Win Rate */}
      <div className="bg-gray-800/30 rounded-lg p-2">
        <div className="text-[10px] text-gray-400 mb-1">Statistics</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500">Volatility</div>
            <div className={`text-xs font-bold ${stats.volatility > 30 ? 'text-red-400' : 'text-white'}`}>
              {stats.volatility.toFixed(1)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500">Win Rate</div>
            <div className={`text-xs font-bold ${stats.winRate > 50 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.winRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PeriodSummaryProps {
  stats: PeriodStats;
  className?: string;
}

export function PeriodSummary({ stats, className = '' }: PeriodSummaryProps) {
  const isPositive = stats.priceChangePercent >= 0;

  return (
    <div className={`rounded-lg p-3 border ${
      isPositive ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
    } ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
            <span className="text-2xl font-bold">
              {isPositive ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
            </span>
          </div>
          <div className="text-xs text-gray-400">
            <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
              {isPositive ? '+' : ''}${stats.priceChange.toFixed(2)}
            </span>
            <span className="mx-1">•</span>
            <span>{stats.tradingDays} days</span>
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="text-gray-400">
            {formatDate(stats.startDate)} → {formatDate(stats.endDate)}
          </div>
          <div className="text-gray-500">
            ${stats.startPrice.toFixed(2)} → ${stats.endPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
