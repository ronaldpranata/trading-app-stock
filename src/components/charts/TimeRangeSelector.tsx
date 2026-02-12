'use client';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface TimeRangeOption {
  id: string;
  label: string;
  days: number;
}

interface TimeRangeSelectorProps {
  value: string;
  onChange: (range: string) => void;
  ranges: TimeRangeOption[];
  className?: string;
}

export function TimeRangeSelector({
  value,
  onChange,
  ranges,
  className = ''
}: TimeRangeSelectorProps) {
  return (
    <Box className={className}>
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(_, newValue) => {
                if (newValue !== null) {
                    onChange(newValue);
                }
            }}
            aria-label="time range"
            size="small"
            sx={{ 
                bgcolor: 'action.hover', 
                borderRadius: 2,
                '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: 1.5,
                    px: 1.5,
                    py: 0.5,
                    mx: 0.5,
                    my: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 'medium',
                    color: 'text.secondary',
                    textTransform: 'none',
                    '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        }
                    },
                    '&:hover': {
                        bgcolor: 'action.selected',
                        color: 'text.primary',
                    }
                }
            }}
        >
        {ranges.map(range => (
            <ToggleButton key={range.id} value={range.id}>
                {range.label}
            </ToggleButton>
        ))}
        </ToggleButtonGroup>
    </Box>
  );
}
