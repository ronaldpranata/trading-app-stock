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
import { StockQuote, FundamentalData, PredictionResult } from "@/features/stock/types";

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

            <Stack spacing={1} sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
               <Stack direction="row" justifyContent="space-between" alignItems="center">
                 <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                 <Typography variant="body2" fontWeight="bold">
                   ${fundamentals?.marketCap ? formatNumber(fundamentals.marketCap) : 'N/A'}
                 </Typography>
               </Stack>
               
               <Stack direction="row" justifyContent="space-between" alignItems="center">
                 <Typography variant="body2" color="text.secondary">P/E Ratio</Typography>
                 <Typography variant="body2" fontWeight="bold">
                   {fundamentals?.peRatio ? fundamentals.peRatio.toFixed(1) : 'N/A'}
                 </Typography>
               </Stack>

               <Stack direction="row" justifyContent="space-between" alignItems="center">
                 <Typography variant="body2" color="text.secondary">PEG Ratio</Typography>
                 <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={fundamentals?.pegRatio && fundamentals.pegRatio > 0 && fundamentals.pegRatio < 1.5 ? 'success.main' : fundamentals?.pegRatio && fundamentals.pegRatio >= 2 ? 'error.main' : 'text.primary'}
                 >
                   {fundamentals?.pegRatio ? fundamentals.pegRatio.toFixed(2) : 'N/A'}
                 </Typography>
               </Stack>

               <Stack direction="row" justifyContent="space-between" alignItems="center">
                 <Typography variant="body2" color="text.secondary">Target Price</Typography>
                 <Typography variant="body2" fontWeight="bold">
                   {prediction?.targetPrice ? `$${prediction.targetPrice.toFixed(2)}` : 'N/A'}
                 </Typography>
               </Stack>
            </Stack>

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
