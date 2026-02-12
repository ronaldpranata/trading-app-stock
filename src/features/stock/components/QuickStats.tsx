import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Box, 
  Grid, 
  Skeleton,
} from "@mui/material";
import { MetricBox, ScoreBar } from "@/components/ui";
import { formatNumber } from "@/lib/formatters";
import { StockQuote, FundamentalData, PredictionResult } from "@/types/stock";

interface QuickStatsProps {
  quote: StockQuote | null;
  fundamentals: FundamentalData | null;
  prediction: PredictionResult | null;
  isLoading?: boolean;
}

export default function QuickStats({
  quote,
  fundamentals,
  prediction,
  isLoading
}: QuickStatsProps) {
  if (isLoading) {
    return (
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
         <CardContent>
           <Skeleton variant="text" width={100} height={24} sx={{ mb: 2 }} />
           <Stack spacing={2}>
             <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
             <Grid container spacing={2}>
               <Grid size={{ xs: 6 }}><Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} /></Grid>
               <Grid size={{ xs: 6 }}><Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} /></Grid>
               <Grid size={{ xs: 6 }}><Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} /></Grid>
               <Grid size={{ xs: 6 }}><Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} /></Grid>
             </Grid>
             <Box pt={2} sx={{ borderTop: 1, borderColor: 'divider' }}>
                <Stack spacing={1}>
                  <Skeleton variant="rectangular" height={20} />
                  <Skeleton variant="rectangular" height={20} />
                  <Skeleton variant="rectangular" height={20} />
                </Stack>
             </Box>
           </Stack>
         </CardContent>
      </Card>
    );
  }

  if (!quote) return null;

  const isBullish = prediction?.direction === "BULLISH";
  const isBearish = prediction?.direction === "BEARISH";
  const directionColor = isBullish ? 'success.main' : isBearish ? 'error.main' : 'warning.main';
  const bgColor = isBullish ? 'rgba(34, 197, 94, 0.1)' : isBearish ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)';

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
       <CardContent>
         <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Quick Stats</Typography>
         <Stack spacing={2}>
           {prediction && (
             <Box sx={{ p: 2, borderRadius: 2, bgcolor: bgColor, border: '1px solid', borderColor: `${directionColor}40` }}>
                <Typography variant="caption" color="text.secondary">AI Prediction</Typography>
                <Typography variant="h6" fontWeight="bold" color={directionColor}>
                  {prediction.direction}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {prediction.confidence.toFixed(0)}% confidence
                </Typography>
      
             </Box>
           )}

           <Grid container spacing={2}>
             <Grid size={{ xs: 6 }}>
               {(fundamentals?.marketCap ?? 0) > 0 && (
                 <MetricBox
                   label="Market Cap"
                   value={fundamentals?.marketCap ?? 0}
                   format={(v) => `$${formatNumber(v as number)}`}
                 />
               )}
             </Grid>
             <Grid size={{ xs: 6 }}>
               {(fundamentals?.peRatio ?? 0) > 0 && (
                 <MetricBox
                   label="P/E Ratio"
                   value={fundamentals?.peRatio ?? 0}
                   format={(v) => (v as number).toFixed(1)}
                 />
               )}
             </Grid>
             <Grid size={{ xs: 6 }}>
               <MetricBox
                 label="PEG Ratio"
                 value={(fundamentals?.pegRatio === undefined || fundamentals?.pegRatio === 0) ? "N/A" : fundamentals.pegRatio}
                 format={(v) => typeof v === 'string' ? v : (v as number).toFixed(2)}
                 colorize={typeof fundamentals?.pegRatio === 'number' && fundamentals.pegRatio > 0}
                 thresholds={{ good: 1, bad: 2, inverse: true }}
               />
             </Grid>
             <Grid size={{ xs: 6 }}>
               {prediction?.targetPrice && (
                 <MetricBox
                   label="Target"
                   value={prediction.targetPrice}
                   format={(v) => `$${(v as number).toFixed(2)}`}
                 />
               )}
             </Grid>
           </Grid>

           <Box pt={2} sx={{ borderTop: 1, borderColor: 'divider' }}>
             <Stack spacing={1}>
                <ScoreBar
                  label="Technical Score"
                  score={prediction?.technicalScore || 50}
                />
                <ScoreBar
                  label="Fundamental Score"
                  score={prediction?.fundamentalScore || 50}
                />
                 <ScoreBar
                  label="Sentiment Score"
                  score={prediction?.sentimentScore || 50}
                />
             </Stack>
           </Box>
         </Stack>
       </CardContent>
    </Card>
  );
}
