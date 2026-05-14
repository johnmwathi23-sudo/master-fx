'use client';

import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'red' | 'blue' | 'amber' | 'purple' | 'default';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({ className, variant = 'default', size = 'sm', dot, children, ...props }: BadgeProps) {
  const variants = {
    green: 'bg-brand-500/15 text-brand-400',
    red: 'bg-red-500/15 text-red-400',
    blue: 'bg-accent-blue/15 text-blue-400',
    amber: 'bg-amber-500/15 text-amber-400',
    purple: 'bg-purple-500/15 text-purple-400',
    default: 'bg-surface-3/50 text-slate-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full font-medium', variants[variant], sizes[size], className)} {...props}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', {
          'bg-brand-400': variant === 'green',
          'bg-red-400': variant === 'red',
          'bg-blue-400': variant === 'blue',
          'bg-amber-400': variant === 'amber',
          'bg-purple-400': variant === 'purple',
          'bg-slate-400': variant === 'default',
        })} />
      )}
      {children}
    </span>
  );
}
