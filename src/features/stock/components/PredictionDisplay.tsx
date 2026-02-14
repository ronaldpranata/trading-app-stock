'use client';

import { useState } from 'react';
import { PredictionResult, TimeframePrediction } from '@/features/stock/types';
import { Psychology, Warning } from '@mui/icons-material';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Stack, 
    Tooltip,
    Tabs,
    Tab,
    ToggleButton,
    ToggleButtonGroup
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
             <Psychology sx={{ fontSize: 16, color: "#c084fc" }} />
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
             <Psychology sx={{ fontSize: 16, color: "#c084fc" }} />
             <Typography variant="subtitle2" fontWeight="bold">AI Prediction</Typography>
        </Stack>
        
        {predictions.length > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                <ToggleButtonGroup
                    value={selectedTab}
                    exclusive
                    onChange={(_, newValue) => {
                        if (newValue !== null) handleTabChange(_, newValue);
                    }}
                    aria-label="timeframe selection"
                    sx={{
                        bgcolor: 'action.hover',
                        p: 0.5,
                        borderRadius: 2,
                        '& .MuiToggleButton-root': {
                            border: 0,
                            borderRadius: 1.5,
                            py: 0.5,
                            px: 2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                bgcolor: 'background.paper',
                                color: 'text.primary',
                                boxShadow: 1,
                                '&:hover': {
                                    bgcolor: 'background.paper',
                                }
                            },
                        }
                    }}
                >
                    {predictions.map((p, index) => (
                        <ToggleButton key={index} value={index} aria-label={p.timeframe}>
                            {getLabel(p.timeframe)}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>
        )}

        <PredictionDirectionCard prediction={currentPrediction} />
        
        <PredictionTargets prediction={currentPrediction} currentPrice={currentPrice} />

        <PredictionScores prediction={prediction} />

        <TimeframesSummary predictions={predictions} currentPrice={currentPrice} />
        
        <Box sx={{ pt: 2, mt: 2 }}>
             <Tooltip title="This is an AI-generated prediction. Trading involves risk.">
                  <Stack direction="row" alignItems="center" justifyContent="center" gap={0.5} sx={{ cursor: 'help' }}>
                       <Warning sx={{ fontSize: 14, color: "#f59e0b" }} />
                       <Typography variant="caption" color="warning.main">Disclaimer: Not financial advice</Typography>
                  </Stack>
             </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
