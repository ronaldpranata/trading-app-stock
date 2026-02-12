"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import CompareView from "@/features/stock/components/CompareView";
import CompareStockSelector from "@/features/stock/components/CompareStockSelector";
import StatusBar from "@/components/layout/StatusBar";
import AppLayout from "@/components/layout/AppLayout";
import SingleStockView from "@/features/stock/components/SingleStockView";

import { useAuth, useStock, useUI } from "@/hooks";
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

  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!auth.isChecking && !auth.isAuthenticated) {
      router.replace('/login');
    }
  }, [auth.isChecking, auth.isAuthenticated, router]);

  // Loading state
  if (auth.isChecking) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Prevent flash of content
  if (!auth.isAuthenticated) {
    return null;
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
