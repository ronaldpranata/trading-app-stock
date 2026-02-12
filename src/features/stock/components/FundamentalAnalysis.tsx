'use client';

import { FundamentalData } from '@/types/stock';
import { formatNumber, getPEGInterpretation } from '@/utils/fundamentalAnalysis';
import { Building2, TrendingUp, TrendingDown, Bitcoin, Zap } from 'lucide-react';
import { Box, Card, CardContent, Grid, Typography, Stack, LinearProgress, Divider, Chip } from '@mui/material';

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

  const fiftyTwoWeekPosition = data.fiftyTwoWeekHigh > data.fiftyTwoWeekLow 
    ? ((currentPrice - data.fiftyTwoWeekLow) / (data.fiftyTwoWeekHigh - data.fiftyTwoWeekLow)) * 100
    : 50;

  const pegInterpretation = getPEGInterpretation(data.pegRatio || 0);

  // Crypto view
  if (isCryptoAsset) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <Bitcoin size={16} color="#fb923c" /> {/* orange-400 */}
            <Typography variant="subtitle2" fontWeight="bold">Crypto Metrics</Typography>
          </Stack>
          
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <MetricBox label="Market Cap" value={data.marketCap} format={(v) => `$${formatNumber(v)}`} />
              </Grid>
              <Grid size={6}>
                 <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Beta</Typography>
                    <Typography variant="body1" fontWeight="bold" color={data.beta > 1.5 ? 'error.main' : 'text.primary'}>
                        {data.beta.toFixed(2)}
                    </Typography>
                 </Box>
              </Grid>
            </Grid>

            {data.fiftyTwoWeekHigh > 0 && (
              <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>52-Week Range</Typography>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color="error.main">${formatNumber(data.fiftyTwoWeekLow)}</Typography>
                  <Typography variant="caption" color="success.main">${formatNumber(data.fiftyTwoWeekHigh)}</Typography>
                </Stack>
                <Box sx={{ position: 'relative', height: 6, bgcolor: 'action.selected', borderRadius: 99 }}>
                    <Box sx={{ 
                        position: 'absolute', 
                        left: 0, top: 0, bottom: 0, right: 0, 
                        background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)',
                        borderRadius: 99,
                        opacity: 0.5
                    }} />
                    <Box sx={{ 
                        position: 'absolute', 
                        left: `${Math.min(100, Math.max(0, fiftyTwoWeekPosition))}%`, 
                        top: -2, 
                        width: 2, 
                        height: 10, 
                        bgcolor: 'common.white',
                        borderRadius: 1
                    }} />
                </Box>
              </Box>
            )}

            <Box sx={{ bgcolor: 'warning.dark', p: 1, borderRadius: 1, bgOpacity: 0.1 }}>
              <Typography variant="caption" color="warning.light">
                Traditional metrics (P/E, PEG) don't apply to crypto.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
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

            {/* Intrinsic Value */}
            {data.dcf && data.dcf.base > 0 && (
            <Box sx={{ 
                p: 1.5, 
                borderRadius: 1, 
                border: 1, 
                borderColor: data.dcf.base > currentPrice ? 'success.dark' : 'error.dark',
                bgcolor: data.dcf.base > currentPrice ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' 
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Box>
                    <Typography variant="caption" fontWeight="bold" display="block">Intrinsic Value</Typography>
                    <Typography variant="caption" color="text.secondary">
                    ({data.dcf.source === 'calculated' ? 'DCF Model' : 'Analyst Targets'})
                    </Typography>
                </Box>
                <Chip 
                    label={data.dcf.base > currentPrice ? 'Undervalued' : 'Overvalued'} 
                    size="small" 
                    color={data.dcf.base > currentPrice ? 'success' : 'error'} 
                    variant="outlined"
                />
                </Stack>
                
                <Stack spacing={1}>
                    <ValuationCaseRow label="Bull Case" value={data.dcf.bull} currentPrice={currentPrice} />
                    <ValuationCaseRow label="Base Case" value={data.dcf.base} currentPrice={currentPrice} />
                    <ValuationCaseRow label="Bear Case" value={data.dcf.bear} currentPrice={currentPrice} />
                </Stack>

                <Typography variant="caption" color="text.secondary" align="center" display="block" mt={1}>
                {data.dcf.base > currentPrice
                    ? `The base case suggests a potential upside of ${(((data.dcf.base - currentPrice) / currentPrice) * 100).toFixed(0)}%`
                    : `The base case suggests a potential downside of ${(((currentPrice - data.dcf.base) / data.dcf.base) * 100).toFixed(0)}%`
                }
                </Typography>
            </Box>
            )}

            {/* PEG Ratio - Featured */}
            <Box sx={{ 
                p: 1.5, 
                borderRadius: 1, 
                border: 1,
                borderColor: 'divider',
                bgcolor: data.pegRatio > 0 && data.pegRatio < 1 ? 'rgba(34, 197, 94, 0.05)' : data.pegRatio > 2 ? 'rgba(239, 68, 68, 0.05)' : 'action.hover'
            }}>
                <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                    <Zap size={12} className="text-yellow-400" />
                    <Typography variant="caption" fontWeight="medium">PEG Ratio</Typography>
                </Stack>
                <Stack direction="row" alignItems="baseline" gap={1}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: pegInterpretation.color === 'text-green-400' ? 'success.main' : pegInterpretation.color === 'text-red-400' ? 'error.main' : 'warning.main' }}>
                         {data.pegRatio > 0 ? data.pegRatio.toFixed(2) : 'N/A'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: pegInterpretation.color === 'text-green-400' ? 'success.main' : pegInterpretation.color === 'text-red-400' ? 'error.main' : 'warning.main' }}>
                        {pegInterpretation.label}
                    </Typography>
                </Stack>
                {data.pegRatio > 0 && (
                    <Typography variant="caption" color="text.secondary" mt={0.5}>
                         P/E ({data.peRatio.toFixed(1)}) ÷ Growth ({data.epsGrowth?.toFixed(1)}%)
                    </Typography>
                )}
            </Box>

            {/* Valuation Grid */}
            <Grid container spacing={1}>
                <Grid size={6}>
                    <MetricBox label="P/E Ratio" value={data.peRatio} format={(v) => v > 0 ? v.toFixed(1) : 'N/A'} good={15} bad={35} inverse />
                </Grid>
                <Grid size={6}>
                    <MetricBox label="P/B Ratio" value={data.pbRatio} format={(v) => v > 0 ? v.toFixed(2) : 'N/A'} good={1} bad={5} inverse />
                </Grid>
                <Grid size={6}>
                    <MetricBox label="EPS" value={data.eps} format={(v) => `$${v?.toFixed(2) || 'N/A'}`} />
                </Grid>
                <Grid size={6}>
                    <MetricBox label="EPS Growth" value={data.epsGrowth} format={(v) => v !== undefined ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` : 'N/A'} good={10} bad={0} />
                </Grid>
            </Grid>

            {/* Valuation */}
            <Grid container spacing={1}>
                <Grid size={4}>
                    <MetricBox label="P/S Ratio" value={data.psRatio} format={(v) => v.toFixed(2)} good={1} bad={2} inverse small />
                </Grid>
                <Grid size={4}>
                    <MetricBox label="EV/EBITDA" value={data.evToEbitda} format={(v) => v.toFixed(1)} good={10} bad={20} inverse small />
                </Grid>
                <Grid size={4}>
                    <MetricBox label="Debt/Equity" value={data.debtToEquity} format={(v) => v.toFixed(2)} good={0.5} bad={2} inverse small />
                </Grid>
            </Grid>

            {/* Profitability */}
            <Grid container spacing={1}>
                <Grid size={6}>
                     <MetricBox label="ROE" value={data.roe} format={(v) => `${v.toFixed(1)}%`} good={15} bad={5} />
                </Grid>
                <Grid size={6}>
                     <MetricBox label="Profit Margin" value={data.profitMargin} format={(v) => `${v.toFixed(1)}%`} good={15} bad={5} />
                </Grid>
            </Grid>
             {/* Growth & Health */}
            <Grid container spacing={1}>
                <Grid size={6}>
                   <MetricBox label="Revenue Growth" value={data.revenueGrowth} format={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`} good={10} bad={0} />
                </Grid>
                <Grid size={6}>
                   <MetricBox label="Beta" value={data.beta} format={(v) => v.toFixed(2)} />
                </Grid>
            </Grid>

             {/* Other */}
            <Grid container spacing={1}>
                <Grid size={6}>
                    <MetricBox label="Div Yield" value={data.dividendYield} format={(v) => `${v.toFixed(2)}%`} />
                </Grid>
                <Grid size={6}>
                    <MetricBox label="Avg Vol" value={data.avgVolume} format={(v) => formatNumber(v)} />
                </Grid>
            </Grid>

           {/* 52-Week Range */}
            {data.fiftyTwoWeekHigh > 0 && (
              <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>52-Week Range</Typography>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color="error.main">${formatNumber(data.fiftyTwoWeekLow)}</Typography>
                  <Typography variant="caption" color="success.main">${formatNumber(data.fiftyTwoWeekHigh)}</Typography>
                </Stack>
                <Box sx={{ position: 'relative', height: 6, bgcolor: 'action.selected', borderRadius: 99 }}>
                    <Box sx={{ 
                        position: 'absolute', 
                        left: 0, top: 0, bottom: 0, right: 0, 
                        background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)',
                        borderRadius: 99,
                        opacity: 0.5
                    }} />
                    <Box sx={{ 
                        position: 'absolute', 
                        left: `${Math.min(100, Math.max(0, fiftyTwoWeekPosition))}%`, 
                        top: -2, 
                        width: 2, 
                        height: 10, 
                        bgcolor: 'common.white',
                        borderRadius: 1
                    }} />
                </Box>
                <Typography variant="caption" color="text.secondary" align="center" display="block" mt={0.5}>
                     Current: ${currentPrice.toFixed(2)} ({fiftyTwoWeekPosition.toFixed(0)}%)
                </Typography>
              </Box>
            )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ValuationCaseRow({ label, value, currentPrice }: { label: string; value: number; currentPrice: number }) {
  const isUndervalued = value > currentPrice;
  const position = Math.min(100, Math.max(0, (currentPrice / value) * 100));

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="caption" color="text.secondary" sx={{ width: 48 }}>{label}</Typography>
        <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'action.selected', borderRadius: 99, position: 'relative' }}>
             <Box sx={{ 
                 position: 'absolute', 
                 left: 0, top: 0, bottom: 0, width: '100%', 
                 bgcolor: isUndervalued ? 'success.main' : 'error.main', 
                 opacity: 0.3, 
                 borderRadius: 99 
             }} />
             <Box sx={{ position: 'absolute', left: `${position}%`, top: 0, bottom: 0, width: 2, bgcolor: 'common.white' }} />
        </Box>
        <Typography variant="caption" fontWeight="bold" align="right" sx={{ width: 60, color: isUndervalued ? 'success.main' : 'error.main' }}>
            ${value.toFixed(2)}
        </Typography>
    </Stack>
  );
}

// Metric Box Component
function MetricBox({ 
  label, 
  value, 
  format, 
  good, 
  bad, 
  inverse = false,
  small = false,
  fullWidth = false
}: { 
  label: string; 
  value: number | undefined; 
  format: (v: number) => string;
  good?: number;
  bad?: number;
  inverse?: boolean;
  small?: boolean;
  fullWidth?: boolean;
}) {
  const getColor = () => {
    if (value === undefined || value === 0) return 'text.primary';
    if (good !== undefined && bad !== undefined) {
      const isGood = inverse ? value < good : value > good;
      const isBad = inverse ? value > bad : value < bad;
      if (isGood) return 'success.main';
      if (isBad) return 'error.main';
    }
    return 'text.primary';
  };

  return (
    <Box sx={{ 
        bgcolor: 'action.hover', 
        p: 1.5, 
        borderRadius: 1, 
        display: fullWidth ? 'flex' : 'block',
        alignItems: fullWidth ? 'center' : 'initial',
        justifyContent: fullWidth ? 'space-between' : 'initial'
    }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant={small ? "caption" : "body2"} fontWeight="bold" color={getColor()}>
        {value !== undefined ? format(value) : 'N/A'}
      </Typography>
    </Box>
  );
}
