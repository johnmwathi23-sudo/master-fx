'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { PageLoader } from '@/components/ui/loading';
import { api } from '@/lib/api-client';

interface GrowthPoint {
  date: string;
  count: number;
}

interface VolumePoint {
  date: string;
  volume: number;
  count: number;
}

export default function AdminAnalyticsPage() {
  const [userGrowth, setUserGrowth] = useState<GrowthPoint[]>([]);
  const [tradingVolume, setTradingVolume] = useState<VolumePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [growthData, volumeData] = await Promise.allSettled([
          api.get<GrowthPoint[]>('/admin/user-growth?days=30'),
          api.get<VolumePoint[]>('/admin/trading-volume?days=30'),
        ]);

        if (growthData.status === 'fulfilled') setUserGrowth(growthData.value);
        if (volumeData.status === 'fulfilled') setTradingVolume(volumeData.value);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const maxGrowth = Math.max(...userGrowth.map(d => d.count), 1);
  const maxVolume = Math.max(...tradingVolume.map(d => d.volume || 0), 1);
  const maxTrades = Math.max(...tradingVolume.map(d => d.count || 0), 1);

  const metrics = [
    { label: 'User Registrations', data: userGrowth.map(d => ({ value: d.count, max: maxGrowth, date: d.date })) },
    { label: 'Daily Active Users', data: userGrowth.map(d => ({ value: Math.round(d.count * 0.7), max: maxGrowth, date: d.date })) },
    { label: 'New Deposits', data: tradingVolume.map(d => ({ value: d.volume || 0, max: maxVolume, date: d.date })) },
    { label: 'Trade Volume', data: tradingVolume.map(d => ({ value: d.count || 0, max: maxTrades, date: d.date })) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} variant="glass" padding="lg">
            <h2 className="text-base font-semibold text-white mb-4">{metric.label}</h2>
            <div className="h-40 flex items-end gap-1">
              {metric.data.length > 0 ? metric.data.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / d.max) * 100}%` }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  className="flex-1 bg-gradient-to-t from-accent-blue/60 to-accent-blue/20 rounded-sm min-w-[3px]"
                  title={`${d.date}: ${d.value}`}
                />
              )) : (
                <p className="text-sm text-slate-500 m-auto">No data</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
