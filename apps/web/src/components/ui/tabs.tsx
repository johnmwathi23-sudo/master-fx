'use client';

import { cn } from '@nextrade/utils';

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'default', className }: TabsProps) {
  const variants = {
    default: 'bg-surface-2 rounded-xl p-1',
    pills: 'gap-2',
    underline: 'border-b border-surface-3',
  };

  const tabVariants = {
    default: (active: boolean) =>
      cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', active ? 'bg-surface-3 text-white' : 'text-slate-400 hover:text-slate-200'),
    pills: (active: boolean) =>
      cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', active ? 'bg-brand-500/15 text-brand-400' : 'text-slate-400 hover:text-slate-200'),
    underline: (active: boolean) =>
      cn('px-4 py-3 text-sm font-medium transition-all border-b-2', active ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'),
  };

  return (
    <div className={cn('flex items-center', variants[variant], className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn('flex items-center gap-2', tabVariants[variant](activeTab === tab.id))}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
