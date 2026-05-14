'use client';

import { useState } from 'react';
import { Copy, Users, Gift, Share2, Check } from 'lucide-react';
import { Card, StatCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toaster';

const mockReferrals = [
  { username: 'trader_1', bonus: 25, isPaid: true, joinedAt: '2024-12-01' },
  { username: 'trader_2', bonus: 25, isPaid: true, joinedAt: '2024-12-05' },
  { username: 'trader_3', bonus: 25, isPaid: true, joinedAt: '2024-12-08' },
  { username: 'trader_4', bonus: 0, isPaid: false, joinedAt: '2024-12-12' },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'DEMO4K2X';
  const referralLink = `https://master-fx.com/ref/${referralCode}`;
  const toast = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Link copied!', 'Share it with friends to earn bonuses.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Referral Program</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Referrals" value={4} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Total Earned" value={75} prefix="$" icon={<Gift className="w-5 h-5" />} />
        <StatCard title="Paid Out" value={75} prefix="$" icon={<Check className="w-5 h-5" />} />
        <StatCard title="Pending" value={1} icon={<Share2 className="w-5 h-5" />} />
      </div>

      <Card variant="glass" padding="lg">
        <h2 className="text-lg font-semibold text-white mb-4">Your Referral Link</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 font-mono text-sm text-slate-200 truncate">
            {referralLink}
          </div>
          <Button onClick={copyCode} variant={copied ? 'primary' : 'secondary'} leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="text-sm text-slate-400">Share this link with friends. When they sign up and make their first deposit, you both earn $25 bonus!</p>
      </Card>

      <Card variant="glass" padding="none">
        <div className="p-4 border-b border-surface-3/30">
          <h2 className="text-lg font-semibold text-white">Referred Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-3/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Bonus</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody>
              {mockReferrals.map((ref) => (
                <tr key={ref.username} className="table-row">
                  <td className="px-6 py-4 text-sm text-white font-medium">{ref.username}</td>
                  <td className="px-6 py-4 text-right text-sm text-white">${ref.bonus}</td>
                  <td className="px-6 py-4 text-right"><Badge variant={ref.isPaid ? 'green' : 'amber'} size="sm">{ref.isPaid ? 'Paid' : 'Pending'}</Badge></td>
                  <td className="px-6 py-4 text-right text-sm text-slate-400">{ref.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
