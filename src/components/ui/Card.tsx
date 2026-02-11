import { Card as MuiCard, CardContent as MuiCardContent, CardProps as MuiCardProps } from '@mui/material';
import { ReactNode } from 'react';

interface CardProps extends MuiCardProps {
  children: ReactNode;
  noPadding?: boolean;
}

export function Card({ children, className, noPadding = false, ...props }: CardProps) {
  return (
    <MuiCard 
      elevation={0} 
      className={className}
      {...props}
    >
      {noPadding ? children : <CardContent>{children}</CardContent>}
    </MuiCard>
  );
}

// Wrapper for backward compatibility or specific styling
export function CardHeader({ children, className, action }: { children: ReactNode, className?: string, action?: ReactNode }) {
  return (
    <div className={`p-4 pb-0 flex items-center justify-between ${className}`}>
      <div className="font-semibold">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardContent({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <MuiCardContent className={`!p-4 ${className}`}>
        {children}
    </MuiCardContent>
  );
}

export default Card;
