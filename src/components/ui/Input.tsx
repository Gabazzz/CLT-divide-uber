import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-semibold text-text-muted">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border border-border-subtle bg-bg-main px-4 py-2.5 text-text-main transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
              icon && 'pl-10',
              error && 'border-danger focus:border-danger focus:ring-danger',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-semibold text-text-muted">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-border-subtle bg-bg-main px-4 py-2.5 text-text-main transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y min-h-[80px]',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
