"use client";

import { StockData } from "@/types/stock";
import { Card, CardContent, Typography, Stack, Grid, Chip, Box } from "@mui/material";
import { TrendingUp, TrendingDown } from "lucide-react";

const COLORS = [
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#f97316', // Orange
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#eab308', // Yellow
];

interface PriceCardsGridProps {
  stocks: StockData[];
}

export default function PriceCardsGrid({ stocks }: PriceCardsGridProps) {
  return (
    <Grid container spacing={2}>
      {stocks.map((stock, index) => (
        <Grid size={{xs:12, md:4}} key={stock.symbol}>
          <PriceCard stock={stock} color={COLORS[index % COLORS.length]} />
        </Grid>
      ))}
      {stocks.length < 3 && (
        <Grid size={{xs:12, md:4}}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              bgcolor: 'action.hover', 
              borderStyle: 'dashed' 
            }}
          >
             <Typography color="text.secondary" variant="body2">Search to add another stock</Typography>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

function PriceCard({ stock, color }: { stock: StockData; color: string }) {
  if (!stock.quote) {
    return (
      <Card variant="outlined" sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Card>
    );
  }

  const isPositive = stock.quote.change >= 0;

  return (
    <Card elevation={0} sx={{ borderTop: 3, borderTopColor: color, borderLeft: 1, borderRight: 1, borderBottom: 1, borderColor: 'divider' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="bold" sx={{ color }}>{stock.symbol}</Typography>
          {stock.quote.simulated && (
             <Chip label="SIM" size="small" color="warning" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
          )}
        </Stack>
        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
          ${stock.quote.price.toFixed(2)}
        </Typography>
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ color: isPositive ? 'success.main' : 'error.main' }}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <Typography variant="body2" fontWeight="bold" color="inherit">
            {isPositive ? '+' : ''}{stock.quote.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.quote.changePercent.toFixed(2)}%)
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
