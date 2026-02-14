import { memo } from 'react';
import { 
  LineChart, 
  LineSeriesType,
  AxisConfig,
  ChartsReferenceLine,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
  ChartsAxisHighlight
} from '@mui/x-charts';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { formatDate } from '@/lib/formatters';
import { TechnicalIndicators } from '@/features/stock/types';

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
  const theme = useTheme();

  // Prepare data for MUI X Charts
  const xData = data.map(d => new Date(d.date));
  const priceData = data.map(d => d.price);
  const sma20Data = data.map(d => d.sma20 > 0 ? d.sma20 : null);
  const sma50Data = data.map(d => d.sma50 > 0 ? d.sma50 : null);

  const series = [
    {
      type: 'line',
      data: priceData,
      label: 'Close',
      color: isPositive ? '#22c55e' : '#ef4444',
      showMark: (params: any) => measure.isActive && params.index === measure.firstClick?.index,
      area: true, // Enable area fill
      valueFormatter: (v: number | null) => v?.toFixed(2) || '',
    },
    ...(showSMA ? [
      {
        type: 'line',
        data: sma20Data,
        label: 'SMA20',
        color: '#facc15',
        showMark: false,
        dashStyle: [5, 5],
        valueFormatter: (v: number | null) => v?.toFixed(2) || '',
      },
      {
        type: 'line',
        data: sma50Data,
        label: 'SMA50',
        color: '#a855f7',
        showMark: false,
        dashStyle: [10, 5],
        valueFormatter: (v: number | null) => v?.toFixed(2) || '',
      }
    ] : [])
  ] as any[]; // Using any to bypass strict type checking for now due to complexity

  // Handle axis click to simulate Recharts behavior
  const handleAxisClick = (event: MouseEvent, data: any) => {
      // MUI X Charts provides index in the click event data
      // We need to map this back to our data source
      // Note: check the exact payload structure in documentation/logs
      if (data && typeof data.dataIndex === 'number') {
           const point = {
               payload: {
                   date: xData[data.dataIndex].toISOString(),
                   price: priceData[data.dataIndex],
                   index: data.dataIndex
               }
           };
           // Wrap in a structure similar to what StockChart expects
           onChartClick({ activePayload: [point] });
      }
  };

  return (
    <>
      <Box sx={{ height: 300, width: '100%', cursor: measure.isActive ? 'crosshair' : 'default' }}>
        <LineChart
            xAxis={[{ 
                data: xData, 
                scaleType: 'time', 
                valueFormatter: (date: Date) => {
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    return `${month}-${day}`;
                },
                min: xData[0]?.getTime(),
                max: xData[xData.length-1]?.getTime(),
            }]}
            yAxis={[{
                min: minPrice,
                max: maxPrice,
                valueFormatter: (value: number) => `$${value.toFixed(0)}`,
            }]}
            series={series.map(s => ({ ...s, curve: 'catmullRom' }))}
            height={300}
            margin={{ top: 10, bottom: 20, left: 50, right: 10 }}
            grid={{ horizontal: true }}
            onAxisClick={handleAxisClick}
            sx={{
                '.MuiAreaElement-root': {
                    fill: `url(#priceGradient-${isPositive ? 'up' : 'down'})`,
                },
                '.MuiChartsGrid-line': {
                    strokeDasharray: '4 4',
                    stroke: '#374151 !important', // gray-700
                },
                 // Animation simulation for line drawing
                '.MuiLineElement-root': {
                    strokeDasharray: 2000,
                    strokeDashoffset: 2000,
                    animation: 'draw 1.5s ease-out forwards',
                },
                '@keyframes draw': {
                    'to': {
                        strokeDashoffset: 0,
                    }
                }
            }}
        >
             <defs>
              <linearGradient id="priceGradient-up" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="priceGradient-down" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <ChartsAxisHighlight x="line" />
            <ChartsTooltip />
            
            {/* Reference Lines for Measure Tool */}
            {measure.firstClick && (
                 <ChartsReferenceLine 
                    x={new Date(measure.firstClick.date)} 
                    lineStyle={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '3 3' }} 
                 />
            )}
            {measure.secondClick && (
                 <ChartsReferenceLine 
                    x={new Date(measure.secondClick.date)} 
                    lineStyle={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '3 3' }} 
                 />
            )}
             {/* Bollinger Bands Reference Lines */}
             {indicators?.bollingerBands && (
                <>
                    <ChartsReferenceLine y={indicators.bollingerBands.upper} lineStyle={{ stroke: '#374151', strokeDasharray: '2 2' }} />
                    <ChartsReferenceLine y={indicators.bollingerBands.lower} lineStyle={{ stroke: '#374151', strokeDasharray: '2 2' }} />
                </>
             )}
        </LineChart>
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
