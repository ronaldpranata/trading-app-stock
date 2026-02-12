"use client";

import { TechnicalIndicators } from '@/types/stock';
import { Box, Grid, Typography } from '@mui/material';

interface ExtendedIndicatorsProps {
  indicators: TechnicalIndicators;
}

export default function ExtendedIndicators({ indicators }: ExtendedIndicatorsProps) {
  if (indicators.adx === undefined && indicators.cci === undefined) return null;

  return (
     <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">Extended Indicators</Typography>
        <Grid container spacing={1}>
             {indicators.adx !== undefined && (
                <Grid size={3}>
                    <Typography variant="caption" color="text.secondary" display="block">ADX</Typography>
                    <Typography variant="body2" fontWeight="bold" color={indicators.adx > 25 ? 'success.main' : 'text.disabled'}>
                        {indicators.adx.toFixed(0)}
                    </Typography>
                </Grid>
             )}
             {indicators.williamsR !== undefined && (
                <Grid size={3}>
                    <Typography variant="caption" color="text.secondary" display="block">W%R</Typography>
                    <Typography variant="body2" fontWeight="bold" color={indicators.williamsR < -80 ? 'success.main' : indicators.williamsR > -20 ? 'error.main' : 'text.primary'}>
                        {indicators.williamsR.toFixed(0)}
                    </Typography>
                </Grid>
             )}
             {indicators.cci !== undefined && (
                <Grid size={3}>
                    <Typography variant="caption" color="text.secondary" display="block">CCI</Typography>
                    <Typography variant="body2" fontWeight="bold" color={indicators.cci < -100 ? 'success.main' : indicators.cci > 100 ? 'error.main' : 'text.primary'}>
                        {indicators.cci.toFixed(0)}
                    </Typography>
                </Grid>
             )}
             {indicators.roc !== undefined && (
                <Grid size={3}>
                    <Typography variant="caption" color="text.secondary" display="block">ROC</Typography>
                    <Typography variant="body2" fontWeight="bold" color={indicators.roc > 0 ? 'success.main' : 'error.main'}>
                        {indicators.roc > 0 ? '+' : ''}{indicators.roc.toFixed(1)}%
                    </Typography>
                </Grid>
             )}
        </Grid>
     </Box>
  );
}
