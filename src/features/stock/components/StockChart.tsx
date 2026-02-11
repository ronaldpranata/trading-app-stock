import { useState, useCallback, useMemo } from 'react';
import { HistoricalData, TechnicalIndicators } from '@/types/stock';
import { TimeRange } from '@/lib/constants';
import { LoadingCard } from '@/components/ui';
import { useChartData, PeriodSummary, MeasureDisplay, ChartControls, StockChartDisplay, PeriodStatsDisplay } from '@/components/charts';
import { useChartMeasure } from '@/hooks';
import { Card, CardContent, Typography, Box } from '@mui/material';

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

  const handleToggleMeasure = useCallback(() => {
    measure.toggle();
  }, [measure]);

  const handleToggleSMA = useCallback(() => {
    setShowSMA(prev => !prev);
  }, []);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
  }, []);

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
        {/* Controls (Memoized) */}
        <ChartControls 
          symbol={symbol}
          measureActive={measure.isActive}
          onToggleMeasure={handleToggleMeasure}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          showSMA={showSMA}
          onToggleSMA={handleToggleSMA}
          timeRangeOptions={TIME_RANGE_OPTIONS}
        />

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

        {/* Chart (Memoized) */}
        <StockChartDisplay 
          data={chartData}
          showSMA={showSMA}
          indicators={indicators}
          minPrice={minPrice}
          maxPrice={maxPrice}
          isPositive={!!isPositive}
          measure={measure}
          onChartClick={handleChartClick}
        />

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
