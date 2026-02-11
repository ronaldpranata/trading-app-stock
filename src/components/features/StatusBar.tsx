import { 
  Box, 
  Container, 
  Stack, 
  Typography, 
} from "@mui/material";
import { 
  BarChart3, 
  Brain, 
  Clock, 
} from "lucide-react";

interface StatusBarProps {
  symbol: string;
  predictionDirection: string;
  isLoading: boolean;
  lastRefreshFormatted: string | null;
  autoRefreshEnabled: boolean;
}

export default function StatusBar({
  symbol,
  predictionDirection,
  isLoading,
  lastRefreshFormatted,
  autoRefreshEnabled,
}: StatusBarProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', py: 1, px: 2 }}>
      <Container maxWidth="xl" disableGutters>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Stack direction="row" alignItems="center" gap={3}>
            <Stack direction="row" alignItems="center" gap={1}>
              <BarChart3 size={14} className="text-blue-400" />
              <Typography variant="caption" color="text.secondary">Symbol:</Typography>
              <Typography variant="caption" fontWeight="bold">{symbol}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <Brain size={14} className="text-purple-400" />
              <Typography variant="caption" color="text.secondary">Signal:</Typography>
              <Typography 
                variant="caption" 
                fontWeight="bold" 
                color={predictionDirection === "BULLISH" ? "success.main" : predictionDirection === "BEARISH" ? "error.main" : "warning.main"}
              >
                {isLoading ? "..." : predictionDirection}
              </Typography>
            </Stack>
            {lastRefreshFormatted && (
              <Stack direction="row" alignItems="center" gap={1}>
                <Clock size={14} className="text-gray-500" />
                <Typography variant="caption" color="text.secondary">{lastRefreshFormatted}</Typography>
              </Stack>
            )}
          </Stack>
          {autoRefreshEnabled && (
            <Stack direction="row" alignItems="center" gap={1}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 1.5s infinite' }} />
              <Typography variant="caption" color="success.main">Auto-refresh ON</Typography>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
