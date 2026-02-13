'use client';

import { TechnicalIndicators } from '@/types/stock';
import { SsidChart } from "@mui/icons-material";
import { Card, CardContent, Typography, Stack } from '@mui/material';

import PerformanceMetrics from './technical/PerformanceMetrics';
import MovingAverages from './technical/MovingAverages';
import RSICard from './technical/RSICard';
import MACDCard from './technical/MACDCard';
import BollingerStochastic from './technical/BollingerStochastic';
import ExtendedIndicators from './technical/ExtendedIndicators';

interface TechnicalAnalysisProps {
  indicators: TechnicalIndicators | null;
  currentPrice: number;
}

export default function TechnicalAnalysis({ indicators, currentPrice }: TechnicalAnalysisProps) {
  if (!indicators) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
           <Typography variant="subtitle2" color="text.secondary" gutterBottom>Technical Analysis</Typography>
           <Typography variant="body2" color="text.secondary">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <SsidChart sx={{ fontSize: 20, color: "#60a5fa" }} />
        <Typography variant="h6" fontWeight="bold">
          Technical Analysis
        </Typography>
      </Stack>
        
        <Stack spacing={2}>
          {/* Yearly Performance */}
          {indicators.yearlyMetrics && (
            <PerformanceMetrics metrics={indicators.yearlyMetrics} />
          )}

          {/* Moving Averages */}
          <MovingAverages 
            sma20={indicators.sma20} 
            sma50={indicators.sma50} 
            sma200={indicators.sma200} 
            currentPrice={currentPrice} 
          />

          {/* RSI */}
          <RSICard rsi={indicators.rsi} />

          {/* MACD */}
          <MACDCard 
            macdLine={indicators.macd.macdLine} 
            signalLine={indicators.macd.signalLine} 
            histogram={indicators.macd.histogram} 
          />

          {/* Bollinger & Stochastic */}
          <BollingerStochastic 
            bollingerBands={indicators.bollingerBands} 
            stochastic={indicators.stochastic} 
            atr={indicators.atr} 
          />

          {/* Extended Indicators */}
          <ExtendedIndicators indicators={indicators} />

        </Stack>
      </CardContent>
    </Card>
  );
}
