'use client';

import { TechnicalIndicators } from '@/types/stock';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';
import { Box, Card, CardContent, Grid, Typography, Stack, Chip } from '@mui/material';

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

  const getRSIColor = (rsi: number) => {
    if (rsi < 30) return 'success';
    if (rsi > 70) return 'error';
    return 'warning';
  };

  const getRSILabel = (rsi: number) => {
    if (rsi < 30) return 'Oversold';
    if (rsi > 70) return 'Overbought';
    return 'Neutral';
  };

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <Activity size={16} color="#60a5fa" /> {/* blue-400 */}
          <Typography variant="subtitle2" fontWeight="bold">Technical Analysis</Typography>
        </Stack>
        
        <Stack spacing={2}>
          {/* Yearly Performance */}
          {indicators.yearlyMetrics && (
            <Box sx={{ 
                background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))',
                p: 1.5,
                borderRadius: 1,
                border: 1,
                borderColor: 'rgba(59, 130, 246, 0.2)'
            }}>
              <Stack direction="row" alignItems="center" gap={1} mb={1}>
                <Calendar size={12} className="text-blue-400" />
                <Typography variant="caption" color="primary.light" fontWeight="medium">1-Year Performance</Typography>
              </Stack>
              <Grid container spacing={1}>
                <Grid size={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Return</Typography>
                    <Typography variant="body2" fontWeight="bold" color={indicators.yearlyMetrics.yearlyReturn >= 0 ? 'success.main' : 'error.main'}>
                      {indicators.yearlyMetrics.yearlyReturn >= 0 ? '+' : ''}{indicators.yearlyMetrics.yearlyReturn.toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={3}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Volatility</Typography>
                        <Typography variant="body2" fontWeight="bold">{indicators.yearlyMetrics.volatility.toFixed(1)}%</Typography>
                    </Box>
                </Grid>
                <Grid size={3}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Sharpe</Typography>
                        <Typography variant="body2" fontWeight="bold" color={indicators.yearlyMetrics.sharpeRatio > 1 ? 'success.main' : 'text.primary'}>
                            {indicators.yearlyMetrics.sharpeRatio.toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={3}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Max DD</Typography>
                        <Typography variant="body2" fontWeight="bold" color="error.main">-{indicators.yearlyMetrics.maxDrawdown.toFixed(1)}%</Typography>
                    </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Moving Averages */}
          <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">Moving Averages</Typography>
            <Grid container spacing={1}>
              <Grid size={4}>
                  <Typography variant="caption" color="text.secondary" display="block">SMA20</Typography>
                  <Typography variant="body2" fontWeight="bold" color={currentPrice > indicators.sma20 ? 'success.main' : 'error.main'}>
                    ${indicators.sma20.toFixed(2)}
                  </Typography>
              </Grid>
              <Grid size={4}>
                  <Typography variant="caption" color="text.secondary" display="block">SMA50</Typography>
                   <Typography variant="body2" fontWeight="bold" color={currentPrice > indicators.sma50 ? 'success.main' : 'error.main'}>
                    ${indicators.sma50.toFixed(2)}
                  </Typography>
              </Grid>
              <Grid size={4}>
                   <Typography variant="caption" color="text.secondary" display="block">SMA200</Typography>
                   <Typography variant="body2" fontWeight="bold" color={currentPrice > indicators.sma200 ? 'success.main' : 'error.main'}>
                    ${indicators.sma200.toFixed(2)}
                  </Typography>
              </Grid>
            </Grid>
            <Box mt={1}>
                 {indicators.sma50 > indicators.sma200 ? (
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <TrendingUp size={12} color="#4ade80" /> 
                    <Typography variant="caption" color="success.main">Golden Cross Active</Typography>
                  </Stack>
                ) : (
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <TrendingDown size={12} color="#f87171" />
                    <Typography variant="caption" color="error.main">Death Cross Active</Typography>
                  </Stack>
                )}
            </Box>
          </Box>

          {/* RSI */}
          <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
             <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">RSI (14)</Typography>
                <Chip label={getRSILabel(indicators.rsi)} size="small" color={getRSIColor(indicators.rsi)} variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
             </Stack>
             <Typography variant="h5" fontWeight="bold" color={`${getRSIColor(indicators.rsi)}.main`}>
                {indicators.rsi.toFixed(1)}
             </Typography>
             <Box sx={{ height: 6, bgcolor: 'action.selected', borderRadius: 99, mt: 1, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ 
                    position: 'absolute', 
                    height: '100%', 
                    width: `${indicators.rsi}%`, 
                    bgcolor: indicators.rsi < 30 ? 'success.main' : indicators.rsi > 70 ? 'error.main' : 'warning.main',
                    transition: 'width 0.5s ease'
                }} />
             </Box>
          </Box>

          {/* MACD */}
          <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
             <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">MACD</Typography>
             <Grid container spacing={1}>
                <Grid size={4}>
                    <Typography variant="caption" color="text.secondary" display="block">MACD</Typography>
                    <Typography variant="body2" fontWeight="bold">{indicators.macd.macdLine.toFixed(2)}</Typography>
                </Grid>
                <Grid size={4}>
                     <Typography variant="caption" color="text.secondary" display="block">Signal</Typography>
                     <Typography variant="body2" fontWeight="bold">{indicators.macd.signalLine.toFixed(2)}</Typography>
                </Grid>
                <Grid size={4}>
                     <Typography variant="caption" color="text.secondary" display="block">Histogram</Typography>
                     <Typography variant="body2" fontWeight="bold" color={indicators.macd.histogram > 0 ? 'success.main' : 'error.main'}>
                        {indicators.macd.histogram.toFixed(2)}
                     </Typography>
                </Grid>
             </Grid>
          </Box>

          {/* Bollinger & Stochastic */}
          <Grid container spacing={2}>
            <Grid size={6}>
                 <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                     <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">Bollinger Bands</Typography>
                     <Stack spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between">
                             <Typography variant="caption" color="text.secondary">Upper</Typography>
                             <Typography variant="caption" color="error.main">${indicators.bollingerBands.upper.toFixed(2)}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                             <Typography variant="caption" color="text.secondary">Middle</Typography>
                             <Typography variant="caption" color="text.primary">${indicators.bollingerBands.middle.toFixed(2)}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                             <Typography variant="caption" color="text.secondary">Lower</Typography>
                             <Typography variant="caption" color="success.main">${indicators.bollingerBands.lower.toFixed(2)}</Typography>
                        </Stack>
                     </Stack>
                 </Box>
            </Grid>
            <Grid size={6}>
                 <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                     <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">Stochastic</Typography>
                     <Stack spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between">
                             <Typography variant="caption" color="text.secondary">%K</Typography>
                             <Typography variant="caption" color={indicators.stochastic.k < 20 ? 'success.main' : indicators.stochastic.k > 80 ? 'error.main' : 'text.primary'}>
                                {indicators.stochastic.k.toFixed(1)}
                             </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                             <Typography variant="caption" color="text.secondary">%D</Typography>
                             <Typography variant="caption" color="text.primary">{indicators.stochastic.d.toFixed(1)}</Typography>
                        </Stack>
                         <Stack direction="row" justifyContent="space-between">
                             <Typography variant="caption" color="text.secondary">ATR</Typography>
                             <Typography variant="caption" color="text.primary">${indicators.atr.toFixed(2)}</Typography>
                        </Stack>
                     </Stack>
                 </Box>
            </Grid>
          </Grid>

          {/* Extended Indicators */}
          {(indicators.adx !== undefined || indicators.cci !== undefined) && (
             <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">Extended Indicators</Typography>
                <Grid container spacing={1}>
                     {indicators.adx !== undefined && (
                        <Grid size={3}>
                            <Typography variant="caption" color="text.secondary" display="block">ADX</Typography>
                            <Typography variant="body2" fontWeight="bold" color={indicators.adx > 25 ? 'success.main' : 'text.disabled'}>
                                {indicators.adx.toFixed(0)}
                            </Typography>
                        </Grid>
                     )}
                     {indicators.williamsR !== undefined && (
                        <Grid size={3}>
                            <Typography variant="caption" color="text.secondary" display="block">W%R</Typography>
                            <Typography variant="body2" fontWeight="bold" color={indicators.williamsR < -80 ? 'success.main' : indicators.williamsR > -20 ? 'error.main' : 'text.primary'}>
                                {indicators.williamsR.toFixed(0)}
                            </Typography>
                        </Grid>
                     )}
                     {indicators.cci !== undefined && (
                        <Grid size={3}>
                            <Typography variant="caption" color="text.secondary" display="block">CCI</Typography>
                            <Typography variant="body2" fontWeight="bold" color={indicators.cci < -100 ? 'success.main' : indicators.cci > 100 ? 'error.main' : 'text.primary'}>
                                {indicators.cci.toFixed(0)}
                            </Typography>
                        </Grid>
                     )}
                     {indicators.roc !== undefined && (
                        <Grid size={3}>
                            <Typography variant="caption" color="text.secondary" display="block">ROC</Typography>
                            <Typography variant="body2" fontWeight="bold" color={indicators.roc > 0 ? 'success.main' : 'error.main'}>
                                {indicators.roc > 0 ? '+' : ''}{indicators.roc.toFixed(1)}%
                            </Typography>
                        </Grid>
                     )}
                </Grid>
             </Box>
          )}

        </Stack>
      </CardContent>
    </Card>
  );
}
