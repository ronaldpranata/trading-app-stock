"use client";

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { checkAuth } from '@/store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return <>{children}</>;
}
