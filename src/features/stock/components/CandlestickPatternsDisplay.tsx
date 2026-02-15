'use client';

import { CandlestickAnalysis } from '@/features/stock/types';
import { Card, CardContent, Typography, Box, Stack, CardHeader, Chip } from '@mui/material';
import { WaterfallChart, TrendingUp, TrendingDown, Remove, ErrorOutline } from "@mui/icons-material";

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
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" gap={1}>
            <WaterfallChart sx={{ fontSize: 20, color: "#8b5cf6" }} />
             <Typography variant="h6">Candlestick Patterns</Typography>
          </Stack>
        }
      />
      <CardContent>
         <Stack spacing={2}>
            {/* Overall Sentiment */}
            <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Overall Sentiment
                </Typography>
                <Stack direction="row" alignItems="center" gap={1}>
                    {/* This block is problematic as analysis is null/undefined here. Assuming this is a placeholder or an error in the provided edit. */}
                    {/* For now, I'll keep the original "No candlestick data available" message for the !analysis case,
                        as the provided edit attempts to access properties of a null/undefined 'analysis' object.
                        If the intent was to show a loading state or a different empty state, the edit needs to be adjusted.
                        I will revert to the original !analysis block, but update the icons as per the instruction. */}
                    <ErrorOutline sx={{ fontSize: 32, margin: '0 auto', marginBottom: 8, opacity: 0.5 }} />
                    <Typography>No candlestick data available</Typography>
                </Stack>
            </Box>
         </Stack>
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
      case 'bullish': return <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />;
      case 'bearish': return <TrendingDown sx={{ fontSize: 20, color: 'error.main' }} />;
      default: return <Remove sx={{ fontSize: 20, color: 'warning.main' }} />;
    }
  };

  const sortedPatterns = [...patterns].sort((a, b) => b.reliability - a.reliability).slice(0, 10);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Stack direction="row" alignItems="center" gap={1}>
            <WaterfallChart sx={{ fontSize: 20, color: "#fb923c" }} />
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
