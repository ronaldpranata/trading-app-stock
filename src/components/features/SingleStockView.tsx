"use client";

import { 
  Box, 
  Grid, 
  Stack, 
  Tab, 
  Tabs, 
} from "@mui/material";
import PriceTicker from "@/components/features/PriceTicker";
import StockChart from "@/components/features/StockChart";
import TechnicalAnalysis from "@/components/features/TechnicalAnalysis";
import FundamentalAnalysis from "@/components/features/FundamentalAnalysis";
import PredictionDisplay from "@/components/features/PredictionDisplay";
import ElliottWaveDisplay from "@/components/features/ElliottWaveDisplay";
import CandlestickPatternsDisplay from "@/components/features/CandlestickPatternsDisplay";
import SignalsSummary from "@/components/features/SignalsSummary";
import KeyMetrics from "@/components/features/KeyMetrics";
import QuickStats from "@/components/features/QuickStats";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { ActiveTab } from "@/store";

interface SingleStockViewProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  primaryStock: any; // Using any for now to avoid complex type reconstruction, will refine if possible or rely on passed data structure
  currentPrice: number;
  symbol: string;
  isLoading: boolean;
}

const tabs: { id: ActiveTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "technical", label: "Technical" },
  { id: "fundamental", label: "Fundamental" },
  { id: "prediction", label: "Prediction" },
];

export default function SingleStockView({
  activeTab,
  setActiveTab,
  primaryStock,
  currentPrice,
  symbol,
  isLoading
}: SingleStockViewProps) {
  return (
    <>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, val) => setActiveTab(val)} 
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={3}>
              <PriceTicker
                quote={primaryStock?.quote || null}
                isLoading={isLoading}
              />
              <ErrorBoundary>
                <StockChart
                    data={primaryStock?.historicalData || []}
                    indicators={primaryStock?.technicalIndicators || null}
                    currentPrice={currentPrice}
                    symbol={symbol || ''}
                    isLoading={isLoading}
                />
              </ErrorBoundary>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <QuickStats
              quote={primaryStock?.quote || null}
              fundamentals={primaryStock?.fundamentalData || null}
              prediction={primaryStock?.prediction || null}
            />
          </Grid>
        </Grid>
      )}

      {activeTab === "technical" && (
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <ErrorBoundary>
                  <TechnicalAnalysis
                    indicators={primaryStock?.technicalIndicators || null}
                    currentPrice={currentPrice}
                  />
              </ErrorBoundary>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <ErrorBoundary>
                  <ElliottWaveDisplay
                    elliottWave={primaryStock?.technicalIndicators?.elliottWave}
                    currentPrice={currentPrice}
                  />
              </ErrorBoundary>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
             <Grid size={{ xs: 12, lg: 6 }}>
              <ErrorBoundary>
                  <CandlestickPatternsDisplay
                    analysis={primaryStock?.technicalIndicators?.candlestickAnalysis}
                  />
              </ErrorBoundary>
             </Grid>
          </Grid>
        </Stack>
      )}

      {activeTab === "fundamental" && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <FundamentalAnalysis
              data={primaryStock?.fundamentalData || null}
              currentPrice={currentPrice}
              symbol={symbol || ''}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <KeyMetrics fundamentals={primaryStock?.fundamentalData || null} />
          </Grid>
        </Grid>
      )}

      {activeTab === "prediction" && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <PredictionDisplay
              prediction={primaryStock?.prediction || null}
              sentimentData={primaryStock?.sentimentData}
              currentPrice={currentPrice}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <SignalsSummary
              signals={primaryStock?.prediction?.signals || []}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
