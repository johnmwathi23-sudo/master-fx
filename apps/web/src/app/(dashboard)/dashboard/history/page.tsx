'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const trades = [
  { id: '1', symbol: 'EUR/USD', type: 'BUY', amount: 2500, entry: 1.08500, exit: 1.08750, pnl: +62.50, status: 'CLOSED', date: '2024-12-14 14:30', isDemo: false },
  { id: '2', symbol: 'BTC/USD', type: 'SELL', amount: 500, entry: 67500, exit: 66800, pnl: +87.50, status: 'CLOSED', date: '2024-12-14 12:15', isDemo: false },
  { id: '3', symbol: 'GOLD', type: 'BUY', amount: 1000, entry: 2345.50, exit: 2332.00, pnl: -13.50, status: 'CLOSED', date: '2024-12-14 10:45', isDemo: true },
  { id: '4', symbol: 'AAPL', type: 'BUY', amount: 3000, entry: 189.50, exit: null, pnl: null, status: 'OPEN', date: '2024-12-14 09:00', isDemo: false },
  { id: '5', symbol: 'ETH/USD', type: 'BUY', amount: 800, entry: 3450, exit: 3510, pnl: +15.60, status: 'CLOSED', date: '2024-12-13 16:30', isDemo: false },
  { id: '6', symbol: 'USD/JPY', type: 'SELL', amount: 1500, entry: 154.750, exit: 155.200, pnl: -67.50, status: 'CLOSED', date: '2024-12-13 11:20', isDemo: true },
  { id: '7', symbol: 'SOL/USD', type: 'BUY', amount: 400, entry: 145.50, exit: 148.00, pnl: +6.85, status: 'CLOSED', date: '2024-12-12 15:00', isDemo: false },
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = trades.filter(t => {
    if (activeTab === 'open') return t.status === 'OPEN';
    if (activeTab === 'closed') return t.status === 'CLOSED';
    if (activeTab === 'demo') return t.isDemo;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Trade History</h1>

      <Tabs tabs={[{ id: 'all', label: 'All' }, { id: 'open', label: 'Open' }, { id: 'closed', label: 'Closed' }, { id: 'demo', label: 'Demo' }]} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      <Card variant="glass" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-3/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Asset</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Entry</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Exit</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">P&L</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((trade) => (
                <tr key={trade.id} className="table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{trade.symbol}</span>
                      {trade.isDemo && <Badge variant="amber" size="sm">Demo</Badge>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {trade.type === 'BUY' ? <ArrowUpRight className="w-4 h-4 text-brand-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                      <span className={trade.type === 'BUY' ? 'text-brand-400 text-sm' : 'text-red-400 text-sm'}>{trade.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-white">${trade.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-slate-300">{trade.entry}</td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-slate-300">{trade.exit || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    {trade.pnl !== null ? (
                      <span className={trade.pnl >= 0 ? 'text-brand-400 text-sm font-medium' : 'text-red-400 text-sm font-medium'}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={trade.status === 'OPEN' ? 'blue' : trade.status === 'CLOSED' ? 'green' : 'default'} size="sm">
                      {trade.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-400">{trade.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
