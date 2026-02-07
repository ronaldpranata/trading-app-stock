'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return <Loader2 className={`animate-spin text-blue-400 ${sizeStyles[size]} ${className}`} />;
}

interface LoadingCardProps {
  height?: string;
  className?: string;
}

export function LoadingCard({ height = 'h-64', className = '' }: LoadingCardProps) {
  return (
    <div className={`bg-gray-900/50 rounded-xl border border-gray-800/50 flex items-center justify-center ${height} ${className}`}>
      <LoadingSpinner size="lg" />
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`bg-gray-800 rounded animate-pulse ${className}`} />;
}

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className = '' }: SkeletonCardProps) {
  return (
    <div className={`bg-gray-900/50 rounded-xl p-4 border border-gray-800/50 ${className}`}>
      <Skeleton className="h-6 w-24 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'} mb-2`} />
      ))}
    </div>
  );
}
