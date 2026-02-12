'use client';

import { useState } from 'react';
import { PredictionResult, TimeframePrediction } from '@/types/stock';
import { Brain, TrendingUp, TrendingDown, Target, Shield, AlertTriangle, Clock, FileText } from 'lucide-react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Grid,
    Stack, 
    Chip, 
    LinearProgress,
    Tooltip,
    Tabs,
    Tab,
    Skeleton
} from '@mui/material';

interface PredictionDisplayProps {
  prediction: PredictionResult | null;
  currentPrice: number;
  isLoading?: boolean;
}

export default function PredictionDisplay({ prediction, currentPrice, isLoading }: PredictionDisplayProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
             <Skeleton variant="circular" width={16} height={16} />
             <Skeleton variant="text" width={120} sx={{ fontSize: '1rem' }} />
          </Stack>
          
          {/* Tabs Skeleton */}
          <Skeleton variant="rectangular" height={36} sx={{ mb: 3, borderRadius: 1 }} />
          
          {/* Main Card Skeleton */}
          <Skeleton variant="rectangular" height={100} sx={{ mb: 3, borderRadius: 2 }} />
          
          {/* Targets Grid Skeleton */}
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 6 }}>
               <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>

          {/* Scores Skeleton */}
          <Stack direction="row" spacing={2} mb={3}>
             <Box flex={1}><Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} /></Box>
             <Box flex={1}><Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} /></Box>
             <Box flex={1}><Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} /></Box>
          </Stack>

          {/* All Timeframes Skeleton */}
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
             <Brain size={16} color="#c084fc" />
             <Typography variant="subtitle2" fontWeight="bold">AI Prediction</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">Generating prediction...</Typography>
        </CardContent>
      </Card>
    );
  }

  // Use timeframe predictions if available, otherwise fall back to main prediction
  const predictions = prediction.timeframePredictions?.length > 0 
    ? prediction.timeframePredictions 
    : [{
        timeframe: 'day',
        direction: prediction.direction,
        confidence: prediction.confidence,
        targetPrice: prediction.targetPrice,
        stopLoss: prediction.stopLoss,
        expectedChange: 0, 
        expectedChangePercent: 0, 
        riskRewardRatio: 0 
      } as TimeframePrediction];

  const currentPrediction = predictions[selectedTab] || predictions[0];
  const isBullish = currentPrediction.direction === 'BULLISH';
  const confidenceColor = isBullish ? 'success.main' : currentPrediction.direction === 'BEARISH' ? 'error.main' : 'warning.main';
  
  // Calculate potential profit/loss for current selection
  const profitPotential = ((currentPrediction.targetPrice - currentPrice) / currentPrice) * 100;
  const riskPotential = ((currentPrice - currentPrediction.stopLoss) / currentPrice) * 100;
  const riskRewardRatio = Math.abs(riskPotential) > 0 ? Math.abs(profitPotential / riskPotential) : 0;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getLabel = (tf: string) => {
      switch(tf) {
          case 'day': return '1D';
          case 'week': return '1W';
          case 'month': return '1M';
          case 'quarter': return '3M';
          case 'year': return '1Y';
          default: return tf;
      }
  };

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        {/* Header */}
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
             <Brain size={16} color="#c084fc" />
             <Typography variant="subtitle2" fontWeight="bold">AI Prediction</Typography>
        </Stack>
        
        {/* Tabs */}
        {predictions.length > 1 && (
            <Tabs 
                value={selectedTab} 
                onChange={handleTabChange} 
                variant="fullWidth" 
                sx={{ 
                    minHeight: 36, 
                    mb: 3, 
                    bgcolor: 'action.hover', 
                    borderRadius: 1,
                    p: 0.5,
                    '& .MuiIndicator-root': { display: 'none' }
                }}
            >
                {predictions.map((p, index) => (
                    <Tab 
                        key={index} 
                        label={getLabel(p.timeframe)} 
                        sx={{ 
                            minHeight: 32, 
                            borderRadius: 1, 
                            zIndex: 1,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            '&.Mui-selected': { bgcolor: 'background.paper', boxShadow: 1, color: 'text.primary' }
                        }}
                    />
                ))}
            </Tabs>
        )}

        {/* Main Direction Card */}
        <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            border: 1, 
            borderColor: isBullish ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            bgcolor: isBullish ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            mb: 3
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                 <Stack direction="row" alignItems="center" gap={1}>
                    {isBullish ? <TrendingUp size={20} color="#22c55e" /> : <TrendingDown size={20} color="#ef4444" />}
                    <Typography variant="h5" fontWeight="bold" color={isBullish ? 'success.main' : 'error.main'}>
                        {currentPrediction.direction}
                    </Typography>
                 </Stack>
                 <Box textAlign="right">
                     <Typography variant="caption" color="text.secondary">Confidence</Typography>
                     <Typography variant="h6" fontWeight="bold" color={currentPrediction.confidence > 70 ? 'success.main' : 'warning.main'} sx={{ lineHeight: 1 }}>
                         {currentPrediction.confidence.toFixed(0)}%
                     </Typography>
                 </Box>
            </Stack>
            <LinearProgress 
                variant="determinate" 
                value={currentPrediction.confidence} 
                color={currentPrediction.confidence > 70 ? 'success' : 'warning'}
                sx={{ height: 6, borderRadius: 3, bgcolor: 'action.selected' }} 
            />
        </Box>
        
        {/* Targets Grid */}
        <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 6 }}>
               <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', border: 1, borderColor: 'divider' }}>
                   <Stack direction="row" alignItems="center" gap={1} mb={1}>
                       <Target size={16} color="#9ca3af" />
                       <Typography variant="body2" color="text.secondary">Target Price</Typography>
                   </Stack>
                   <Typography variant="h6" fontWeight="bold" color="text.primary">
                        ${currentPrediction.targetPrice.toFixed(2)}
                   </Typography>
                   <Typography variant="caption" color="success.main" fontWeight="bold">
                        {profitPotential > 0 ? '+' : ''}{profitPotential.toFixed(2)}%
                   </Typography>
               </Box>
            </Grid>

            <Grid size={{ xs: 6 }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', border: 1, borderColor: 'divider' }}>
                   <Stack direction="row" alignItems="center" gap={1} mb={1}>
                       <Shield size={16} color="#9ca3af" />
                       <Typography variant="body2" color="text.secondary">Stop Loss</Typography>
                   </Stack>
                   <Typography variant="h6" fontWeight="bold" color="text.primary">
                        ${currentPrediction.stopLoss.toFixed(2)}
                   </Typography>
                   <Typography variant="caption" color="text.secondary">
                        R/R: {riskRewardRatio.toFixed(2)}
                   </Typography>
               </Box>
            </Grid>
        </Grid>

        {/* Scores */}
        <Stack direction="row" spacing={2} mb={3}>
             {[
                 { label: 'Technical', score: prediction.technicalScore, color: '#eab308' },
                 { label: 'Fundamental', score: prediction.fundamentalScore, color: '#eab308' },
                 { label: 'Sentiment', score: prediction.sentimentScore || 50, color: '#22c55e' }
             ].map((item, i) => (
                 <Box key={i} sx={{ flex: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                          <Typography variant="caption" fontWeight="bold" sx={{ color: item.color }}>{Math.round(item.score)}</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={item.score} 
                        sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: item.color } }} 
                      />
                 </Box>
             ))}
        </Stack>

        {/* All Timeframes Summary */}
        {predictions.length > 1 && (
             <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                <Typography variant="subtitle2" color="text.secondary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <Clock size={16} /> All Timeframes
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                     {predictions.map((p, i) => {
                         const potential = ((p.targetPrice - currentPrice) / currentPrice) * 100;
                         const isUp = potential > 0;
                         return (
                            <Box key={i} textAlign="center">
                                <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                                    {getLabel(p.timeframe)}
                                </Typography>
                                {isUp ? (
                                    <TrendingUp size={16} color="#22c55e" style={{ display: 'block', margin: '0 auto 4px' }} />
                                ) : (
                                    <TrendingDown size={16} color="#ef4444" style={{ display: 'block', margin: '0 auto 4px' }} />
                                )}
                                <Typography variant="caption" fontWeight="bold" color={isUp ? 'success.main' : 'error.main'}>
                                    {potential > 0 ? '+' : ''}{potential.toFixed(1)}%
                                </Typography>
                            </Box>
                         );
                     })}
                </Stack>
             </Box>
        )}


        
        <Box sx={{ pt: 2, mt: 2 }}>
             <Tooltip title="This is an AI-generated prediction. Trading involves risk.">
                  <Stack direction="row" alignItems="center" justifyContent="center" gap={0.5} sx={{ cursor: 'help' }}>
                       <AlertTriangle size={14} color="#f59e0b" />
                       <Typography variant="caption" color="warning.main">Disclaimer: Not financial advice</Typography>
                  </Stack>
             </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
