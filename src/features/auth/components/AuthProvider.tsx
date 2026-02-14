"use client";

import { useCheckAuthQuery } from '@/features/auth/services/authApi';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Automatically check auth on mount (cached by RTK Query)
  useCheckAuthQuery();

  return <>{children}</>;
}
