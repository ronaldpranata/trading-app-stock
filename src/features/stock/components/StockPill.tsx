import { Chip, Stack, Typography } from "@mui/material";

interface StockPillProps {
  symbol: string;
  change?: number;
  color: "blue" | "purple" | "orange";
  onRemove?: () => void;
}

export default function StockPill({
  symbol,
  change,
  color,
  onRemove,
}: StockPillProps) {
  const colorMap = {
    blue: 'info',
    purple: 'secondary',
    orange: 'warning'
  } as const;

  const muiColor = colorMap[color] || 'default';
  const isPositive = change && change >= 0;

  return (
    <Chip
      label={
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight="bold">{symbol}</Typography>
          {change !== undefined && (
            <Typography variant="caption" color={isPositive ? 'success.light' : 'error.light'} fontWeight="bold">
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </Typography>
          )}
        </Stack>
      }
      onDelete={onRemove}
      color={muiColor}
      variant="outlined"
      onClick={() => {}} 
      sx={{ borderRadius: 4 }}
    />
  );
}
