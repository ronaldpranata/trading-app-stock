import { PredictionResult, PredictionTimeframe, SentimentData } from '@/types/stock';
import { useState } from 'react';
import { Brain, Target, Shield, TrendingUp, TrendingDown, Minus, Clock, FileText } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Stack, 
  Chip, 
  LinearProgress, 
  Grid, 
  useTheme,
  Button
} from '@mui/material';

interface PredictionDisplayProps {
  prediction: PredictionResult | null;
  sentimentData?: SentimentData;
  currentPrice: number;
}

const TIMEFRAME_LABELS: Record<PredictionTimeframe, string> = {
  day: '1D',
  week: '1W',
  month: '1M',
  quarter: '3M',
  year: '1Y'
};

export default function PredictionDisplay({ prediction, sentimentData, currentPrice }: PredictionDisplayProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<PredictionTimeframe>('week');
  const theme = useTheme();

  if (!prediction) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            AI Prediction
          </Typography>
          <Typography color="text.disabled">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  const selectedPrediction = prediction.timeframePredictions.find(p => p.timeframe === selectedTimeframe) 
    || prediction.timeframePredictions[0];

  const getDirectionIcon = (direction: string) => {
    if (direction === 'BULLISH') return <TrendingUp size={20} />;
    if (direction === 'BEARISH') return <TrendingDown size={20} />;
    return <Minus size={20} />;
  };

  const getDirectionColor = (direction: string) => {
    if (direction === 'BULLISH') return theme.palette.success.main;
    if (direction === 'BEARISH') return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  const directionColor = getDirectionColor(selectedPrediction.direction);
  const isBullish = selectedPrediction.direction === 'BULLISH';
  const isBearish = selectedPrediction.direction === 'BEARISH';

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <Brain className="w-4 h-4 text-purple-400" />
          <Typography variant="subtitle2" fontWeight="bold">AI Prediction</Typography>
        </Stack>

        {/* Timeframe Selector */}
        <Box sx={{ mb: 2, bgcolor: 'action.hover', p: 0.5, borderRadius: 1, display: 'flex', gap: 0.5 }}>
          {prediction.timeframePredictions.map(tp => {
             const isSelected = selectedTimeframe === tp.timeframe;
             const tpColor = tp.direction === 'BULLISH' ? 'success' : tp.direction === 'BEARISH' ? 'error' : 'warning';
             
             return (
              <Button
                key={tp.timeframe}
                onClick={() => setSelectedTimeframe(tp.timeframe)}
                variant={isSelected ? 'contained' : 'text'}
                color={isSelected ? tpColor : 'inherit'}
                size="small"
                sx={{ 
                  flex: 1, 
                  minWidth: 0, 
                  py: 0.5,
                  fontSize: '0.75rem',
                  color: !isSelected ? 'text.secondary' : undefined
                }}
              >
                {TIMEFRAME_LABELS[tp.timeframe]}
              </Button>
            );
          })}
        </Box>

        {/* Main Prediction */}
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            mb: 2, 
            border: '1px solid',
            borderColor: `${directionColor}40`,
            bgcolor: `${directionColor}10`
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Box sx={{ color: directionColor }}>
                {getDirectionIcon(selectedPrediction.direction)}
              </Box>
              <Typography variant="h5" fontWeight="bold" color={directionColor}>
                {selectedPrediction.direction}
              </Typography>
            </Stack>
            <Box textAlign="right">
              <Typography variant="caption" color="text.secondary">Confidence</Typography>
              <Typography variant="h6" fontWeight="bold" color={directionColor}>
                {selectedPrediction.confidence.toFixed(0)}%
              </Typography>
            </Box>
          </Stack>

          {/* Confidence Bar */}
          <LinearProgress 
            variant="determinate" 
            value={selectedPrediction.confidence} 
            color={isBullish ? 'success' : isBearish ? 'error' : 'warning'}
            sx={{ height: 8, borderRadius: 4, bgcolor: 'action.selected' }}
          />
        </Box>

        {/* Price Targets */}
        <Grid container spacing={2} mb={2}>
          <Grid size={6}>
            <Box sx={{ bgcolor: 'action.hover', p: 2.5, borderRadius: 3 }}>
              <Stack direction="row" alignItems="center" gap={1} mb={1}>
                <Target size={16} className="text-gray-400" />
                <Typography variant="body2" color="text.secondary">Target Price</Typography>
              </Stack>
              <Typography variant="h5" fontWeight="bold">
                ${selectedPrediction.targetPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" fontWeight="medium" color={selectedPrediction.expectedChangePercent >= 0 ? 'success.main' : 'error.main'}>
                {selectedPrediction.expectedChangePercent >= 0 ? '+' : ''}{selectedPrediction.expectedChangePercent.toFixed(2)}%
              </Typography>
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ bgcolor: 'action.hover', p: 2.5, borderRadius: 3 }}>
              <Stack direction="row" alignItems="center" gap={1} mb={1}>
                <Shield size={16} className="text-gray-400" />
                <Typography variant="body2" color="text.secondary">Stop Loss</Typography>
              </Stack>
              <Typography variant="h5" fontWeight="bold">
                ${selectedPrediction.stopLoss.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                R/R: {selectedPrediction.riskRewardRatio.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Scores */}
        <Grid container spacing={1} mb={2}>
          <Grid size={4}>
            <ScoreBar label="Technical" score={prediction.technicalScore} />
          </Grid>
          <Grid size={4}>
            <ScoreBar label="Fundamental" score={prediction.fundamentalScore} />
          </Grid>
          <Grid size={4}>
            <ScoreBar label="Sentiment" score={prediction.sentimentScore || 50} />
          </Grid>
        </Grid>

        {/* Sentiment Text Display */}
        {sentimentData && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
             <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                 <Stack direction="row" alignItems="center" gap={0.5}>
                     <FileText size={12} className="text-gray-400" />
                     <Typography variant="caption" color="text.secondary">News Sentiment</Typography>
                 </Stack>
                 <Chip 
                    label={sentimentData.sentiment.toUpperCase()} 
                    size="small"
                    color={sentimentData.sentiment === 'positive' ? 'success' : sentimentData.sentiment === 'negative' ? 'error' : 'warning'}
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.65rem' }}
                 />
             </Stack>
             {sentimentData.keywordMatches && sentimentData.keywordMatches.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={0.5} mt={0.5}>
                    {sentimentData.keywordMatches.slice(0, 3).map((match, idx) => (
                        <Chip 
                          key={idx} 
                          label={match.word} 
                          size="small" 
                          sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'background.paper' }} 
                        />
                    ))}
                </Stack>
             )}
          </Box>
        )}

        {/* All Timeframes Overview */}
        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
          <Stack direction="row" alignItems="center" gap={0.5} mb={1.5}>
            <Clock size={16} className="text-gray-400" />
            <Typography variant="body2" color="text.secondary">All Timeframes</Typography>
          </Stack>
          <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1}>
            {prediction.timeframePredictions.map(tp => (
              <Box key={tp.timeframe} textAlign="center" sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.selected' } }}>
                <Typography variant="caption" color="text.secondary" display="block" fontSize="0.75rem" mb={0.5}>
                  {TIMEFRAME_LABELS[tp.timeframe]}
                </Typography>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color={tp.direction === 'BULLISH' ? 'success.main' : tp.direction === 'BEARISH' ? 'error.main' : 'warning.main'}
                  lineHeight={1}
                  mb={0.5}
                >
                  {tp.direction === 'BULLISH' ? '↑' : tp.direction === 'BEARISH' ? '↓' : '→'}
                </Typography>
                <Typography 
                  variant="caption" 
                  color={tp.expectedChangePercent >= 0 ? 'success.main' : 'error.main'}
                  fontWeight="medium"
                  fontSize="0.7rem"
                >
                  {tp.expectedChangePercent >= 0 ? '+' : ''}{tp.expectedChangePercent.toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Recommendation */}
        {prediction.recommendation && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'primary.main', bgcolorOpacity: 0.1, borderRadius: 2, border: '1px solid', borderColor: 'primary.dark' }} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(37, 99, 235, 0.2)' }}>
            <Typography variant="caption" color="primary.light" fontWeight="bold" gutterBottom>
              AI Recommendation
            </Typography>
            <Typography variant="caption" color="text.primary" display="block" sx={{ lineHeight: 1.4 }}>
              {prediction.recommendation}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const getColor = () => {
    if (score >= 60) return 'success';
    if (score <= 40) return 'error';
    return 'warning';
  };
  
  const getTextColor = () => {
      if (score >= 60) return 'success.main';
      if (score <= 40) return 'error.main';
      return 'warning.main';
  };

  return (
    <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
      <Stack direction="row" justifyContent="space-between" mb={0.5}>
        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">{label}</Typography>
        <Typography variant="caption" fontWeight="bold" color={getTextColor()} fontSize="0.7rem">
          {score.toFixed(0)}
        </Typography>
      </Stack>
      <LinearProgress 
        variant="determinate" 
        value={score} 
        color={getColor()}
        sx={{ height: 4, borderRadius: 2 }}
      />
    </Box>
  );
}
