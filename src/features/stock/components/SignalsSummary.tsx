import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Stack, 
  Skeleton
} from '@mui/material';

interface SignalSummaryProps {
  signals: Array<{
    name: string;
    type: string;
    strength: number;
    description: string;
  }>;
  recommendation?: string;
  isLoading?: boolean;
}

// Signals Summary Component
export default function SignalsSummary({
  signals,
  recommendation,
  isLoading
}: SignalSummaryProps){
  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" width={140} height={24} sx={{ mb: 2 }} />
          
          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 6 }}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>

          <Stack spacing={1} mb={3}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height={50} sx={{ borderRadius: 1 }} />
            ))}
          </Stack>

          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  const bullish = signals.filter((s) => s.type === "bullish");
  const bearish = signals.filter((s) => s.type === "bearish");

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Signals Summary</Typography>

        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(34, 197, 94, 0.1)', border: '1px solid', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
               <Typography variant="h5" fontWeight="bold" color="success.main">{bullish.length}</Typography>
               <Typography variant="caption" color="success.light">Bullish Signals</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
               <Typography variant="h5" fontWeight="bold" color="error.main">{bearish.length}</Typography>
               <Typography variant="caption" color="error.light">Bearish Signals</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ maxHeight: 350, overflowY: 'auto', mb: 3 }}>
          <Stack spacing={1}>
            {signals.map((signal, i) => {
              const sColor = signal.type === 'bullish' ? 'success' : signal.type === 'bearish' ? 'error' : 'default';
              const sBg = signal.type === 'bullish' ? 'rgba(34, 197, 94, 0.1)' : signal.type === 'bearish' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)';
              
              return (
                <Box key={i} sx={{ p: 1, borderRadius: 1, bgcolor: sBg }}>
                   <Typography variant="body2" fontWeight="medium" color={`${sColor}.main`}>{signal.name}</Typography>
                   <Typography variant="caption" color="text.secondary">{signal.description}</Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {recommendation && (
            <Box sx={{ p: 2, bgcolor: 'rgba(59, 130, 246, 0.08)', borderRadius: 2, border: 1, borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" mb={0.5}>
                    AI Recommendation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {recommendation}
                </Typography>
            </Box>
        )}
      </CardContent>
    </Card>
  );
}
