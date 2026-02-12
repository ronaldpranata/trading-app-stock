"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode } from 'react';
import AuthProvider from '@/features/auth/components/AuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}
