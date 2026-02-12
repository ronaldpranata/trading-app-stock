'use client';

import { useState } from 'react';
import { PredictionResult, TimeframePrediction } from '@/types/stock';
import { Brain, AlertTriangle } from 'lucide-react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Stack, 
    Tooltip,
    Tabs,
    Tab
} from '@mui/material';

import PredictionSkeleton from './prediction/PredictionSkeleton';
import PredictionDirectionCard from './prediction/PredictionDirectionCard';
import PredictionTargets from './prediction/PredictionTargets';
import PredictionScores from './prediction/PredictionScores';
import TimeframesSummary from './prediction/TimeframesSummary';

interface PredictionDisplayProps {
  prediction: PredictionResult | null;
  currentPrice: number;
  isLoading?: boolean;
}

export default function PredictionDisplay({ prediction, currentPrice, isLoading }: PredictionDisplayProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  if (isLoading) {
    return <PredictionSkeleton />;
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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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

        <PredictionDirectionCard prediction={currentPrediction} />
        
        <PredictionTargets prediction={currentPrediction} currentPrice={currentPrice} />

        <PredictionScores prediction={prediction} />

        <TimeframesSummary predictions={predictions} currentPrice={currentPrice} />
        
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
