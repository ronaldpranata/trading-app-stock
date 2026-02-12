"use client";

import { Box, Grid, Typography } from '@mui/material';

interface MACDCardProps {
  macdLine: number;
  signalLine: number;
  histogram: number;
}

export default function MACDCard({ macdLine, signalLine, histogram }: MACDCardProps) {
  return (
    <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
       <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">MACD</Typography>
       <Grid container spacing={1}>
          <Grid size={4}>
              <Typography variant="caption" color="text.secondary" display="block">MACD</Typography>
              <Typography variant="body2" fontWeight="bold">{macdLine.toFixed(2)}</Typography>
          </Grid>
          <Grid size={4}>
               <Typography variant="caption" color="text.secondary" display="block">Signal</Typography>
               <Typography variant="body2" fontWeight="bold">{signalLine.toFixed(2)}</Typography>
          </Grid>
          <Grid size={4}>
               <Typography variant="caption" color="text.secondary" display="block">Histogram</Typography>
               <Typography variant="body2" fontWeight="bold" color={histogram > 0 ? 'success.main' : 'error.main'}>
                  {histogram.toFixed(2)}
               </Typography>
          </Grid>
       </Grid>
    </Box>
  );
}
