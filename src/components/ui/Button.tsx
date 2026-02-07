'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
}

const variantStyles = {
  default: 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-gray-700',
  primary: 'bg-blue-500 text-white hover:bg-blue-600 border-blue-500',
  success: 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30',
  danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30',
  ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50 border-transparent'
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-sm'
};

export function Button({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  active = false,
  disabled = false,
  className = '',
  title
}: ButtonProps) {
  const activeStyle = active ? 'ring-2 ring-blue-500/50' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex items-center gap-2 rounded-lg border transition-all
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${activeStyle}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className = '' }: ButtonGroupProps) {
  return (
    <div className={`flex bg-gray-800/50 rounded-lg p-0.5 ${className}`}>
      {children}
    </div>
  );
}

interface ToggleButtonProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export function ToggleButton({ children, active, onClick, className = '' }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-2.5 py-1 text-xs font-medium rounded transition-all
        ${active ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
