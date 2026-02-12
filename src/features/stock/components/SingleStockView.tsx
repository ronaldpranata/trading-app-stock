"use client";

import { 
  Box, 
  Grid, 
  Stack, 
  Tab, 
  Tabs, 
} from "@mui/material";
import PriceTicker from "./PriceTicker";
import StockChart from "./StockChart";
import TechnicalAnalysis from "./TechnicalAnalysis";
import FundamentalAnalysis from "./FundamentalAnalysis";
import PredictionDisplay from "./PredictionDisplay";
import ElliottWaveDisplay from "./ElliottWaveDisplay";
import CandlestickPatternsDisplay from "./CandlestickPatternsDisplay";
import SignalsSummary from "./SignalsSummary";
import KeyMetrics from "./KeyMetrics";
import QuickStats from "./QuickStats";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { useStock, useUI } from "@/hooks";
import { ActiveTab } from "@/store";

const tabs: { id: ActiveTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "technical", label: "Technical" },
  { id: "fundamental", label: "Fundamental" },
  { id: "prediction", label: "Prediction" },
];

export default function SingleStockView() {
  const { primaryStock, currentPrice, symbol, isLoading } = useStock();
  const { activeTab, setActiveTab } = useUI();
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
              <PriceTicker />
              <ErrorBoundary>
                <StockChart />
              </ErrorBoundary>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <QuickStats
              quote={primaryStock?.quote || null}
              fundamentals={primaryStock?.fundamentalData || null}
              prediction={primaryStock?.prediction || null}
              isLoading={isLoading}
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
              currentPrice={currentPrice}
              isLoading={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <SignalsSummary
              signals={primaryStock?.prediction?.signals || []}
              recommendation={primaryStock?.prediction?.recommendation}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
