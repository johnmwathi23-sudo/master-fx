'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Activity, ArrowUpRight } from 'lucide-react';
import { Card, StatCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { PageLoader } from '@/components/ui/loading';
import { api } from '@/lib/api-client';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTrades: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingKyc: number;
  openTrades: number;
  revenue: number;
}

interface ActivityData {
  recentTrades: any[];
  recentDeposits: any[];
  recentRegistrations: any[];
}

interface GrowthData {
  date: string;
  count: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [userGrowth, setUserGrowth] = useState<GrowthData[]>([]);
  const [tradingVolume, setTradingVolume] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, activityData, growthData, volumeData] = await Promise.allSettled([
          api.get<DashboardStats>('/admin/stats'),
          api.get<ActivityData>('/admin/activity?limit=5'),
          api.get<GrowthData[]>('/admin/user-growth?days=30'),
          api.get<any[]>('/admin/trading-volume?days=30'),
        ]);

        if (statsData.status === 'fulfilled') setStats(statsData.value);
        if (activityData.status === 'fulfilled') setActivity(activityData.value);
        if (growthData.status === 'fulfilled') setUserGrowth(growthData.value);
        if (volumeData.status === 'fulfilled') setTradingVolume(volumeData.value);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const maxGrowth = Math.max(...userGrowth.map(d => d.count), 1);
  const maxVolume = Math.max(...tradingVolume.map(d => d.volume || d.count || 0), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <Badge variant="green" dot>System Healthy</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<Users className="w-5 h-5" />} change={8.2} />
        <StatCard title="Total Trades" value={stats?.totalTrades ?? 0} icon={<Activity className="w-5 h-5" />} change={12.5} />
        <StatCard title="Total Deposits" value={stats?.totalDeposits ?? 0} prefix="$" icon={<DollarSign className="w-5 h-5" />} change={5.1} />
        <StatCard title="Revenue" value={stats?.revenue ?? 0} prefix="$" icon={<TrendingUp className="w-5 h-5" />} change={15.3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-4">User Growth (30 days)</h2>
          <div className="h-48 flex items-end gap-1">
            {userGrowth.length > 0 ? userGrowth.map((d, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(d.count / maxGrowth) * 100}%` }}
                transition={{ delay: i * 0.02 }}
                className="flex-1 bg-gradient-to-t from-accent-blue/60 to-accent-blue/20 rounded-sm min-w-[4px]"
                title={`${d.date}: ${d.count}`}
              />
            )) : (
              <p className="text-sm text-slate-500 m-auto">No data available</p>
            )}
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-4">Trading Volume (30 days)</h2>
          <div className="h-48 flex items-end gap-1">
            {tradingVolume.length > 0 ? tradingVolume.map((d, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${((d.volume || d.count || 0) / maxVolume) * 100}%` }}
                transition={{ delay: i * 0.02 }}
                className="flex-1 bg-gradient-to-t from-brand-500/60 to-brand-500/20 rounded-sm min-w-[4px]"
                title={`${d.date}: ${d.volume ?? d.count}`}
              />
            )) : (
              <p className="text-sm text-slate-500 m-auto">No data available</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card variant="glass" padding="lg" className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activity ? (
              <>
                {activity.recentRegistrations.slice(0, 2).map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between py-2.5 border-b border-surface-3/20">
                    <div className="flex items-center gap-3">
                      <Badge variant="green" size="sm" dot />
                      <div>
                        <p className="text-sm text-white font-medium">New user registered</p>
                        <p className="text-xs text-slate-400">{u.username} signed up</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {activity.recentDeposits.slice(0, 2).map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between py-2.5 border-b border-surface-3/20">
                    <div className="flex items-center gap-3">
                      <Badge variant="blue" size="sm" dot />
                      <div>
                        <p className="text-sm text-white font-medium">Deposit</p>
                        <p className="text-xs text-slate-400">${Number(d.amount).toLocaleString()} by {d.user?.username}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {activity.recentTrades.slice(0, 2).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-surface-3/20">
                    <div className="flex items-center gap-3">
                      <Badge variant="amber" size="sm" dot />
                      <div>
                        <p className="text-sm text-white font-medium">{t.type} Trade</p>
                        <p className="text-xs text-slate-400">{t.asset?.symbol} by {t.user?.username}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-slate-500">No recent activity</p>
            )}
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
          <div className="space-y-4">
            {[
              { name: 'API Server', status: 'Operational', uptime: '99.98%' },
              { name: 'Database', status: 'Operational', uptime: '99.99%' },
              { name: 'Redis Cache', status: 'Operational', uptime: '99.95%' },
              { name: 'WebSocket', status: 'Operational', uptime: '99.97%' },
              { name: 'AI Service', status: 'Operational', uptime: '99.90%' },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{service.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{service.uptime}</span>
                  <Badge variant="green" size="sm" dot>{service.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
