"use client";

import { TrendingUp, TrendingDown, Bitcoin } from "lucide-react";
import { Box, Typography, Stack, Card, Skeleton } from "@mui/material";
import { useStock } from "@/hooks";

export default function PriceTicker() {
  const { primaryStock, isLoading } = useStock();
  const quote = primaryStock?.quote;

  if (isLoading || !quote) {
    return (
      <Card variant="outlined" sx={{ p: 2, mb: 3 }} data-testid="loading-skeleton">
        <Stack direction="row" gap={2} alignItems="center">
          <Skeleton variant="rounded" width={56} height={56} />
          <Box sx={{ width: "100%" }}>
            <Skeleton width={120} height={32} sx={{ mb: 1 }} />
            <Skeleton width={180} height={24} />
          </Box>
        </Stack>
      </Card>
    );
  }

  const { symbol, price, change, changePercent } = quote;
  const isPositive = change >= 0;
  const isCrypto = symbol.includes("-USD");

  return (
    <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Stack direction="row" gap={2} alignItems="center">
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isCrypto ? (
              <Bitcoin size={24} color="#fb923c" /> /* orange-400 */
            ) : (
              <TrendingUp size={24} color="#60a5fa" /> /* blue-400 */
            )}
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography variant="h4" fontWeight="bold" component="h1">
                {symbol}
              </Typography>
              {/* Name not available in StockQuote, omitting or needs update via prop if needed */}
            </Stack>
            <Stack direction="row" alignItems="center" gap={2} mt={0.5}>
              <Typography variant="h5" fontWeight="medium">
                ${price.toFixed(2)}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                sx={{
                  color: isPositive ? "success.main" : "error.main",
                  bgcolor: isPositive
                    ? "rgba(34, 197, 94, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
                data-testid="price-change"
              >
                {isPositive ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <Typography variant="body2" fontWeight="bold">
                  {isPositive ? "+" : ""}
                  {change.toFixed(2)} ({changePercent.toFixed(2)}%)
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}
