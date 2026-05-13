'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, BarChart3, Activity, Clock, Bot, ArrowUpRight, ArrowDownRight, DollarSign, Percent, Target } from 'lucide-react';
import { StatCard, Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { api } from '@/lib/api-client';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [activeTrades, setActiveTrades] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/users/me/stats').catch(() => null),
      api.get('/trading/active').catch(() => []),
    ]).then(([s, t]) => {
      if (s) setStats(s);
      if (Array.isArray(t)) setActiveTrades(t);
    });
  }, []);

  const displayStats = stats || {
    totalBalance: 50000,
    totalProfit: 5200,
    totalLoss: 1800,
    winRate: 68.5,
    totalTrades: 142,
    activeTrades: 3,
    todayPnL: 342.50,
    portfolioChange: 3.4,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400">Welcome back. Here is your portfolio overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="green" dot>Markets Open</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={displayStats.totalBalance} prefix="$" icon={<Wallet className="w-5 h-5" />} change={displayStats.portfolioChange} />
        <StatCard title="Total Profit" value={displayStats.totalProfit} prefix="$" icon={<TrendingUp className="w-5 h-5" />} change={12.3} />
        <StatCard title="Win Rate" value={displayStats.winRate} suffix="%" icon={<Target className="w-5 h-5" />} change={2.1} />
        <StatCard title="Active Trades" value={displayStats.activeTrades} icon={<Activity className="w-5 h-5" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card variant="glass" padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Portfolio Performance</h2>
            <div className="flex items-center gap-2 text-sm">
              <button className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 font-medium">7D</button>
              <button className="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-300">30D</button>
              <button className="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-300">90D</button>
            </div>
          </div>
          <div className="h-64 flex items-end gap-1.5 pt-4">
            {[40, 55, 35, 60, 45, 70, 50, 65, 55, 75, 60, 80, 70, 85, 75, 90, 80, 95, 85, 92, 78, 88, 82, 90, 86, 94, 88, 92, 90, 95].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                className="flex-1 bg-gradient-to-t from-brand-500/60 to-brand-500/20 rounded-sm min-w-[4px]"
              />
            ))}
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s P&L</h2>
          <div className="text-center mb-6">
            <AnimatedCounter target={displayStats.todayPnL} prefix="$" decimals={2} className="text-4xl font-bold text-brand-400" />
            <p className="text-sm text-brand-400 mt-1">+{(displayStats.todayPnL / displayStats.totalBalance * 100).toFixed(2)}%</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Winning Trades', value: 8, pnl: '+$624.50', variant: 'green' as const },
              { label: 'Losing Trades', value: 3, pnl: '-$282.00', variant: 'red' as const },
              { label: 'Net P&L', value: 5, pnl: '+$342.50', variant: 'green' as const },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-surface-3/20 last:border-0">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className="text-sm font-medium text-white">{item.pnl}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Active Trades</h2>
            <a href="/dashboard/trade" className="text-sm text-brand-400 hover:text-brand-300">View all</a>
          </div>
          <div className="space-y-3">
            {[
              { symbol: 'EUR/USD', type: 'BUY', amount: 2500, pnl: +45.20, entry: 1.08500 },
              { symbol: 'BTC/USD', type: 'SELL', amount: 500, pnl: -28.50, entry: 67500 },
              { symbol: 'GOLD', type: 'BUY', amount: 1000, pnl: +127.80, entry: 2345.50 },
            ].map((trade) => (
              <div key={trade.symbol} className="flex items-center justify-between p-3 rounded-xl bg-surface-2/50 hover:bg-surface-2 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${trade.type === 'BUY' ? 'bg-brand-500/15' : 'bg-red-500/15'}`}>
                    {trade.type === 'BUY' ? <ArrowUpRight className="w-4 h-4 text-brand-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{trade.symbol}</p>
                    <p className="text-xs text-slate-500">{trade.type} &middot; ${trade.amount.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant={trade.pnl >= 0 ? 'green' : 'red'}>
                  {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">AI Insights</h2>
            <a href="/dashboard/ai-assistant" className="text-sm text-brand-400 hover:text-brand-300">Chat with AI</a>
          </div>
          <div className="space-y-3">
            {[
              { title: 'EUR/USD bullish momentum', description: 'RSI at 58, testing resistance at 1.08750', sentiment: 'bullish' },
              { title: 'BTC volatility alert', description: 'Approaching key $68,200 resistance zone', sentiment: 'neutral' },
              { title: 'GOLD safe-haven demand', description: 'Geopolitical tensions driving gold higher', sentiment: 'bullish' },
            ].map((insight) => (
              <div key={insight.title} className="p-3 rounded-xl bg-surface-2/50">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-accent-amber" />
                  <Badge variant={insight.sentiment === 'bullish' ? 'green' : insight.sentiment === 'bearish' ? 'red' : 'amber'} size="sm">
                    {insight.sentiment}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-white">{insight.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{insight.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
