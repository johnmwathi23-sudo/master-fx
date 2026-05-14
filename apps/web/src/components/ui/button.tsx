'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-green/0 hover:shadow-glow-green/30',
      secondary: 'bg-surface-2 hover:bg-surface-3 text-slate-200 border border-surface-3',
      ghost: 'hover:bg-surface-2 text-slate-300',
      danger: 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20',
      outline: 'bg-transparent hover:bg-surface-2 text-slate-300 border border-surface-3',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-8 py-3.5 text-base rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
