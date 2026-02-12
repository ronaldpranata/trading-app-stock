"use client";

import { Box, Typography, Stack, Chip } from '@mui/material';

export default function PatternLegend() {
  return (
    <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
      <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" mb={1}>
        Pattern Reliability
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip label="Very High (80%+)" size="small" sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: 'success.main', height: 24, fontSize: '0.7rem' }} />
        <Chip label="High (65-79%)" size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'info.main', height: 24, fontSize: '0.7rem' }} />
        <Chip label="Moderate (50-64%)" size="small" sx={{ bgcolor: 'rgba(234, 179, 8, 0.1)', color: 'warning.main', height: 24, fontSize: '0.7rem' }} />
        <Chip label="Low (<50%)" size="small" sx={{ bgcolor: 'action.hover', color: 'text.secondary', height: 24, fontSize: '0.7rem' }} />
      </Stack>
    </Box>
  );
}
