import { memo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area, 
  Line, 
  ReferenceLine, 
  ReferenceArea 
} from 'recharts';
import { Box, Stack, Typography } from '@mui/material';
import { formatDate } from '@/lib/formatters';
import { TechnicalIndicators } from '@/types/stock';

interface ChartDataPoint {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  sma20: number;
  sma50: number;
  index: number;
}

interface StockChartDisplayProps {
  data: ChartDataPoint[];
  showSMA: boolean;
  indicators: TechnicalIndicators | null;
  minPrice: number;
  maxPrice: number;
  isPositive: boolean;
  measure: {
    isActive: boolean;
    firstClick: { date: string; price: number; index: number } | null;
    secondClick: { date: string; price: number; index: number } | null;
    result: { isGain: boolean } | null;
  };
  onChartClick: (e: any) => void;
}

function StockChartDisplay({ 
  data, 
  showSMA, 
  indicators, 
  minPrice, 
  maxPrice, 
  isPositive, 
  measure, 
  onChartClick 
}: StockChartDisplayProps) {
  return (
    <>
      <Box sx={{ height: 224, cursor: measure.isActive ? 'crosshair' : 'default' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} onClick={onChartClick}>
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
              minTickGap={30}
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={40}
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
            {showSMA && data.some(d => d.sma20 > 0) && (
              <Line type="monotone" dataKey="sma20" stroke="#facc15" strokeWidth={1} dot={false} strokeDasharray="3 3" />
            )}
            {showSMA && data.some(d => d.sma50 > 0) && (
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
    </>
  );
}

export default memo(StockChartDisplay);
