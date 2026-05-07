import React from 'react';
import { cn } from '../../utils/cn';

type ChipVariant = 'success' | 'warning' | 'danger' | 'orange' | 'default';

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
}

export const Chip: React.FC<ChipProps> = ({ variant = 'default', className, children, ...props }) => {
  const variants = {
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-danger/20 text-danger',
    orange: 'bg-orange/20 text-orange',
    default: 'bg-bg-stripe text-text-muted',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
