'use client';

import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { useStock } from '@/hooks';
import PriceCardsGrid from './compare/PriceCardsGrid';
import PerformanceSection from './compare/PerformanceSection';

export default function CompareView() {
  const { primaryStock, compareStocks } = useStock();
  
  // Guard clause for when primaryStock might be null (though usually loaded by page.tsx)
  const safePrimaryStock = primaryStock || { 
      symbol: "Loading...", 
      quote: null, 
      historicalData: [], 
      fundamentalData: null, 
      technicalIndicators: null, 
      prediction: null,
      sentimentData: undefined,
      isLoading: true,
      error: null
  };

  const allStocks = useMemo(() => [safePrimaryStock, ...compareStocks], [safePrimaryStock, compareStocks]);

  return (
    <Stack spacing={3}>
      {/* Price Comparison Cards - Unaffected by Time Range State */}
      <PriceCardsGrid stocks={allStocks} />

      {/* Performance Section - Contains its own Time Range State */}
      <PerformanceSection stocks={allStocks} />
    </Stack>
  );
}
