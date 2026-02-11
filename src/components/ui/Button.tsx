import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { ReactNode } from 'react';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  children: ReactNode;
  variant?: 'text' | 'outlined' | 'contained' | 'ghost' | 'success'; 
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'contained', 
  isLoading, 
  className,
  ...props 
}: ButtonProps) {
  
  // Map custom variants to MUI variants where possible
  const muiVariant = variant === 'ghost' ? 'text' : 
                     variant === 'success' ? 'contained' : 
                     variant;

  const color = variant === 'success' ? 'success' : 
                variant === 'ghost' ? 'inherit' : 
                'primary';

  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      disabled={props.disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </MuiButton>
  );
}

export default Button;

import { ToggleButton as MuiToggleButton, ToggleButtonGroup as MuiToggleButtonGroup } from '@mui/material';

export function ButtonGroup({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={`flex rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export function ToggleButton({ 
  children, 
  active, 
  onClick, 
  className 
}: { 
  children: ReactNode, 
  active: boolean, 
  onClick: () => void, 
  className?: string 
}) {
    return (
        <MuiToggleButton
            value="check"
            selected={active}
            onChange={onClick}
            className={className}
            size="small"
            color="primary"
            style={{ border: 'none', borderRadius: 8 }}
        >
            {children}
        </MuiToggleButton>
    );
}
