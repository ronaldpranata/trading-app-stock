'use client';

import { CandlestickAnalysis, CandlestickPattern } from '@/types/stock';
import { Card, CardContent, Typography, Box, Stack, Grid, Chip, LinearProgress, Divider } from '@mui/material';
import { CandlestickChart, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

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

  const bullishPatterns = patterns.filter(p => p.direction === 'bullish');
  const bearishPatterns = patterns.filter(p => p.direction === 'bearish');
  const neutralPatterns = patterns.filter(p => p.direction === 'neutral');

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

        {/* Score Display */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">Pattern Score</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              color: score >= 60 ? 'success.main' : score <= 40 ? 'error.main' : 'warning.main'
            }}>
              {score.toFixed(0)}
            </Typography>
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={score} 
            color={score >= 60 ? 'success' : score <= 40 ? 'error' : 'warning'}
            sx={{ height: 8, borderRadius: 4, bgcolor: 'action.selected' }}
          />
        </Box>

        {/* Pattern Summary */}
        <Grid container spacing={1} mb={3}>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ 
              bgcolor: 'rgba(34, 197, 94, 0.1)', 
              borderRadius: 2, 
              p: 1.5, 
              textAlign: 'center', 
              border: 1, 
              borderColor: 'rgba(34, 197, 94, 0.2)' 
            }}>
              <Typography variant="h6" fontWeight="bold" color="success.main">{bullishPatterns.length}</Typography>
              <Typography variant="caption" color="success.main">Bullish</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ 
              bgcolor: 'rgba(234, 179, 8, 0.1)', 
              borderRadius: 2, 
              p: 1.5, 
              textAlign: 'center', 
              border: 1, 
              borderColor: 'rgba(234, 179, 8, 0.2)' 
            }}>
              <Typography variant="h6" fontWeight="bold" color="warning.main">{neutralPatterns.length}</Typography>
              <Typography variant="caption" color="warning.main">Neutral</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ 
              bgcolor: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: 2, 
              p: 1.5, 
              textAlign: 'center', 
              border: 1, 
              borderColor: 'rgba(239, 68, 68, 0.2)' 
            }}>
              <Typography variant="h6" fontWeight="bold" color="error.main">{bearishPatterns.length}</Typography>
              <Typography variant="caption" color="error.main">Bearish</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Recent Patterns */}
        {recentPatterns.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ width: 8, height: 8, bgcolor: 'info.main', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Recent Patterns (Last 5 Days)
            </Typography>
            <Stack spacing={1}>
              {recentPatterns.map((pattern, index) => (
                <PatternCard key={`recent-${index}`} pattern={pattern} />
              ))}
            </Stack>
          </Box>
        )}

        {/* All Patterns */}
        {patterns.length > 0 ? (
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" mb={1.5}>
              All Detected Patterns ({patterns.length})
            </Typography>
            <Stack spacing={1} sx={{ maxHeight: 256, overflowY: 'auto', pr: 0.5 }}>
              {[...patterns]
                .sort((a, b) => b.reliability - a.reliability)
                .slice(0, 10)
                .map((pattern, index) => (
                  <PatternCard key={`all-${index}`} pattern={pattern} compact />
                ))}
            </Stack>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
            <Typography variant="body2">No significant patterns detected</Typography>
          </Box>
        )}

        {/* Legend */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" mb={1}>
            Pattern Reliability
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Chip label="Very High (80%+)" size="small" sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: 'success.main', height: 24, fontSize: '0.7rem' }} />
            <Chip label="High (65-79%)" size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'info.main', height: 24, fontSize: '0.7rem' }} />
            <Chip label="Moderate (50-64%)" size="small" sx={{ bgcolor: 'rgba(234, 179, 8, 0.1)', color: 'warning.main', height: 24, fontSize: '0.7rem' }} />
            <Chip label="Low (<50%)" size="small" sx={{ bgcolor: 'action.hover', color: 'text.secondary', height: 24, fontSize: '0.7rem' }} />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

// Pattern Card Component
function PatternCard({ pattern, compact = false }: { pattern: CandlestickPattern; compact?: boolean }) {
  const getPatternStyles = (direction: string) => {
    switch (direction) {
      case 'bullish': return { bgcolor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)', color: 'success.main', chipBg: 'rgba(34, 197, 94, 0.1)' };
      case 'bearish': return { bgcolor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'error.main', chipBg: 'rgba(239, 68, 68, 0.1)' };
      default: return { bgcolor: 'rgba(234, 179, 8, 0.05)', borderColor: 'rgba(234, 179, 8, 0.2)', color: 'warning.main', chipBg: 'rgba(234, 179, 8, 0.1)' };
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.8) return 'success.main';
    if (reliability >= 0.65) return 'info.main';
    if (reliability >= 0.5) return 'warning.main';
    return 'text.secondary';
  };

  const styles = getPatternStyles(pattern.direction);

  if (compact) {
    return (
      <Box sx={{ 
        p: 1.5, 
        borderRadius: 2, 
        border: 1, 
        bgcolor: styles.bgcolor, 
        borderColor: styles.borderColor 
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" fontWeight="medium" sx={{ color: styles.color }}>
            {pattern.name}
          </Typography>
          <Typography variant="caption" sx={{ color: getReliabilityColor(pattern.reliability) }}>
            {(pattern.reliability * 100).toFixed(0)}%
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 2, 
      borderRadius: 2, 
      border: 1, 
      bgcolor: styles.bgcolor, 
      borderColor: styles.borderColor 
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="body2" fontWeight="medium" sx={{ color: styles.color }}>
          {pattern.name}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          <Chip 
            label={pattern.direction} 
            size="small" 
            sx={{ 
              bgcolor: styles.chipBg, 
              color: styles.color, 
              height: 20, 
              fontSize: '0.65rem',
              textTransform: 'capitalize' 
            }} 
          />
          <Typography variant="caption" fontWeight="medium" sx={{ color: getReliabilityColor(pattern.reliability) }}>
            {(pattern.reliability * 100).toFixed(0)}% reliable
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {pattern.description}
      </Typography>
    </Box>
  );
}
