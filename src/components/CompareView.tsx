'use client';

import { useState, useMemo } from 'react';
import { StockQuote, HistoricalData, FundamentalData, TechnicalIndicators, PredictionResult } from '@/types/stock';
import { TrendingUp, TrendingDown, Minus, Target, Brain, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StockData {
  symbol: string;
  quote: StockQuote | null;
  historicalData: HistoricalData[];
  fundamentalData: FundamentalData | null;
  technicalIndicators: TechnicalIndicators | null;
  prediction: PredictionResult | null;
  isLoading: boolean;
}

interface CompareViewProps {
  primaryStock: StockData;
  compareStocks: StockData[];
}

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

export default function CompareView({ primaryStock, compareStocks }: CompareViewProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const allStocks = [primaryStock, ...compareStocks];
  
  // Calculate grid columns based on number of stocks
  const gridCols = allStocks.length <= 2 ? 'md:grid-cols-2' : 
                   allStocks.length <= 3 ? 'md:grid-cols-3' : 
                   'md:grid-cols-3 lg:grid-cols-3'; // Keep 3 cols max for readability

  // ... (useMemo logic remains the same)

  // ...

  // Prepare chart data with time range
  const { chartData, performanceData } = useMemo(() => {
    const range = TIME_RANGES.find(r => r.id === timeRange);
    const days = range?.days || 66;

    const allDates = new Set<string>();
    allStocks.forEach(stock => {
      stock.historicalData.slice(-days).forEach(d => allDates.add(d.date));
    });

    const sortedDates = Array.from(allDates).sort();

    const chartData = sortedDates.map(date => {
      const dataPoint: Record<string, string | number> = { date };
      
      allStocks.forEach(stock => {
        const filteredData = stock.historicalData.slice(-days);
        const firstPrice = filteredData[0]?.close || 1;
        const dayData = filteredData.find(d => d.date === date);
        if (dayData) {
          dataPoint[stock.symbol] = ((dayData.close - firstPrice) / firstPrice) * 100;
        }
      });

      return dataPoint;
    });

    // Calculate performance metrics for each stock
    const performanceData = allStocks.map((stock, index) => {
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
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
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
    }).filter(Boolean);

    return { chartData, performanceData };
  }, [allStocks, timeRange]);

  const formatNum = (n: number) => {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(1) + 'T';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    return '$' + n.toFixed(2);
  };

  return (
    <div className="space-y-4">
      {/* Price Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allStocks.map((stock, index) => (
          <PriceCard key={stock.symbol} stock={stock} color={COLORS[index]} />
        ))}
        {allStocks.length < 3 && (
          <div className="bg-gray-900/30 rounded-xl p-6 border border-dashed border-gray-700 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Search to add another stock</p>
          </div>
        )}
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Price Performance (% Change)
          </h3>
          
          {/* Time Range Selector */}
          <div className="flex bg-gray-800/50 rounded-lg p-0.5">
            {TIME_RANGES.map(range => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  timeRange === range.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Summary Cards */}
        <div className={`grid grid-cols-1 ${gridCols} gap-3 mb-4`}>
          {performanceData.map((perf: any) => (
            <div 
              key={perf.symbol} 
              className={`rounded-lg p-3 border ${
                perf.change >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold" style={{ color: perf.color }}>{perf.symbol}</span>
                <span className={`text-lg font-bold ${perf.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {perf.change >= 0 ? '+' : ''}{perf.change.toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-gray-500">Max DD</span>
                  <div className="text-red-400 font-medium">-{perf.maxDrawdown.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-gray-500">Max Rally</span>
                  <div className="text-green-400 font-medium">+{perf.maxGain.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickFormatter={(value) => value.slice(5)}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickFormatter={(value) => `${value.toFixed(0)}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
              />
              <Legend />
              {allStocks.map((stock, index) => (
                <Line
                  key={stock.symbol}
                  type="monotone"
                  dataKey={stock.symbol}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  name={stock.symbol}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800/50">
              <th className="text-left text-xs font-medium text-gray-400 p-3">Metric</th>
              {allStocks.map((stock, index) => (
                <th key={stock.symbol} className="text-right text-xs font-medium p-3" style={{ color: COLORS[index % COLORS.length] }}>
                  {stock.symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/30">
            <CompareRow 
              label="Price" 
              values={allStocks.map(s => s.quote?.price ? `$${s.quote.price.toFixed(2)}` : '-')} 
            />
            <CompareRow 
              label={`${timeRange} Change`}
              values={performanceData.map((p: any) => p?.change)}
              format={(v) => v !== undefined && typeof v === 'number' ? `${v >= 0 ? '+' : ''}${v.toFixed(2)}%` : '-'}
              colorize
            />
            <CompareRow 
              label="Max Drawdown"
              values={performanceData.map((p: any) => p?.maxDrawdown)}
              format={(v) => v !== undefined && typeof v === 'number' ? `-${v.toFixed(1)}%` : '-'}
              colorize
              thresholds={{ good: 10, bad: 20, inverse: true }}
            />
            <CompareRow 
              label="Max Rally"
              values={performanceData.map((p: any) => p?.maxGain)}
              format={(v) => v !== undefined && typeof v === 'number' ? `+${v.toFixed(1)}%` : '-'}
              colorize
              thresholds={{ good: 20, bad: 5 }}
            />
            <CompareRow 
              label="Volatility"
              values={performanceData.map((p: any) => p?.volatility)}
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
          </tbody>
        </table>
      </div>

      {/* Prediction Comparison */}
      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
        {allStocks.map((stock, index) => (
          <PredictionCard key={stock.symbol} stock={stock} color={COLORS[index % COLORS.length]} />
        ))}
      </div>
    </div>
  );
}

// Price Card Component
function PriceCard({ stock, color }: { stock: StockData; color: string }) {
  if (!stock.quote) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50 animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-20 mb-2" />
        <div className="h-8 bg-gray-800 rounded w-32" />
      </div>
    );
  }

  const isPositive = stock.quote.change >= 0;

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50" style={{ borderTopColor: color, borderTopWidth: '3px' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg" style={{ color }}>{stock.symbol}</span>
        {stock.quote.simulated && (
          <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">SIM</span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        ${stock.quote.price.toFixed(2)}
      </div>
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {isPositive ? '+' : ''}{stock.quote.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.quote.changePercent.toFixed(2)}%)
      </div>
    </div>
  );
}

// Prediction Card Component
function PredictionCard({ stock, color }: { stock: StockData; color: string }) {
  const prediction = stock.prediction;
  
  if (!prediction) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
        <div className="text-sm text-gray-400">Loading prediction...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50" style={{ borderTopColor: color, borderTopWidth: '3px' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold" style={{ color }}>{stock.symbol}</span>
        <Brain className="w-4 h-4 text-purple-400" />
      </div>
      
      <div className={`text-center p-3 rounded-lg mb-3 ${
        prediction.direction === 'BULLISH' ? 'bg-green-500/10' :
        prediction.direction === 'BEARISH' ? 'bg-red-500/10' : 'bg-yellow-500/10'
      }`}>
        <div className={`text-lg font-bold ${
          prediction.direction === 'BULLISH' ? 'text-green-400' :
          prediction.direction === 'BEARISH' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {prediction.direction}
        </div>
        <div className="text-xs text-gray-400">{prediction.confidence.toFixed(0)}% confidence</div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-800/30 rounded p-2">
          <div className="text-gray-500">Target</div>
          <div className="text-white font-bold">${prediction.targetPrice.toFixed(2)}</div>
        </div>
        <div className="bg-gray-800/30 rounded p-2">
          <div className="text-gray-500">Stop Loss</div>
          <div className="text-white font-bold">${prediction.stopLoss.toFixed(2)}</div>
        </div>
      </div>
    </div>
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
    if (!colorize || v === undefined || typeof v === 'string') return 'text-white';
    
    if (thresholds) {
      const isGood = thresholds.inverse ? v < thresholds.good : v > thresholds.good;
      const isBad = thresholds.inverse ? v > thresholds.bad : v < thresholds.bad;
      if (isGood) return 'text-green-400';
      if (isBad) return 'text-red-400';
      return 'text-white';
    }
    
    if (typeof v === 'number') {
      if (v > 0) return 'text-green-400';
      if (v < 0) return 'text-red-400';
    }
    return 'text-white';
  };

  return (
    <tr className="hover:bg-gray-800/20">
      <td className="text-xs text-gray-400 p-3">{label}</td>
      {values.map((v, i) => (
        <td key={i} className={`text-xs font-medium text-right p-3 ${getColor(v)}`}>
          {format(v)}
        </td>
      ))}
    </tr>
  );
}
