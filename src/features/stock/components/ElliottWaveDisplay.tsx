'use client';

import { ElliottWaveAnalysis } from '@/features/stock/types';
import { ShowChart, TrackChanges, Warning } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Typography, Stack, LinearProgress, CardHeader, Chip } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

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
      <CardHeader 
        title={
          <Stack direction="row" alignItems="center" gap={1}>
            <ShowChart sx={{ color: "#8b5cf6" }} />
            <Typography variant="h6">Elliott Wave Analysis</Typography>
            <Chip 
                label={elliottWave.wavePhase} 
                size="small" 
                color="secondary" 
                variant="outlined"
            />
          </Stack>
        }
      />
      
      <CardContent>
        <Grid container spacing={3}>
            {/* Left Col: Chart (Hero) */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ width: '100%', height: 320, bgcolor: 'action.hover', borderRadius: 2, p: 2, position: 'relative' }}>
                     <Typography variant="subtitle2" color="text.secondary" sx={{ position: 'absolute', top: 16, left: 16 }}>
                        Wave Pattern Visualization
                     </Typography>
                     
                     <LineChart
                        xAxis={[{ 
                            data: elliottWave.pivotPoints.map((_, i) => i),
                            valueFormatter: (v: number) => {
                                if (v < 0 || v >= elliottWave.pivotPoints.length) return '';
                                return elliottWave.pivotPoints[v].waveLabel || '';
                            },
                            tickLabelStyle: {
                                angle: 45,
                                textAnchor: 'start',
                                fontSize: 10,
                            }
                        }]}
                        series={[{ 
                            data: elliottWave.pivotPoints.map(p => p.price),
                            area: true,
                            showMark: true,
                            color: '#6366f1',
                            connectNulls: true,
                        }]}
                        height={280}
                        margin={{ left: 50, right: 20, top: 40, bottom: 50 }}
                        grid={{ vertical: false, horizontal: true }}
                        sx={{
                            '.MuiLineElement-root': {
                                strokeWidth: 2,
                            },
                            '.MuiAreaElement-root': {
                                fillOpacity: 0.1,
                            }
                        }}
                    >
                    </LineChart>
                    
                    {/* Current Wave Indicator (Overlay) */}
                    <Box sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: 'background.paper', p: 1, borderRadius: 1, border: 1, borderColor: 'divider', boxShadow: 1 }}>
                        <Typography variant="caption" fontWeight="bold" color="primary">
                            Current: {elliottWave.currentWave > 5 
                                ? `Wave ${['A', 'B', 'C'][elliottWave.currentWave - 6]}`
                                : `Wave ${elliottWave.currentWave}`}
                        </Typography>
                    </Box>
                </Box>
            </Grid>

            {/* Right Col: Metrics & Status */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={2} height="100%">
                    {/* Status Card */}
                    <Box p={2} border={1} borderColor="divider" borderRadius={2} bgcolor="background.paper">
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Current Status
                        </Typography>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                            {elliottWave.currentWave > 5 
                                ? `Wave ${['A', 'B', 'C'][elliottWave.currentWave - 6]}`
                                : `Wave ${elliottWave.currentWave}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            {elliottWave.wavePhase} Phase
                        </Typography>
                        
                        <LinearProgress 
                            variant="determinate" 
                            value={elliottWave.confidence > 1 ? elliottWave.confidence : elliottWave.confidence * 100} 
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                            color={elliottWave.confidence > (elliottWave.confidence > 1 ? 70 : 0.7) ? "success" : "warning"}
                        />
                        <Typography variant="caption" display="block" textAlign="right" mt={0.5}>
                            {Math.round(elliottWave.confidence > 1 ? elliottWave.confidence : elliottWave.confidence * 100)}% Confidence
                        </Typography>
                    </Box>

                    {/* Targets */}
                    <Box p={2} border={1} borderColor="divider" borderRadius={2}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom display="flex" alignItems="center" gap={1}>
                            <TrackChanges sx={{ fontSize: 16 }} /> Next Target
                        </Typography>
                         <Box>
                             <Typography variant="h6" fontWeight="bold">
                                 ${elliottWave.nextWaveTarget.toFixed(2)}
                             </Typography>
                             <Typography variant="caption" color="text.secondary">
                                 {((elliottWave.nextWaveTarget - currentPrice) / currentPrice * 100).toFixed(1)}% from current
                             </Typography>
                         </Box>
                    </Box>

                    {/* Invalidation */}
                    <Box sx={{ bgcolor: 'error.lighter', p: 2, borderRadius: 2, border: 1, borderColor: 'error.main', background: 'rgba(239, 68, 68, 0.1)' }}>
                        <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                            <Warning sx={{ fontSize: 16, color: "#ef4444" }} />
                            <Typography variant="subtitle2" color="error.main" fontWeight="bold">
                                Invalidation
                            </Typography>
                        </Stack>
                        <Typography variant="body1" color="error.main" fontWeight="bold">
                            ${elliottWave.invalidationLevel.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="error.main">
                            {Math.abs((elliottWave.invalidationLevel - currentPrice) / currentPrice * 100).toFixed(1)}% margin
                        </Typography>
                    </Box>
                </Stack>
            </Grid>

             {/* Bottom Row: Fibonacci (Optional, full width) */}
            {elliottWave.fibonacciLevels.length > 0 && (
              <Grid size={12}>
                <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" mb={1}>Key Fibonacci Levels</Typography>
                    <Grid container spacing={2}>
                        {elliottWave.fibonacciLevels.slice(0, 4).map((fib, i) => (
                            <Grid key={i} size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" display="block">{fib.label}</Typography>
                                    <Typography variant="body2" color={fib.type === 'retracement' ? 'warning.main' : 'info.main'} fontWeight="bold">
                                        ${fib.price.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
              </Grid>
            )}
        </Grid>
      </CardContent>
    </Card>
  );
}
