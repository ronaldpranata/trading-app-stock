import { Stack, Button, Box, Typography } from "@mui/material";
import { MousePointer2 } from "lucide-react";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { TimeRange } from "@/lib/constants";
import { memo } from "react";

interface ChartControlsProps {
    symbol: string;
    measureActive: boolean;
    onToggleMeasure: () => void;
    timeRange: TimeRange;
    onTimeRangeChange: (range: TimeRange) => void;
    showSMA: boolean;
    onToggleSMA: () => void;
    timeRangeOptions: { id: TimeRange; label: string; days: number }[];
}

function ChartControls({
    symbol,
    measureActive,
    onToggleMeasure,
    timeRange,
    onTimeRangeChange,
    showSMA,
    onToggleSMA,
    timeRangeOptions
}: ChartControlsProps) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            {/* Title */}
            <Stack direction="row" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                <Typography variant="subtitle2" fontWeight="bold">
                    {symbol} Price Chart
                </Typography>
            </Stack>
            
            <Stack direction="row" alignItems="center" gap={1}>
                {/* Measure Mode Toggle */}
                <Button
                    onClick={onToggleMeasure}
                    variant={measureActive ? 'contained' : 'text'}
                    size="small"
                    title="Click two points on chart to measure"
                    startIcon={<MousePointer2 size={12} />}
                    sx={{ minWidth: config => measureActive ? 100 : 40 }}
                >
                    {measureActive ? 'Measuring' : ''}
                </Button>

                {/* Time Range Selector */}
                <TimeRangeSelector
                    value={timeRange}
                    onChange={(val) => onTimeRangeChange(val as TimeRange)}
                    ranges={timeRangeOptions}
                />
                
                {/* SMA Toggle */}
                <Button
                    onClick={onToggleSMA}
                    variant={showSMA ? 'contained' : 'outlined'}
                    size="small"
                    sx={{ minWidth: 40, px: 1 }}
                >
                    SMA
                </Button>
            </Stack>
        </Stack>
    );
}

export default memo(ChartControls);
