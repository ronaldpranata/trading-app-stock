'use client';

import { useMemo } from 'react';
import { HistoricalData } from '@/features/stock/types';
import { TIME_RANGES, TimeRange } from '@/lib/constants';
import { 
  calculateMaxDrawdown, 
  calculateMaxRally, 
  calculateVolatility, 
  calculateWinRate,
  calculatePercentChange,
  getYTDDays,
  calculateSMA
} from '@/features/stock/utils/stockUtils';

export interface ChartDataPoint {
  date: string;
  price: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  sma20: number;
  sma50: number;
  index: number;
}

export interface PeriodStats {
  startDate: string;
  endDate: string;
  startPrice: number;
  endPrice: number;
  priceChange: number;
  priceChangePercent: number;
  periodHigh: number;
  periodLow: number;
  maxDrawdown: number;
  drawdownStart: string;
  drawdownEnd: string;
  maxGain: number;
  gainStart: string;
  gainEnd: string;
  volatility: number;
  winRate: number;
  tradingDays: number;
}

export function useChartData(data: HistoricalData[], timeRange: TimeRange) {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return { chartData: [], periodStats: null };
    }

    const range = TIME_RANGES.find(r => r.id === timeRange);
    const days = timeRange === 'YTD' ? getYTDDays() : (range?.days || 66);
    const filteredData = data.slice(-Math.min(days, data.length));

    if (filteredData.length === 0) {
      return { chartData: [], periodStats: null };
    }

    // Calculate SMAs
    const allCloses = data.map(d => d.close);
    const startIndex = data.length - filteredData.length;

    const chartData: ChartDataPoint[] = filteredData.map((d, i) => {
      const globalIndex = startIndex + i;
      let sma20 = 0;
      let sma50 = 0;

      if (globalIndex >= 19) {
        sma20 = calculateSMA(allCloses.slice(0, globalIndex + 1), 20);
      }
      if (globalIndex >= 49) {
        sma50 = calculateSMA(allCloses.slice(0, globalIndex + 1), 50);
      }

      return {
        date: d.date,
        price: d.close,
        high: d.high,
        low: d.low,
        open: d.open,
        volume: d.volume,
        sma20,
        sma50,
        index: i
      };
    });

    // Calculate period statistics
    const firstPrice = filteredData[0].close;
    const lastPrice = filteredData[filteredData.length - 1].close;
    const priceChange = lastPrice - firstPrice;
    const priceChangePercent = calculatePercentChange(firstPrice, lastPrice);

    const periodHigh = Math.max(...filteredData.map(d => d.high));
    const periodLow = Math.min(...filteredData.map(d => d.low));

    const drawdownResult = calculateMaxDrawdown(filteredData);
    const rallyResult = calculateMaxRally(filteredData);

    const closes = filteredData.map(d => d.close);
    const volatility = calculateVolatility(closes);
    const winRate = calculateWinRate(closes);

    const periodStats: PeriodStats = {
      startDate: filteredData[0].date,
      endDate: filteredData[filteredData.length - 1].date,
      startPrice: firstPrice,
      endPrice: lastPrice,
      priceChange,
      priceChangePercent,
      periodHigh,
      periodLow,
      maxDrawdown: drawdownResult.maxDrawdown,
      drawdownStart: drawdownResult.startDate,
      drawdownEnd: drawdownResult.endDate,
      maxGain: rallyResult.maxRally,
      gainStart: rallyResult.startDate,
      gainEnd: rallyResult.endDate,
      volatility,
      winRate,
      tradingDays: filteredData.length
    };

    return { chartData, periodStats };
  }, [data, timeRange]);
}

// Hook for comparison chart data
export function useComparisonChartData(
  stocks: { symbol: string; historicalData: HistoricalData[] }[],
  timeRange: TimeRange
) {
  return useMemo(() => {
    const range = TIME_RANGES.find(r => r.id === timeRange);
    const days = timeRange === 'YTD' ? getYTDDays() : (range?.days || 66);

    // Collect all dates
    const allDates = new Set<string>();
    stocks.forEach(stock => {
      stock.historicalData.slice(-days).forEach(d => allDates.add(d.date));
    });

    const sortedDates = Array.from(allDates).sort();

    // Build chart data with percentage changes
    const chartData = sortedDates.map(date => {
      const dataPoint: Record<string, string | number> = { date };

      stocks.forEach(stock => {
        const filteredData = stock.historicalData.slice(-days);
        const firstPrice = filteredData[0]?.close || 1;
        const dayData = filteredData.find(d => d.date === date);
        if (dayData) {
          dataPoint[stock.symbol] = calculatePercentChange(firstPrice, dayData.close);
        }
      });

      return dataPoint;
    });

    // Calculate performance for each stock
    const performanceData = stocks.map(stock => {
      const filteredData = stock.historicalData.slice(-days);
      if (filteredData.length === 0) return null;

      const firstPrice = filteredData[0].close;
      const lastPrice = filteredData[filteredData.length - 1].close;
      const change = calculatePercentChange(firstPrice, lastPrice);

      const drawdownResult = calculateMaxDrawdown(filteredData);
      const rallyResult = calculateMaxRally(filteredData);
      const closes = filteredData.map(d => d.close);
      const volatility = calculateVolatility(closes);

      return {
        symbol: stock.symbol,
        change,
        maxDrawdown: drawdownResult.maxDrawdown,
        maxGain: rallyResult.maxRally,
        volatility,
        high: Math.max(...filteredData.map(d => d.high)),
        low: Math.min(...filteredData.map(d => d.low))
      };
    }).filter(Boolean);

    return { chartData, performanceData };
  }, [stocks, timeRange]);
}
