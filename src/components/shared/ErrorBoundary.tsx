'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Warning, Refresh } from '@mui/icons-material';
import { Box, Typography, Button, Paper } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * NOTE: Error Boundaries must be Class Components.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Call optional onError prop (e.g., for logging to Sentry)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Reload logic could go here if needed, but often resetting state is enough
    // to retry rendering the children if the error was transient
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Paper 
          variant="outlined" 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            p: 3, 
            minHeight: 200, 
            textAlign: 'center',
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.2)'
          }}
        >
          <Box sx={{ color: 'error.main', mb: 2 }}>
             <Warning sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
            {this.state.error?.message || 'An unexpected error occurred in this component.'}
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<Refresh fontSize="small" />}
            onClick={this.handleRetry}
            sx={{ textTransform: 'none' }}
          >
            Try Again
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
