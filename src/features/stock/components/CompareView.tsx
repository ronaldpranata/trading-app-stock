'use client';

import { useState, useMemo } from 'react';
import { StockQuote, HistoricalData, FundamentalData, TechnicalIndicators, PredictionResult, StockData } from '@/types/stock';
import { TrendingUp, TrendingDown, Brain, BarChart3 } from 'lucide-react';
import { LineChart } from '@mui/x-charts';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from '@mui/material';

import { useStock } from '@/hooks';

type TimeRange = '1M' | '3M' | '6M' | '1Y';

const TIME_RANGES: { id: TimeRange; label: string; days: number }[] = [
  { id: '1M', label: '1M', days: 22 },
  { id: '3M', label: '3M', days: 66 },
  { id: '6M', label: '6M', days: 132 },
  { id: '1Y', label: '1Y', days: 252 },
];

const COLORS = [
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#f97316', // Orange
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#eab308', // Yellow
];

export default function CompareView() {
  const { primaryStock, compareStocks } = useStock();
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  
  // Guard clause for when primaryStock might be null (though usually loaded by page.tsx)
  const safePrimaryStock = primaryStock || { 
      symbol: "Loading...", 
      quote: null, 
      historicalData: [], 
      fundamentalData: null, 
      technicalIndicators: null, 
      prediction: null,
      isLoading: true,
      error: null
  };

  const allStocks = useMemo(() => [safePrimaryStock, ...compareStocks], [safePrimaryStock, compareStocks]);
  const theme = useTheme();

  // Prepare chart data with time range
  const { xData, seriesData, performanceData } = useMemo(() => {
    const range = TIME_RANGES.find(r => r.id === timeRange);
    const days = range?.days || 66;

    const allDates = new Set<string>();
    allStocks.forEach(stock => {
      stock.historicalData.slice(-days).forEach(d => allDates.add(d.date));
    });

    const sortedDates = Array.from(allDates).sort();
    
    // Prepare series data for MUI X Charts
    const seriesData = allStocks.map((stock, index) => {
        const filteredData = stock.historicalData.slice(-days);
        const firstPrice = filteredData[0]?.close || 1;
        
        // Map dates to values, handling missing data points
        const data = sortedDates.map(date => {
            const dayData = filteredData.find(d => d.date === date);
            if (dayData) {
                return ((dayData.close - firstPrice) / firstPrice) * 100;
            }
            return null;
        });

        return {
            type: 'line' as const,
            data,
            label: stock.symbol,
            color: COLORS[index % COLORS.length],
            showMark: false,
            valueFormatter: (v: number | null) => v !== null ? `${v.toFixed(2)}%` : '',
        };
    });

    // Calculate performance metrics for each stock
    interface PerformanceMetric {
      symbol: string;
      color: string;
      change: number;
      maxDrawdown: number;
      maxGain: number;
      volatility: number;
      high: number;
      low: number;
    }

    const performanceData: PerformanceMetric[] = allStocks.map((stock, index) => {
      const filteredData = stock.historicalData.slice(-days);
      if (filteredData.length === 0) return null;

      const firstPrice = filteredData[0].close;
      const lastPrice = filteredData[filteredData.length - 1].close;
      const change = ((lastPrice - firstPrice) / firstPrice) * 100;

      // Max drawdown
      let maxDrawdown = 0;
      let peak = filteredData[0].high;
      for (const d of filteredData) {
        if (d.high > peak) peak = d.high;
        const drawdown = (peak - d.low) / peak;
        if (drawdown > maxDrawdown) maxDrawdown = drawdown;
      }

      // Max gain
      let maxGain = 0;
      let trough = filteredData[0].low;
      for (const d of filteredData) {
        if (d.low < trough) trough = d.low;
        const gain = (d.high - trough) / trough;
        if (gain > maxGain) maxGain = gain;
      }

      // Volatility
      const returns: number[] = [];
      for (let i = 1; i < filteredData.length; i++) {
        returns.push((filteredData[i].close - filteredData[i - 1].close) / filteredData[i - 1].close);
      }
      const returnsSum = returns.reduce((a, b) => a + b, 0); 
      const avgReturn = returns.length > 0 ? returnsSum / returns.length : 0;
      const variance = returns.length > 0 ? returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length : 0;
      const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100;

      return {
        symbol: stock.symbol,
        color: COLORS[index % COLORS.length],
        change,
        maxDrawdown: maxDrawdown * 100,
        maxGain: maxGain * 100,
        volatility,
        high: Math.max(...filteredData.map(d => d.high)),
        low: Math.min(...filteredData.map(d => d.low))
      };
    }).filter((item): item is PerformanceMetric => item !== null);

    return { xData: sortedDates, seriesData, performanceData };
  }, [allStocks, timeRange]);

  const formatNum = (n: number) => {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(1) + 'T';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    return '$' + n.toFixed(2);
  };

  return (
    <Stack spacing={3}>
      {/* Price Comparison Cards */}
      <Grid container spacing={2}>
        {allStocks.map((stock, index) => (
          <Grid size={{xs:12,md:4}} key={stock.symbol}>
            <PriceCard stock={stock} color={COLORS[index % COLORS.length]} />
          </Grid>
        ))}
        {allStocks.length < 3 && (
          <Grid size={{xs:12,md:4}}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderStyle: 'dashed' }}>
               <Typography color="text.secondary" variant="body2">Search to add another stock</Typography>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Performance Chart */}
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Stack direction="row" alignItems="center" gap={1}>
              <BarChart3 size={18} color="#60a5fa" />
              <Typography variant="subtitle2" fontWeight="bold">Price Performance (% Change)</Typography>
            </Stack>
            
            <ToggleButtonGroup 
              value={timeRange}
              exclusive
              onChange={(_, val) => val && setTimeRange(val)}
              size="small"
              sx={{ 
                height: 32,
                '& .MuiToggleButton-root': {
                    px: 2,
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    '&.Mui-selected': {
                        color: 'primary.main',
                        bgcolor: 'action.selected'
                    }
                }
              }}
            >
              {TIME_RANGES.map(range => (
                <ToggleButton key={range.id} value={range.id}>
                  {range.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          {/* Performance Summary Cards */}
          <Grid container spacing={2} mb={3}>
            {performanceData.map((perf) => (
              <Grid size={{xs:12,md:4}} key={perf.symbol}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: perf.change >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: 1,
                    borderColor: perf.change >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    borderRadius: 2
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography fontWeight="bold" sx={{ color: perf.color }}>{perf.symbol}</Typography>
                    <Typography variant="h6" fontWeight="bold" color={perf.change >= 0 ? 'success.main' : 'error.main'}>
                      {perf.change >= 0 ? '+' : ''}{perf.change.toFixed(2)}%
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                     <Box>
                       <Typography variant="caption" color="text.secondary">Max DD</Typography>
                       <Typography variant="body2" color="error.main" fontWeight="medium">-{perf.maxDrawdown.toFixed(1)}%</Typography>
                     </Box>
                     <Box textAlign="right">
                       <Typography variant="caption" color="text.secondary">Max Rally</Typography>
                       <Typography variant="body2" color="success.main" fontWeight="medium">+{perf.maxGain.toFixed(1)}%</Typography>
                     </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ height: 300, width: '100%' }}>
            <LineChart
                key={timeRange}
                xAxis={[{ 
                    data: xData.map(d => new Date(d)), 
                    scaleType: 'time', 
                    valueFormatter: (date: Date) => {
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        return `${month}-${day}`;
                    },
                    min: new Date(xData[0]).getTime(),
                    max: new Date(xData[xData.length-1]).getTime(),
                }]}
                yAxis={[{
                    valueFormatter: (value: number) => `${value.toFixed(0)}%`,
                }]}
                series={seriesData.map(s => ({ ...s, curve: 'catmullRom' }))}
                height={300}
                margin={{ top: 10, bottom: 20, left: 50, right: 10 }}
                grid={{ horizontal: true }}
                sx={{
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
            />
          </Box>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Metric</TableCell>
              {allStocks.map((stock, index) => (
                <TableCell key={stock.symbol} align="right" sx={{ color: COLORS[index % COLORS.length], fontWeight: 'bold' }}>
                  {stock.symbol}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <CompareRow 
              label="Price" 
              values={allStocks.map(s => s.quote?.price ? `$${s.quote.price.toFixed(2)}` : '-')} 
            />
            <CompareRow 
              label={`${timeRange} Change`}
              values={performanceData.map(p => p.change)}
              format={(v) => v !== undefined && typeof v === 'number' ? `${v >= 0 ? '+' : ''}${v.toFixed(2)}%` : '-'}
              colorize
            />
            <CompareRow 
              label="Max Drawdown"
              values={performanceData.map(p => p.maxDrawdown)}
              format={(v) => v !== undefined && typeof v === 'number' ? `-${v.toFixed(1)}%` : '-'}
              colorize
              thresholds={{ good: 10, bad: 20, inverse: true }}
            />
            <CompareRow 
              label="Max Rally"
              values={performanceData.map(p => p.maxGain)}
              format={(v) => v !== undefined && typeof v === 'number' ? `+${v.toFixed(1)}%` : '-'}
              colorize
              thresholds={{ good: 20, bad: 5 }}
            />
            <CompareRow 
              label="Volatility"
              values={performanceData.map(p => p.volatility)}
              format={(v) => v !== undefined && typeof v === 'number' ? `${v.toFixed(1)}%` : '-'}
              colorize
              thresholds={{ good: 20, bad: 40, inverse: true }}
            />
            <CompareRow 
              label="Market Cap" 
              values={allStocks.map(s => s.fundamentalData?.marketCap)}
              format={(v) => v !== undefined && typeof v === 'number' ? formatNum(v) : '-'}
            />
            <CompareRow 
              label="P/E Ratio" 
              values={allStocks.map(s => s.fundamentalData?.peRatio)}
              format={(v) => v !== undefined && typeof v === 'number' && v > 0 ? v.toFixed(1) : '-'}
            />
            <CompareRow 
              label="PEG Ratio" 
              values={allStocks.map(s => s.fundamentalData?.pegRatio)}
              format={(v) => v !== undefined && typeof v === 'number' && v > 0 ? v.toFixed(2) : '-'}
              colorize
              thresholds={{ good: 1, bad: 2, inverse: true }}
            />
            <CompareRow 
              label="EPS Growth" 
              values={allStocks.map(s => s.fundamentalData?.epsGrowth)}
              format={(v) => v !== undefined && typeof v === 'number' ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` : '-'}
              colorize
            />
            <CompareRow 
              label="ROE" 
              values={allStocks.map(s => s.fundamentalData?.roe)}
              format={(v) => v !== undefined && typeof v === 'number' ? `${v.toFixed(1)}%` : '-'}
              colorize
              thresholds={{ good: 15, bad: 5 }}
            />
            <CompareRow 
              label="Profit Margin" 
              values={allStocks.map(s => s.fundamentalData?.profitMargin)}
              format={(v) => v !== undefined && typeof v === 'number' ? `${v.toFixed(1)}%` : '-'}
              colorize
              thresholds={{ good: 15, bad: 5 }}
            />
            <CompareRow 
              label="RSI" 
              values={allStocks.map(s => s.technicalIndicators?.rsi)}
              format={(v) => v !== undefined && typeof v === 'number' ? v.toFixed(1) : '-'}
              colorize
              thresholds={{ good: 30, bad: 70, inverse: true }}
            />
            <CompareRow 
              label="Technical Score" 
              values={allStocks.map(s => s.prediction?.technicalScore)}
              format={(v) => v !== undefined && typeof v === 'number' ? v.toFixed(0) : '-'}
              colorize
              thresholds={{ good: 60, bad: 40 }}
            />
            <CompareRow 
              label="Fundamental Score" 
              values={allStocks.map(s => s.prediction?.fundamentalScore)}
              format={(v) => v !== undefined && typeof v === 'number' ? v.toFixed(0) : '-'}
              colorize
              thresholds={{ good: 60, bad: 40 }}
            />
          </TableBody>
        </Table>
      </TableContainer>

      {/* Prediction Comparison */}
      <Grid container spacing={2}>
        {allStocks.map((stock, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={stock.symbol}>
            <PredictionCard stock={stock} color={COLORS[index % COLORS.length]} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

// Price Card Component
function PriceCard({ stock, color }: { stock: StockData; color: string }) {
  if (!stock.quote) {
    return (
      <Card variant="outlined" sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Card>
    );
  }

  const isPositive = stock.quote.change >= 0;

  return (
    <Card elevation={0} sx={{ borderTop: 3, borderTopColor: color, borderLeft: 1, borderRight: 1, borderBottom: 1, borderColor: 'divider' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="bold" sx={{ color }}>{stock.symbol}</Typography>
          {stock.quote.simulated && (
             <Chip label="SIM" size="small" color="warning" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
          )}
        </Stack>
        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
          ${stock.quote.price.toFixed(2)}
        </Typography>
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ color: isPositive ? 'success.main' : 'error.main' }}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <Typography variant="body2" fontWeight="bold" color="inherit">
            {isPositive ? '+' : ''}{stock.quote.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.quote.changePercent.toFixed(2)}%)
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Prediction Card Component
function PredictionCard({ stock, color }: { stock: StockData; color: string }) {
  const prediction = stock.prediction;
  
  if (!prediction) {
    return (
      <Card variant="outlined" sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Loading prediction...</Typography>
      </Card>
    );
  }

  const isBullish = prediction.direction === 'BULLISH';
  const isBearish = prediction.direction === 'BEARISH';
  const directionColor = isBullish ? 'success.main' : isBearish ? 'error.main' : 'warning.main';
  const bgColor = isBullish ? 'rgba(34, 197, 94, 0.1)' : isBearish ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)';

  return (
    <Card elevation={0} sx={{ borderTop: 3, borderTopColor: color, borderLeft: 1, borderRight: 1, borderBottom: 1, borderColor: 'divider' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ color }}>{stock.symbol}</Typography>
          <Brain size={16} color="#c084fc" />
        </Stack>
        
        <Box sx={{ bgcolor: bgColor, p: 2, borderRadius: 2, textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" color={directionColor}>
            {prediction.direction}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {prediction.confidence.toFixed(0)}% confidence
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid size={{xs:6,md:6}}>
            <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">Target</Typography>
              <Typography variant="body2" fontWeight="bold">${prediction.targetPrice.toFixed(2)}</Typography>
            </Box>
          </Grid>
          <Grid size={{xs:6,md:6}}>
             <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">Stop Loss</Typography>
              <Typography variant="body2" fontWeight="bold">${prediction.stopLoss.toFixed(2)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Compare Row Component
function CompareRow({ 
  label, 
  values, 
  format = (v) => v?.toString() || '-',
  colorize = false,
  thresholds
}: { 
  label: string; 
  values: (number | string | undefined)[];
  format?: (v: number | string | undefined) => string;
  colorize?: boolean;
  thresholds?: { good: number; bad: number; inverse?: boolean };
}) {
  const getColor = (v: number | string | undefined) => {
    if (!colorize || v === undefined || typeof v === 'string') return 'text.primary';
    
    if (thresholds) {
      const isGood = thresholds.inverse ? v < thresholds.good : v > thresholds.good;
      const isBad = thresholds.inverse ? v > thresholds.bad : v < thresholds.bad;
      if (isGood) return 'success.main';
      if (isBad) return 'error.main';
      return 'text.primary';
    }
    
    if (typeof v === 'number') {
      if (v > 0) return 'success.main';
      if (v < 0) return 'error.main';
    }
    return 'text.primary';
  };

  return (
    <TableRow hover>
      <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{label}</TableCell>
      {values.map((v, i) => (
        <TableCell key={i} align="right" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>
          <Typography variant="body2" component="span" fontWeight="inherit" color={getColor(v)} fontSize="inherit">
            {format(v)}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  );
}
