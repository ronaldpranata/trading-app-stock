'use client';

import { ArrowUp, ArrowDown, X, MousePointer2 } from 'lucide-react';
import { formatDate } from '@/lib/formatters';
import { Box, Typography, Stack, IconButton,  } from '@mui/material';

interface MeasurementResult {
  startPoint: { date: string; price: number; index: number };
  endPoint: { date: string; price: number; index: number };
  priceChange: number;
  percentChange: number;
  days: number;
  isGain: boolean;
}

interface MeasureDisplayProps {
  isActive: boolean;
  firstClick: { date: string; price: number } | null;
  result: MeasurementResult | null;
  onClear: () => void;
  className?: string;
}

export function MeasureDisplay({
  isActive,
  firstClick,
  result,
  onClear,
  className = ''
}: MeasureDisplayProps) {
  if (!isActive) return null;

  if (result) {
    return (
      <Box sx={{ 
          borderRadius: 2, 
          p: 1.5, 
          border: 1, 
          borderColor: result.isGain ? 'success.dark' : 'error.dark',
          bgcolor: result.isGain ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          ...((className && {}) as any) // Allow passing className if needed, though usually sx is preferred
      }} className={className}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Stack direction="row" alignItems="baseline" gap={1} mb={0.5}>
              {result.isGain ? (
                <ArrowUp size={20} className="text-green-400" color="#4ade80" />
              ) : (
                <ArrowDown size={20} className="text-red-400" color="#f87171" />
              )}
              <Typography variant="h6" fontWeight="bold" color={result.isGain ? 'success.main' : 'error.main'} lineHeight={1}>
                {result.isGain ? '+' : ''}{result.percentChange.toFixed(2)}%
              </Typography>
              <Typography variant="body2" color={result.isGain ? 'success.main' : 'error.main'}>
                ({result.isGain ? '+' : ''}${result.priceChange.toFixed(2)})
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ color: '#fff' }}>${result.startPoint.price.toFixed(2)}</span>
              <span>→</span>
              <span style={{ color: '#fff' }}>${result.endPoint.price.toFixed(2)}</span>
              <span>•</span>
              <span>{result.days} days</span>
              <span>•</span>
              <span>{formatDate(result.startPoint.date)} → {formatDate(result.endPoint.date)}</span>
            </Typography>
          </Box>
          <IconButton onClick={onClear} size="small" sx={{ color: 'text.secondary' }}>
            <X size={16} />
          </IconButton>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ 
        borderRadius: 2, 
        p: 1.5, 
        border: 1, 
        borderColor: 'info.dark',
        bgcolor: 'rgba(6, 182, 212, 0.1)', // cyan-500/10
    }} className={className}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={1}>
          <MousePointer2 size={16} color="#22d3ee" /> {/* cyan-400 */}
          <Typography variant="body2" sx={{ color: 'info.main' }}>
            {firstClick 
              ? `First point: $${firstClick.price.toFixed(2)} (${formatDate(firstClick.date)}) - Click second point`
              : 'Click on chart to select first point'
            }
          </Typography>
        </Stack>
        {firstClick && (
          <IconButton onClick={onClear} size="small" sx={{ color: 'text.secondary' }}>
             <X size={16} />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}
