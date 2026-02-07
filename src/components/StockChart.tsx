'use client';

import { useState, useCallback } from 'react';
import { HistoricalData, TechnicalIndicators } from '@/types/stock';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, ReferenceArea } from 'recharts';
import { TrendingUp, MousePointer2 } from 'lucide-react';
import { TimeRange } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import { LoadingCard } from '@/components/ui';
import { Button, ButtonGroup, ToggleButton } from '@/components/ui';
import { TimeRangeSelector, useChartData, PeriodStatsDisplay, PeriodSummary, MeasureDisplay } from '@/components/charts';
import { useChartMeasure } from '@/hooks';

interface StockChartProps {
  data: HistoricalData[];
  indicators: TechnicalIndicators | null;
  currentPrice: number;
  symbol: string;
  isLoading: boolean;
}

const TIME_RANGE_OPTIONS: { id: TimeRange; label: string; days: number }[] = [
  { id: '1M', label: '1M', days: 22 },
  { id: '3M', label: '3M', days: 66 },
  { id: '6M', label: '6M', days: 132 },
  { id: '1Y', label: '1Y', days: 252 },
  { id: 'YTD', label: 'YTD', days: 0 }
];

export default function StockChart({ data, indicators, currentPrice, symbol, isLoading }: StockChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [showSMA, setShowSMA] = useState(true);
  
  const measure = useChartMeasure();
  const { chartData, periodStats } = useChartData(data, timeRange);

  const handleChartClick = useCallback((e: any) => {
    if (!measure.isActive || !e || !e.activePayload || e.activePayload.length === 0) return;

    const payload = e.activePayload[0].payload;
    measure.handleClick({
      date: payload.date,
      price: payload.price,
      index: payload.index
    });
  }, [measure]);

  if (isLoading) {
    return <LoadingCard height="h-96" />;
  }

  if (!data || data.length === 0 || chartData.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50 h-96 flex items-center justify-center">
        <p className="text-gray-400">No chart data available</p>
      </div>
    );
  }

  const minPrice = Math.min(...chartData.map(d => d.low)) * 0.98;
  const maxPrice = Math.max(...chartData.map(d => d.high)) * 1.02;
  const isPositive = periodStats && periodStats.priceChangePercent >= 0;

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-300">{symbol} Price Chart</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Measure Mode Toggle */}
          <Button
            onClick={measure.toggle}
            variant={measure.isActive ? 'primary' : 'ghost'}
            size="sm"
            title="Click two points on chart to measure"
          >
            <MousePointer2 className="w-3 h-3" />
            Measure
          </Button>

          {/* Time Range Selector */}
          <TimeRangeSelector
            value={timeRange}
            onChange={(range) => setTimeRange(range as TimeRange)}
            ranges={TIME_RANGE_OPTIONS}
          />
          
          <Button
            onClick={() => setShowSMA(!showSMA)}
            variant={showSMA ? 'default' : 'ghost'}
            size="sm"
          >
            SMA
          </Button>
        </div>
      </div>

      {/* Measure Display */}
      <MeasureDisplay
        isActive={measure.isActive}
        firstClick={measure.firstClick}
        result={measure.result}
        onClear={measure.clear}
        className="mb-3"
      />

      {/* Period Summary */}
      {periodStats && !measure.isActive && (
        <PeriodSummary stats={periodStats} className="mb-3" />
      )}

      {/* Chart */}
      <div className={`h-56 ${measure.isActive ? 'cursor-crosshair' : ''}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} onClick={handleChartClick}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickFormatter={(value) => formatDate(value)}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={50}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`,
                name === 'price' ? 'Close' : name === 'sma20' ? 'SMA20' : name === 'sma50' ? 'SMA50' : name
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            
            {/* Selection highlight area */}
            {measure.firstClick && measure.secondClick && (
              <ReferenceArea
                x1={measure.firstClick.index < measure.secondClick.index ? measure.firstClick.date : measure.secondClick.date}
                x2={measure.firstClick.index < measure.secondClick.index ? measure.secondClick.date : measure.firstClick.date}
                fill={measure.result?.isGain ? '#22c55e' : '#ef4444'}
                fillOpacity={0.1}
              />
            )}
            
            {/* Click markers */}
            {measure.firstClick && (
              <ReferenceLine x={measure.firstClick.date} stroke="#06b6d4" strokeWidth={2} strokeDasharray="3 3" />
            )}
            {measure.secondClick && (
              <ReferenceLine x={measure.secondClick.date} stroke="#06b6d4" strokeWidth={2} strokeDasharray="3 3" />
            )}

            <Area
              type="monotone"
              dataKey="price"
              stroke="transparent"
              fill="url(#priceGradient)"
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#22c55e' : '#ef4444'}
              strokeWidth={2}
              dot={false}
              activeDot={measure.isActive ? { r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 } : false}
            />
            {showSMA && chartData.some(d => d.sma20 > 0) && (
              <Line type="monotone" dataKey="sma20" stroke="#facc15" strokeWidth={1} dot={false} strokeDasharray="3 3" />
            )}
            {showSMA && chartData.some(d => d.sma50 > 0) && (
              <Line type="monotone" dataKey="sma50" stroke="#a855f7" strokeWidth={1} dot={false} strokeDasharray="5 5" />
            )}
            {indicators?.bollingerBands && (
              <>
                <ReferenceLine y={indicators.bollingerBands.upper} stroke="#374151" strokeDasharray="2 2" />
                <ReferenceLine y={indicators.bollingerBands.lower} stroke="#374151" strokeDasharray="2 2" />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showSMA && (
        <div className="flex items-center justify-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-yellow-400" />
            <span className="text-gray-400">SMA20</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-purple-400" />
            <span className="text-gray-400">SMA50</span>
          </div>
        </div>
      )}

      {/* Period Statistics */}
      {periodStats && (
        <PeriodStatsDisplay stats={periodStats} className="mt-3 pt-3 border-t border-gray-800/50" />
      )}

      {/* Current Price */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50 text-xs">
        <span className="text-gray-400">Current Price</span>
        <span className="font-bold text-white">${currentPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
