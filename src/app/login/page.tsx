"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import LoginForm from '@/features/auth/components/LoginForm';
import { useAuth } from '@/hooks';

export default function LoginPage() {
  const { isAuthenticated, isChecking } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isChecking && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isChecking, router]);

  if (isChecking) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return <LoginForm />;
}
