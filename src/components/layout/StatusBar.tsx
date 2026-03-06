import { 
  Box, 
  Container, 
  Stack, 
  Typography, 
} from "@mui/material";
import { 
  BarChart,
  Psychology,
  AccessTime,
  TrendingUp,
  TrendingDown,
  CurrencyBitcoin
} from "@mui/icons-material";

import { useStock, useUI } from "@/hooks";

export default function StatusBar() {
  const { symbol, primaryStock, isLoading } = useStock();
  const { lastRefreshFormatted } = useUI();
  
  const predictionDirection = primaryStock?.prediction?.direction || "NEUTRAL";

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', py: 1, px: 2 }}>
      <Container maxWidth="xl" disableGutters>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Stack direction="row" alignItems="center" gap={3}>
            <Stack direction="row" alignItems="center" gap={1}>
              <BarChart fontSize="small" sx={{ color: "#60a5fa" }} />
              <Typography variant="caption" color="text.secondary">Symbol:</Typography>
              <Typography variant="caption" fontWeight="bold">{symbol}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <Psychology fontSize="small" sx={{ color: "#c084fc" }} />
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
                <AccessTime fontSize="small" sx={{ color: "#9ca3af" }} />
                <Typography variant="caption" color="text.secondary">{lastRefreshFormatted}</Typography>
              </Stack>
            )}
          </Stack>
          
          {/* Injected Price Ticker */}
          {primaryStock?.quote && (
            <Stack direction="row" alignItems="center" gap={2}>
               <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight="bold">
                    ${primaryStock.quote.price.toFixed(2)}
                  </Typography>
               </Stack>
               <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.5}
                  sx={{
                    color: primaryStock.quote.change >= 0 ? "success.main" : "error.main",
                    bgcolor: primaryStock.quote.change >= 0
                      ? "rgba(34, 197, 94, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  {primaryStock.quote.change >= 0 ? (
                    <TrendingUp sx={{ fontSize: 14 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 14 }} />
                  )}
                  <Typography variant="caption" fontWeight="bold">
                    {primaryStock.quote.change >= 0 ? "+" : ""}
                    {primaryStock.quote.change.toFixed(2)} ({primaryStock.quote.changePercent.toFixed(2)}%)
                  </Typography>
                </Stack>
            </Stack>
          )}

        </Stack>
      </Container>
    </Box>
  );
}
