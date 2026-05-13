'use client';

import { cn } from '@nextrade/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'hover' | 'stat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ className, variant = 'default', padding = 'md', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-surface-1 border border-surface-3/30 rounded-2xl',
    glass: 'bg-surface-1/80 backdrop-blur-xl border border-surface-3/50 rounded-2xl',
    hover: 'bg-surface-1 border border-surface-3/30 rounded-2xl hover:border-surface-4/50 hover:shadow-card transition-all duration-300',
    stat: 'bg-surface-1/80 backdrop-blur-xl border border-surface-3/50 rounded-2xl p-6',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(variants[variant], padding !== 'none' && paddings[padding], className)} {...props}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

export function StatCard({ title, value, change, icon, prefix = '', suffix = '' }: StatCardProps) {
  return (
    <Card variant="stat">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-100">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change !== undefined && (
            <p className={cn('text-sm font-medium', change >= 0 ? 'text-brand-400' : 'text-red-400')}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-surface-2 text-slate-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
