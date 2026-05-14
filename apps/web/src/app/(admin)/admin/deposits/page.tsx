'use client';

import { useState, useEffect } from 'react';
import { Card, StatCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { PageLoader } from '@/components/ui/loading';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/toaster';

interface Transaction {
  id: string;
  amount: number;
  fee: number;
  status: string;
  description: string;
  createdAt: string;
  user: { email: string; username: string };
  paymentMethod?: string;
  walletAddress?: string;
}

interface Stats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

export default function AdminDepositsPage() {
  const [tab, setTab] = useState('deposits');
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, depositsData, withdrawalsData] = await Promise.allSettled([
        api.get<Stats>('/admin/stats'),
        api.get<{ data: Transaction[] }>('/admin/deposits?limit=20'),
        api.get<{ data: Transaction[] }>('/admin/withdrawals?limit=20'),
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (depositsData.status === 'fulfilled') setDeposits(depositsData.value.data || []);
      if (withdrawalsData.status === 'fulfilled') setWithdrawals(withdrawalsData.value.data || []);
    } catch (err) {
      console.error('Failed to fetch deposits data:', err);
    } finally {
      setLoading(false);
    }
  };

  const processWithdrawal = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.put(`/admin/withdrawals/${id}/${action}`);
      setWithdrawals(prev => prev.filter(w => w.id !== id));
      toast.success(`Withdrawal ${action}d`);
    } catch {
      toast.error(`Failed to ${action} withdrawal`);
    }
  };

  if (loading) return <PageLoader />;

  const currentData = tab === 'deposits' ? deposits : withdrawals;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Deposits & Withdrawals</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Deposits" value={stats?.totalDeposits ?? 0} prefix="$" icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Total Withdrawals" value={stats?.totalWithdrawals ?? 0} prefix="$" icon={<TrendingDown className="w-5 h-5" />} />
        <StatCard title="Pending Deposits" value={deposits.filter(d => d.status === 'PENDING').length} icon={<Clock className="w-5 h-5" />} />
        <StatCard title="Pending Withdrawals" value={withdrawals.filter(w => w.status === 'PENDING').length} icon={<Clock className="w-5 h-5" />} />
      </div>

      <Tabs tabs={[{ id: 'deposits', label: 'Deposits' }, { id: 'withdrawals', label: 'Withdrawals' }]} activeTab={tab} onChange={setTab} variant="pills" />

      <Card variant="glass" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-3/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Details</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                {tab === 'withdrawals' && <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentData.map((tx) => (
                <tr key={tx.id} className="table-row">
                  <td className="px-6 py-4 text-sm text-white font-medium">{tx.user?.username || 'Unknown'}</td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-white">${Number(tx.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{tx.description || tx.paymentMethod || '-'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={tx.status === 'COMPLETED' ? 'green' : tx.status === 'PENDING' ? 'amber' : 'red'} size="sm">
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  {tab === 'withdrawals' && tx.status === 'PENDING' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => processWithdrawal(tx.id, 'approve')} leftIcon={<CheckCircle className="w-4 h-4 text-brand-400" />}>
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => processWithdrawal(tx.id, 'reject')} leftIcon={<XCircle className="w-4 h-4 text-red-400" />}>
                          Reject
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={tab === 'withdrawals' ? 6 : 5} className="px-6 py-8 text-center text-sm text-slate-500">No {tab} found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
