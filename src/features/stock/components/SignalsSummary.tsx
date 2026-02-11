import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Stack, 

} from '@mui/material';

interface SignalSummaryProps {
  signals: Array<{
    name: string;
    type: string;
    strength: number;
    description: string;
  }>;
}

// Signals Summary Component
export default function SignalsSummary({
  signals,
}: SignalSummaryProps){
  const bullish = signals.filter((s) => s.type === "bullish");
  const bearish = signals.filter((s) => s.type === "bearish");

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
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

        <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
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
      </CardContent>
    </Card>
  );
}
