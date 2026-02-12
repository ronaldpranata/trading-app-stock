'use client';

import { ElliottWaveAnalysis } from '@/types/stock';
import { Waves, Target, AlertTriangle } from 'lucide-react';
import { Box, Card, CardContent, Grid, Typography, Stack, LinearProgress } from '@mui/material';

interface ElliottWaveDisplayProps {
  elliottWave: ElliottWaveAnalysis | undefined;
  currentPrice: number;
}

export default function ElliottWaveDisplay({ elliottWave, currentPrice }: ElliottWaveDisplayProps) {
  if (!elliottWave) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Elliott Wave</Typography>
          <Typography variant="body2" color="text.secondary">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  const waveColors: Record<number, string> = {
    1: 'info.main', // blue
    2: 'secondary.main', // purple
    3: 'success.main', // green
    4: 'warning.main', // yellow
    5: 'error.main' // red
  };

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <Waves size={16} color="#22d3ee" /> {/* cyan-400 */}
          <Typography variant="subtitle2" fontWeight="bold">Elliott Wave Analysis</Typography>
        </Stack>

        {/* Current Wave Status */}
        <Box sx={{ 
            p: 1.5,
            mb: 2,
            borderRadius: 1,
            border: 1,
            borderColor: elliottWave.trendDirection === 'up' ? 'success.dark' : 'error.dark',
            bgcolor: elliottWave.trendDirection === 'up' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Current Wave</Typography>
              <Typography variant="h5" fontWeight="bold" color={waveColors[elliottWave.currentWave] || 'text.primary'}>
                Wave {elliottWave.currentWave}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="caption" color="text.secondary" display="block">Trend</Typography>
              <Typography variant="h6" fontWeight="bold" color={elliottWave.trendDirection === 'up' ? 'success.main' : 'error.main'}>
                {elliottWave.trendDirection === 'up' ? '↑ UP' : '↓ DOWN'}
              </Typography>
            </Box>
          </Stack>
          
          {/* Progress Bar */}
          <Box mb={1}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="text.secondary">Progress</Typography>
              <Typography variant="caption" color="text.secondary">{(elliottWave.waveProgress * 100).toFixed(0)}%</Typography>
            </Stack>
            <LinearProgress 
                variant="determinate" 
                value={elliottWave.waveProgress * 100} 
                color={elliottWave.trendDirection === 'up' ? 'success' : 'error'}
                sx={{ height: 6, borderRadius: 1 }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary">
            {elliottWave.waveType === 'impulse' ? 'Impulse' : 'Corrective'} • {elliottWave.wavePhase} phase
          </Typography>
        </Box>

        {/* Wave Pattern Visual */}
        <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1, mb: 2 }}>
          <Typography variant="caption" color="text.secondary" mb={1} display="block">Wave Pattern</Typography>
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" height={48} px={1}>
            {[1, 2, 3, 4, 5].map(wave => {
              const heights = { 1: 40, 2: 25, 3: 100, 4: 60, 5: 80 };
              const isActive = wave === elliottWave.currentWave;
              return (
                <Stack key={wave} alignItems="center" gap={0.5}>
                  <Box sx={{ 
                      width: 16, 
                      height: heights[wave as keyof typeof heights] * 0.4,
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                      bgcolor: isActive ? 'info.light' : wave < elliottWave.currentWave ? 'text.disabled' : 'action.selected',
                      transition: 'all 0.3s'
                  }} />
                  <Typography variant="caption" fontWeight={isActive ? 'bold' : 'regular'} color={isActive ? 'info.light' : 'text.disabled'} sx={{ fontSize: '0.65rem' }}>
                    {wave}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Box>

        {/* Targets */}
        <Grid container spacing={1} mb={2}>
          <Grid size={6}>
            <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
              <Stack direction="row" alignItems="center" gap={0.5} mb={0.5}>
                <Target size={12} className="text-green-400" />
                <Typography variant="caption" color="text.secondary">Wave Target</Typography>
              </Stack>
              <Typography variant="body2" fontWeight="bold" color="success.main">
                ${elliottWave.nextWaveTarget.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {((elliottWave.nextWaveTarget - currentPrice) / currentPrice * 100).toFixed(1)}% from current
              </Typography>
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
              <Stack direction="row" alignItems="center" gap={0.5} mb={0.5}>
                <AlertTriangle size={12} className="text-red-400" />
                <Typography variant="caption" color="text.secondary">Invalidation</Typography>
              </Stack>
              <Typography variant="body2" fontWeight="bold" color="error.main">
                ${elliottWave.invalidationLevel.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {((elliottWave.invalidationLevel - currentPrice) / currentPrice * 100).toFixed(1)}% from current
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Fibonacci Levels */}
        {elliottWave.fibonacciLevels.length > 0 && (
          <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1, mb: 2 }}>
            <Typography variant="caption" color="text.secondary" mb={1} display="block">Key Fibonacci Levels</Typography>
            <Stack spacing={0.5}>
              {elliottWave.fibonacciLevels.slice(0, 4).map((fib, i) => (
                <Stack key={i} direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">{fib.label}</Typography>
                  <Typography variant="caption" color={fib.type === 'retracement' ? 'warning.main' : 'info.main'} fontWeight="medium">
                    ${fib.price.toFixed(2)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Confidence */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt="auto">
          <Typography variant="caption" color="text.secondary">Analysis Confidence</Typography>
          <Typography variant="caption" fontWeight="bold" color={
             elliottWave.confidence > 70 ? 'success.main' : 
             elliottWave.confidence > 50 ? 'warning.main' : 'error.main'
          }>
            {elliottWave.confidence.toFixed(0)}%
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
