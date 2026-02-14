"use client";

import { FundamentalData } from '@/features/stock/types';
import { formatNumber } from '@/features/stock/utils/fundamentalAnalysis';
import { CurrencyBitcoin } from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Typography, Stack } from '@mui/material';
import MetricBox from './MetricBox';

interface CryptoMetricsProps {
  data: FundamentalData;
  currentPrice: number;
}

export default function CryptoMetrics({ data, currentPrice }: CryptoMetricsProps) {
  const fiftyTwoWeekPosition = data.fiftyTwoWeekHigh > data.fiftyTwoWeekLow 
    ? ((currentPrice - data.fiftyTwoWeekLow) / (data.fiftyTwoWeekHigh - data.fiftyTwoWeekLow)) * 100
    : 50;

  return (
     <Card variant="outlined" sx={{ height: '100%' }}>
       <CardContent>
         <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <CurrencyBitcoin sx={{ fontSize: 20, color: "#f59e0b" }} />
        <Typography variant="h6" fontWeight="bold">
          Crypto Metrics
        </Typography>
      </Stack>
         
         <Stack spacing={2}>
           <Grid container spacing={2}>
             <Grid size={6}>
               <MetricBox label="Market Cap" value={data.marketCap} format={(v) => `$${formatNumber(v)}`} />
             </Grid>
             <Grid size={6}>
                <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                   <Typography variant="caption" color="text.secondary" display="block">Beta</Typography>
                   <Typography variant="body1" fontWeight="bold" color={data.beta > 1.5 ? 'error.main' : 'text.primary'}>
                       {data.beta.toFixed(2)}
                   </Typography>
                </Box>
             </Grid>
           </Grid>

           {data.fiftyTwoWeekHigh > 0 && (
             <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
               <Typography variant="caption" color="text.secondary" display="block" mb={1}>52-Week Range</Typography>
               <Stack direction="row" justifyContent="space-between" mb={0.5}>
                 <Typography variant="caption" color="error.main">${formatNumber(data.fiftyTwoWeekLow)}</Typography>
                 <Typography variant="caption" color="success.main">${formatNumber(data.fiftyTwoWeekHigh)}</Typography>
               </Stack>
               <Box sx={{ position: 'relative', height: 6, bgcolor: 'action.selected', borderRadius: 99 }}>
                   <Box sx={{ 
                       position: 'absolute', 
                       left: 0, top: 0, bottom: 0, right: 0, 
                       background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)',
                       borderRadius: 99,
                       opacity: 0.5
                   }} />
                   <Box sx={{ 
                       position: 'absolute', 
                       left: `${Math.min(100, Math.max(0, fiftyTwoWeekPosition))}%`, 
                       top: -2, 
                       width: 2, 
                       height: 10, 
                       bgcolor: 'common.white',
                       borderRadius: 1
                   }} />
               </Box>
             </Box>
           )}

           <Box sx={{ bgcolor: 'warning.dark', p: 1, borderRadius: 1, bgOpacity: 0.1 }}>
             <Typography variant="caption" color="warning.light">
               Traditional metrics (P/E, PEG) don't apply to crypto.
             </Typography>
           </Box>
         </Stack>
       </CardContent>
     </Card>
  );
}
