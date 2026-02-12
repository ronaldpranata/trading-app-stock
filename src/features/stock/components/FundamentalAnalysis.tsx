'use client';

import { FundamentalData } from '@/types/stock';
import { formatNumber } from '@/utils/fundamentalAnalysis';
import { Building2 } from 'lucide-react';
import { Card, CardContent, Typography, Stack } from '@mui/material';

import MetricBox from './fundamental/MetricBox';
import CryptoMetrics from './fundamental/CryptoMetrics';
import ValuationAnalysis from './fundamental/ValuationAnalysis';
import ProfitabilityGrowth from './fundamental/ProfitabilityGrowth';

interface FundamentalAnalysisProps {
  data: FundamentalData | null;
  currentPrice: number;
  symbol?: string;
}

function isCrypto(symbol: string): boolean {
  return symbol?.includes('-USD') || symbol?.includes('-EUR') || symbol?.includes('-GBP') || false;
}

export default function FundamentalAnalysis({ data, currentPrice, symbol = '' }: FundamentalAnalysisProps) {
  const isCryptoAsset = isCrypto(symbol);
  
  if (!data) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Fundamental Analysis</Typography>
          <Typography variant="body2" color="text.secondary">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  // Crypto view
  if (isCryptoAsset) {
    return <CryptoMetrics data={data} currentPrice={currentPrice} />;
  }

  // Stock view
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <Building2 size={16} color="#c084fc" /> {/* purple-400 */}
          <Typography variant="subtitle2" fontWeight="bold">Fundamental Analysis</Typography>
        </Stack>
        
        <Stack spacing={2}>
            {/* Market Cap */}
            <MetricBox label="Market Cap" value={data.marketCap} format={(v) => `$${formatNumber(v)}`} fullWidth />

            <ValuationAnalysis data={data} currentPrice={currentPrice} />
            
            <ProfitabilityGrowth data={data} currentPrice={currentPrice} />
        </Stack>
      </CardContent>
    </Card>
  );
}
