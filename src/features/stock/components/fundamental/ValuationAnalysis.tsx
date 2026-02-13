"use client";

import { FundamentalData } from '@/types/stock';
import { getPEGInterpretation } from '@/utils/fundamentalAnalysis';
import { Bolt } from "@mui/icons-material";
import { Box, Grid, Typography, Stack, Chip } from '@mui/material';
import MetricBox from './MetricBox';

interface ValuationAnalysisProps {
  data: FundamentalData;
  currentPrice: number;
}

export default function ValuationAnalysis({ data, currentPrice }: ValuationAnalysisProps) {
  const pegInterpretation = getPEGInterpretation(data.pegRatio || 0);

  return (
    <>
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
                <Bolt sx={{ fontSize: 16, color: "#eab308" }} />
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
    </>
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
