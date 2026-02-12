'use client';

import { CandlestickAnalysis } from '@/types/stock';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { CandlestickChart, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

import PatternScore from './candlestick/PatternScore';
import PatternSummaryCounts from './candlestick/PatternSummaryCounts';
import PatternList from './candlestick/PatternList';
import PatternLegend from './candlestick/PatternLegend';

interface CandlestickPatternsDisplayProps {
  analysis: CandlestickAnalysis | null | undefined;
}

export default function CandlestickPatternsDisplay({ analysis }: CandlestickPatternsDisplayProps) {
  if (!analysis) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <CandlestickChart size={20} color="#fb923c" /> {/* orange-400 */}
            <Typography variant="h6" fontWeight="bold">Candlestick Patterns</Typography>
          </Stack>
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <AlertCircle size={32} style={{ margin: '0 auto', marginBottom: 8, opacity: 0.5 }} />
            <Typography>No candlestick data available</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const { patterns, overallBias, score, recentPatterns } = analysis;

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'bullish': return 'success.main';
      case 'bearish': return 'error.main';
      default: return 'warning.main';
    }
  };

  const getBiasIcon = (bias: string) => {
    switch (bias) {
      case 'bullish': return <TrendingUp size={20} className="text-green-400" />;
      case 'bearish': return <TrendingDown size={20} className="text-red-400" />;
      default: return <Minus size={20} className="text-yellow-400" />;
    }
  };

  const sortedPatterns = [...patterns].sort((a, b) => b.reliability - a.reliability).slice(0, 10);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Stack direction="row" alignItems="center" gap={1}>
            <CandlestickChart size={20} color="#fb923c" />
            <Typography variant="h6" fontWeight="bold">Candlestick Patterns</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            {getBiasIcon(overallBias)}
            <Typography fontWeight="bold" sx={{ color: getBiasColor(overallBias), textTransform: 'capitalize' }}>
              {overallBias}
            </Typography>
          </Stack>
        </Stack>

        <PatternScore score={score} />

        <PatternSummaryCounts patterns={patterns} />

        {/* Recent Patterns */}
        {recentPatterns.length > 0 && (
          <PatternList 
            patterns={recentPatterns} 
            title={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ width: 8, height: 8, bgcolor: 'info.main', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                    Recent Patterns (Last 5 Days)
                </Box>
            }
          />
        )}

        {/* All Patterns */}
        <PatternList 
            patterns={sortedPatterns} 
            title={`All Detected Patterns (${patterns.length})`}
            compact
            emptyMessage="No significant patterns detected"
        />

        <PatternLegend />
      </CardContent>
    </Card>
  );
}
