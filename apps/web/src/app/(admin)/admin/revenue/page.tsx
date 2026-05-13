'use client';

import { useState, useEffect } from 'react';
import { Card, StatCard } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Gift } from 'lucide-react';
import { PageLoader } from '@/components/ui/loading';
import { api } from '@/lib/api-client';

interface RevenuePoint {
  date: string;
  revenue: number;
}

interface DashboardStats {
  totalDeposits: number;
  totalWithdrawals: number;
  revenue: number;
  totalTrades: number;
}

export default function AdminRevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [revenueResult, statsResult] = await Promise.allSettled([
          api.get<RevenuePoint[]>('/admin/revenue?days=30'),
          api.get<DashboardStats>('/admin/stats'),
        ]);

        if (revenueResult.status === 'fulfilled') setRevenueData(revenueResult.value);
        if (statsResult.status === 'fulfilled') setStats(statsResult.value);
      } catch (err) {
        console.error('Failed to fetch revenue data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue || 0), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Revenue</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Platform Revenue" value={stats?.revenue ?? 0} prefix="$" icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Total Trades" value={stats?.totalTrades ?? 0} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Total Deposits" value={stats?.totalDeposits ?? 0} prefix="$" icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Total Withdrawals" value={stats?.totalWithdrawals ?? 0} prefix="$" icon={<Gift className="w-5 h-5" />} />
      </div>

      <Card variant="glass" padding="lg">
        <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend (30 days)</h2>
        <div className="h-64 flex items-end gap-1">
          {revenueData.length > 0 ? revenueData.map((d, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
              transition={{ delay: i * 0.02 }}
              className="flex-1 bg-gradient-to-t from-brand-500/70 to-brand-500/20 rounded-sm min-w-[4px]"
              title={`${d.date}: $${d.revenue.toFixed(2)}`}
            />
          )) : (
            <p className="text-sm text-slate-500 m-auto">No revenue data available</p>
          )}
        </div>
      </Card>
    </div>
  );
}
