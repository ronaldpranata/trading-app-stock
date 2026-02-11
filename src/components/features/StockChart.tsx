'use client';

import { useState, useCallback } from 'react';
import { HistoricalData, TechnicalIndicators } from '@/types/stock';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, ReferenceArea } from 'recharts';
import { TrendingUp, MousePointer2 } from 'lucide-react';
import { TimeRange } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import { LoadingCard } from '@/components/ui';
import { Button } from '@/components/ui';
import { TimeRangeSelector, useChartData, PeriodStatsDisplay, PeriodSummary, MeasureDisplay } from '@/components/charts';
import { useChartMeasure } from '@/hooks';
import { Card, CardContent, Box, Typography, Stack, IconButton, useTheme } from '@mui/material';

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
  const theme = useTheme();
  
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
      <Card sx={{ height: 384, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No chart data available</Typography>
      </Card>
    );
  }

  const minPrice = Math.min(...chartData.map(d => d.low)) * 0.98;
  const maxPrice = Math.max(...chartData.map(d => d.high)) * 1.02;
  const isPositive = periodStats && periodStats.priceChangePercent >= 0;

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: '16px !important' }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" gap={1}>
            <TrendingUp size={16} className="text-blue-400" />
            <Typography variant="subtitle2" fontWeight="bold">{symbol} Price Chart</Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" gap={1}>
            {/* Measure Mode Toggle */}
            <Button
              onClick={measure.toggle}
              variant={measure.isActive ? 'contained' : 'ghost'}
              size="small"
              title="Click two points on chart to measure"
              startIcon={<MousePointer2 size={12} />}
            >
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
              variant={showSMA ? 'contained' : 'ghost'}
              size="small"
            >
              SMA
            </Button>
          </Stack>
        </Stack>

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
        <Box sx={{ height: 224, cursor: measure.isActive ? 'crosshair' : 'default' }}>
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
        </Box>

        {/* Legend */}
        {showSMA && (
          <Stack direction="row" justifyContent="center" gap={2} mt={1}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Box sx={{ width: 12, height: 2, bgcolor: '#facc15' }} />
              <Typography variant="caption" color="text.secondary">SMA20</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Box sx={{ width: 12, height: 2, bgcolor: '#a855f7' }} />
              <Typography variant="caption" color="text.secondary">SMA50</Typography>
            </Stack>
          </Stack>
        )}

        {/* Period Statistics */}
        {periodStats && (
          <PeriodStatsDisplay stats={periodStats} className="mt-3 pt-3 border-t border-gray-800/50" />
        )}

        {/* Current Price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">Current Price</Typography>
          <Typography variant="body2" fontWeight="bold">${currentPrice.toFixed(2)}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
