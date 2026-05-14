'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Shield, DollarSign, BarChart3, TrendingUp,
  Bell, FileText, Settings, ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/kyc', label: 'KYC', icon: Shield },
  { href: '/admin/deposits', label: 'Deposits', icon: DollarSign },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/revenue', label: 'Revenue', icon: TrendingUp },
  { href: '/admin/referrals', label: 'Referrals', icon: Users },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/cms', label: 'CMS', icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn('fixed left-0 top-0 bottom-0 z-40 bg-surface-1 border-r border-surface-3/30 flex flex-col transition-all duration-200', collapsed ? 'w-[72px]' : 'w-64')}>
      <div className="h-16 flex items-center px-4 border-b border-surface-3/30">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-purple/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-lg font-bold text-white">Admin</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-accent-purple/20 flex items-center justify-center mx-auto">
            <Settings className="w-5 h-5 text-purple-400" />
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {adminLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-surface-2',
                collapsed && 'justify-center',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-surface-3/30">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-surface-2 transition-all w-full"
        >
          <ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
