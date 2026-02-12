"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import CompareView from "@/features/stock/components/CompareView";
import CompareStockSelector from "@/features/stock/components/CompareStockSelector";
import LoginForm from "@/features/auth/components/LoginForm";
import StatusBar from "@/components/layout/StatusBar";
import AppLayout from "@/components/layout/AppLayout";
import SingleStockView from "@/features/stock/components/SingleStockView";

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

  // Login screen
  if (!auth.isAuthenticated) {
    return <LoginForm />;
  }

  const predictionDirection = stock.primaryStock?.prediction?.direction || "NEUTRAL";



  // Main app
  return (
    <AppLayout>
      {/* Compare Mode: Stock Pills */}
      {ui.isCompareMode && (
        <CompareStockSelector />
      )}

      {/* Status Bar */}
      <StatusBar />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
        {ui.isCompareMode ? (
          <CompareView />
        ) : (
          <SingleStockView />
        )}
      </Container>
    </AppLayout>
  );
}
