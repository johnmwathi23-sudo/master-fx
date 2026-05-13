'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const mockAssets = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'FOREX', price: 1.08500, change: 0.14, high: 1.08750, low: 1.08200 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'FOREX', price: 1.26500, change: 0.16, high: 1.26700, low: 1.26100 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'FOREX', price: 154.750, change: 0.16, high: 155.000, low: 154.200 },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'FOREX', price: 0.65200, change: -0.23, high: 0.65500, low: 0.65100 },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'FOREX', price: 0.90500, change: 0.17, high: 0.90700, low: 0.90200 },
  { symbol: 'BTC/USD', name: 'Bitcoin', category: 'CRYPTO', price: 67500.00, change: 1.05, high: 68200.00, low: 66500.00 },
  { symbol: 'ETH/USD', name: 'Ethereum', category: 'CRYPTO', price: 3450.00, change: 0.88, high: 3500.00, low: 3380.00 },
  { symbol: 'SOL/USD', name: 'Solana', category: 'CRYPTO', price: 145.50, change: 2.25, high: 148.00, low: 141.00 },
  { symbol: 'XRP/USD', name: 'Ripple', category: 'CRYPTO', price: 0.5280, change: -0.56, high: 0.5350, low: 0.5250 },
  { symbol: 'GOLD', name: 'Gold', category: 'COMMODITIES', price: 2345.50, change: 0.32, high: 2350.00, low: 2332.00 },
  { symbol: 'SILVER', name: 'Silver', category: 'COMMODITIES', price: 27.85, change: 0.91, high: 28.10, low: 27.45 },
  { symbol: 'OIL', name: 'Crude Oil WTI', category: 'COMMODITIES', price: 78.40, change: 0.64, high: 79.20, low: 77.50 },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'STOCKS', price: 189.50, change: 0.69, high: 191.00, low: 187.50 },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'STOCKS', price: 245.30, change: -1.29, high: 250.00, low: 243.00 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'STOCKS', price: 875.60, change: 1.81, high: 880.00, low: 855.00 },
];

const categories = [
  { id: 'ALL', label: 'All Markets' },
  { id: 'FOREX', label: 'Forex' },
  { id: 'CRYPTO', label: 'Crypto' },
  { id: 'COMMODITIES', label: 'Commodities' },
  { id: 'STOCKS', label: 'Stocks' },
];

export default function MarketsPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = mockAssets.filter((a) => {
    const matchesCategory = activeCategory === 'ALL' || a.category === activeCategory;
    const matchesSearch = a.symbol.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <section className="py-24">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Live Markets</h1>
            <p className="text-lg text-slate-400">Access 100+ instruments across global markets with real-time pricing.</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Tabs tabs={categories} activeTab={activeCategory} onChange={setActiveCategory} variant="pills" />
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-3/30">
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Asset</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">24h Change</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">24h High</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">24h Low</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((asset) => (
                    <tr key={asset.symbol} className="table-row">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
                            {asset.change >= 0 ? <TrendingUp className="w-5 h-5 text-brand-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm">{asset.symbol}</p>
                            <p className="text-xs text-slate-500">{asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm text-white">
                        {asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.price < 1 ? 4 : 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant={asset.change >= 0 ? 'green' : 'red'}>
                          {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm text-slate-300">
                        {asset.high.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm text-slate-300">
                        {asset.low.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a href="/register" className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">
                          Trade
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
