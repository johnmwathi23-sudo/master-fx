'use client';

import { useState, useEffect } from 'react';
import { Card, StatCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Gift, DollarSign } from 'lucide-react';
import { PageLoader } from '@/components/ui/loading';
import { api } from '@/lib/api-client';

interface ReferralStats {
  totalReferrals: number;
  paidReferrals: number;
  totalBonus: number;
  topReferrers: Array<{
    id: string;
    username: string;
    email: string;
    _count: { referredUsers: number };
  }>;
}

export default function AdminReferralsPage() {
  const [data, setData] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await api.get<ReferralStats>('/admin/referrals');
        setData(result);
      } catch (err) {
        console.error('Failed to fetch referral stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Referral Management</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Referrals" value={data?.totalReferrals ?? 0} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Total Bonus Paid" value={data?.totalBonus ?? 0} prefix="$" icon={<Gift className="w-5 h-5" />} />
        <StatCard title="Paid Referrals" value={data?.paidReferrals ?? 0} icon={<DollarSign className="w-5 h-5" />} />
      </div>

      <Card variant="glass" padding="none">
        <div className="p-4 border-b border-surface-3/30">
          <h2 className="text-lg font-semibold text-white">Top Referrers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-3/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Referrals</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topReferrers || []).map((r) => (
                <tr key={r.id} className="table-row">
                  <td className="px-6 py-4 text-sm text-white font-medium">{r.username}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{r.email}</td>
                  <td className="px-6 py-4 text-right text-sm text-brand-400 font-medium">{r._count.referredUsers}</td>
                </tr>
              ))}
              {(!data?.topReferrers || data.topReferrers.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">No referrers yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
