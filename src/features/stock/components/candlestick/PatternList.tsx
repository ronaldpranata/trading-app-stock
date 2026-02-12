"use client";

import { Box, Typography, Stack } from '@mui/material';
import { CandlestickPattern } from '@/types/stock';
import PatternCard from './PatternCard';

interface PatternListProps {
  patterns: CandlestickPattern[];
  title?: React.ReactNode;
  compact?: boolean;
  emptyMessage?: string;
}

export default function PatternList({ patterns, title, compact = false, emptyMessage = 'No patterns detected' }: PatternListProps) {
  if (patterns.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
        <Typography variant="body2">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box mb={compact ? 0 : 3}>
      {title && (
        <Typography variant="subtitle2" fontWeight="bold" mb={1.5}>
          {title}
        </Typography>
      )}
      <Stack spacing={1} sx={compact ? { maxHeight: 256, overflowY: 'auto', pr: 0.5 } : {}}>
        {patterns.map((pattern, index) => (
          <PatternCard key={index} pattern={pattern} compact={compact} />
        ))}
      </Stack>
    </Box>
  );
}
