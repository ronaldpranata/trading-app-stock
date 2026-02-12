"use client";

import { 
  Box, 
  Container, 
  Stack, 
  Typography, 
  Button 
} from "@mui/material";
import { Plus } from "lucide-react";
import StockPill from "@/components/shared/StockPill";
import { StockData } from "@/types/stock";

import { useStock } from "@/hooks";

export default function CompareStockSelector() {
  const { symbol, primaryStock, compareStocks, removeCompare, canAddMoreComparisons } = useStock();

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover', py: 1 }}>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" gap={2} overflow="auto">
          <Typography variant="caption" color="text.secondary" whiteSpace="nowrap">Comparing:</Typography>

          {/* Primary Stock */}
          <StockPill
            symbol={symbol || ''}
            change={primaryStock?.quote?.changePercent}
            color="blue"
          />

          {/* Compare Stocks */}
          {compareStocks.map((s, index) => (
            <StockPill
              key={s.symbol}
              symbol={s.symbol}
              change={s.quote?.changePercent}
              color={index === 0 ? "purple" : "orange"}
              onRemove={() => removeCompare(s.symbol)}
            />
          ))}

          {canAddMoreComparisons && (
            <Button variant="outlined" startIcon={<Plus size={14} />} size="small" sx={{ borderRadius: 10, whiteSpace: 'nowrap' }}>
              Add Stock
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
