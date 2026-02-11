"use client";

import { useEffect, useState, useCallback } from "react";
import CompareView from "@/components/features/CompareView";
import CompareStockSelector from "@/components/features/CompareStockSelector";
import BoxLogin from "@/components/features/BoxLogin";
import StatusBar from "@/components/features/StatusBar";
import AppLayout from "@/components/layout/AppLayout";
import SingleStockView from "@/components/features/SingleStockView";

import { useAuth, useStock, useUI, useAutoRefresh } from "@/hooks";
import { 
  Box, 
  Container, 
  Stack, 
  Typography, 
  CircularProgress,
} from "@mui/material";

export default function Home() {
  // Custom hooks
  const auth = useAuth();
  const stock = useStock();
  const ui = useUI();

  // Local state for login form
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auto refresh setup
  const handleRefresh = useCallback(() => {
    stock.refresh();
  }, [stock]);

  useAutoRefresh({
    symbol: stock.symbol || undefined,
    onRefresh: handleRefresh,
    interval: 10000,
  });

  // Initial stock load
  useEffect(() => {
    if (auth.isAuthenticated && !stock.primaryStock) {
      stock.load("AAPL");
    }
  }, [auth.isAuthenticated, stock.primaryStock, stock]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    
    const success = await auth.login(password);
    setIsLoggingIn(false);
    
    if (!success) {
      setLoginError(auth.error || "Invalid password");
    } else {
      setPassword("");
    }
  };

  const handleSymbolChange = (symbol: string) => {
    if (ui.isCompareMode) {
      stock.addComparison(symbol);
    } else {
      stock.load(symbol);
    }
  };

  // Loading state
  if (auth.isChecking) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">Loading...</Typography>
        </Stack>
      </Box>
    );
  }

  // Login screen
  if (!auth.isAuthenticated) {
    return <BoxLogin handleLogin={handleLogin} 
              password={password} 
              setPassword={setPassword} 
              isLoggingIn={isLoggingIn} 
              loginError={loginError}/>;
  }

  const predictionDirection = stock.primaryStock?.prediction?.direction || "NEUTRAL";

  // Header Props
  const headerProps = {
    viewMode: ui.viewMode,
    setViewMode: ui.setViewMode,
    currentSymbol: stock.symbol || '',
    onSelectStock: handleSymbolChange,
    onRefresh: () => stock.refresh(),
    isLoading: stock.isLoading,
    autoRefreshEnabled: ui.autoRefreshEnabled,
    toggleAutoRefresh: ui.toggleAutoRefresh,
    onLogout: auth.logout
  };

  // Main app
  return (
    <AppLayout headerProps={headerProps}>
      {/* Compare Mode: Stock Pills */}
      {ui.isCompareMode && (
        <CompareStockSelector
          symbol={stock.symbol || ''}
          primaryStock={stock.primaryStock}
          compareStocks={stock.compareStocks}
          onRemove={stock.removeCompare}
          canAddMore={stock.canAddMoreComparisons}
        />
      )}

      {/* Status Bar */}
      <StatusBar
        symbol={stock.symbol || ''}
        predictionDirection={predictionDirection}
        isLoading={stock.isLoading}
        lastRefreshFormatted={ui.lastRefreshFormatted}
        autoRefreshEnabled={ui.autoRefreshEnabled}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
        {ui.isCompareMode ? (
          <CompareView
            primaryStock={stock.primaryStock || { symbol: "", isLoading: false, error: null, quote: null, historicalData: [], fundamentalData: null, technicalIndicators: null, prediction: null }}
            compareStocks={stock.compareStocks}
          />
        ) : (
          <SingleStockView
            activeTab={ui.activeTab}
            setActiveTab={ui.setActiveTab}
            primaryStock={stock.primaryStock}
            currentPrice={stock.currentPrice}
            symbol={stock.symbol || ''}
            isLoading={stock.isLoading}
          />
        )}
      </Container>
    </AppLayout>
  );
}
