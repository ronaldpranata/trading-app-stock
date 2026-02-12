"use client";

import { Card, CardContent, Stack, Skeleton, Grid, Box } from '@mui/material';

export default function PredictionSkeleton() {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
           <Skeleton variant="circular" width={16} height={16} />
           <Skeleton variant="text" width={120} sx={{ fontSize: '1rem' }} />
        </Stack>
        
        {/* Tabs Skeleton */}
        <Skeleton variant="rectangular" height={36} sx={{ mb: 3, borderRadius: 1 }} />
        
        {/* Main Card Skeleton */}
        <Skeleton variant="rectangular" height={100} sx={{ mb: 3, borderRadius: 2 }} />
        
        {/* Targets Grid Skeleton */}
        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 6 }}>
             <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 6 }}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>

        {/* Scores Skeleton */}
        <Stack direction="row" spacing={2} mb={3}>
           <Box flex={1}><Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} /></Box>
           <Box flex={1}><Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} /></Box>
           <Box flex={1}><Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} /></Box>
        </Stack>

        {/* All Timeframes Skeleton */}
        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
      </CardContent>
    </Card>
  );
}
