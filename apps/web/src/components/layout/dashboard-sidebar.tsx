'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, TrendingUp, Wallet, Clock, Bot, Users, Settings,
  Bell, ChevronLeft, ChevronRight, LogOut, BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';

const sidebarItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/trade', label: 'Trade', icon: TrendingUp },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/history', label: 'History', icon: Clock },
  { href: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/dashboard/referrals', label: 'Referrals', icon: Users },
  { href: '/dashboard/notifications', label: 'Alerts', icon: Bell },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuthStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-surface-1 border-r border-surface-3/30 flex flex-col"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-surface-3/30">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Master FX</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center mx-auto">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-brand-400 bg-brand-500/10 border border-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-2',
                collapsed && 'justify-center px-0',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-surface-3/30 space-y-1">
        <Link
          href="/admin"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-surface-2 transition-all',
            collapsed && 'justify-center px-0',
          )}
        >
          <BarChart3 className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Admin</span>}
        </Link>
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full',
            collapsed && 'justify-center px-0',
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-surface-2 transition-all w-full',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
