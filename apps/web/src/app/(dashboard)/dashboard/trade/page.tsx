'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Play, X, Bot, Settings2, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { useTradeStore } from '@/store/trade-store';
import { useMarketStore } from '@/store/market-store';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/toaster';
import { cn } from '@nextrade/utils';

const assets = [
  { id: '1', symbol: 'EUR/USD', price: 1.08500, change: 0.14, category: 'FOREX' },
  { id: '2', symbol: 'GBP/USD', price: 1.26500, change: 0.16, category: 'FOREX' },
  { id: '3', symbol: 'USD/JPY', price: 154.750, change: 0.16, category: 'FOREX' },
  { id: '4', symbol: 'BTC/USD', price: 67500.00, change: 1.05, category: 'CRYPTO' },
  { id: '5', symbol: 'ETH/USD', price: 3450.00, change: 0.88, category: 'CRYPTO' },
  { id: '6', symbol: 'GOLD', price: 2345.50, change: 0.32, category: 'COMMODITIES' },
  { id: '7', symbol: 'AAPL', price: 189.50, change: 0.69, category: 'STOCKS' },
  { id: '8', symbol: 'NVDA', price: 875.60, change: 1.81, category: 'STOCKS' },
];

const timeframes = [
  { id: '1m', label: '1M' },
  { id: '5m', label: '5M' },
  { id: '15m', label: '15M' },
  { id: '1h', label: '1H' },
  { id: '4h', label: '4H' },
  { id: '1d', label: '1D' },
  { id: '1w', label: '1W' },
];

const indicatorTabs = [
  { id: 'rsi', label: 'RSI' },
  { id: 'macd', label: 'MACD' },
  { id: 'ema', label: 'EMA' },
  { id: 'bb', label: 'Bollinger' },
];

export default function TradePage() {
  const { selectedAsset, tradeType, amount, stopLoss, takeProfit, isDemo, setSelectedAsset, setTradeType, setAmount, setStopLoss, setTakeProfit, setIsDemo, reset } = useTradeStore();
  const [activeTimeframe, setActiveTimeframe] = useState('5m');
  const [activeIndicator, setActiveIndicator] = useState('rsi');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showTradeConfirm, setShowTradeConfirm] = useState(false);
  const [candleData, setCandleData] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  const currentAsset = assets.find(a => a.symbol === (selectedAsset || 'EUR/USD')) || assets[0];

  useEffect(() => {
    setSelectedAsset(currentAsset.symbol);
  }, []);

  useEffect(() => {
    const generateCandles = () => {
      const data = [];
      let base = currentAsset.price;
      for (let i = 60; i >= 0; i--) {
        const open = base + (Math.random() - 0.5) * base * 0.002;
        const close = open + (Math.random() - 0.5) * base * 0.003;
        const high = Math.max(open, close) + Math.random() * base * 0.001;
        const low = Math.min(open, close) - Math.random() * base * 0.001;
        base = close;
        data.push({ time: Date.now() - i * 60000, open, high, low, close, isGreen: close >= open });
      }
      return data;
    };
    setCandleData(generateCandles());
  }, [currentAsset.symbol]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCandleData(prev => {
        const updated = [...prev];
        const last = { ...updated[updated.length - 1] };
        const change = (Math.random() - 0.5) * currentAsset.price * 0.0005;
        last.close += change;
        last.high = Math.max(last.high, last.close);
        last.low = Math.min(last.low, last.close);
        last.isGreen = last.close >= last.open;
        updated[updated.length - 1] = last;
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [currentAsset.price]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candleData.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    const prices = candleData.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || 1;
    const padding = 20;
    const chartH = h - padding * 2;
    const candleW = (w - padding) / candleData.length;

    for (let i = 0; i < 5; i++) {
      const y = padding + (i / 4) * chartH;
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    candleData.forEach((candle, i) => {
      const x = padding + i * candleW + candleW / 2;
      const openY = padding + ((maxPrice - candle.open) / range) * chartH;
      const closeY = padding + ((maxPrice - candle.close) / range) * chartH;
      const highY = padding + ((maxPrice - candle.high) / range) * chartH;
      const lowY = padding + ((maxPrice - candle.low) / range) * chartH;

      ctx.strokeStyle = candle.isGreen ? '#22C55E' : '#EF4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      const bodyW = Math.max(candleW * 0.6, 2);
      ctx.fillStyle = candle.isGreen ? '#22C55E' : '#EF4444';
      if (Math.abs(closeY - openY) < 1) {
        ctx.fillRect(x - bodyW / 2, openY, bodyW, 1);
      } else {
        ctx.fillRect(x - bodyW / 2, Math.min(openY, closeY), bodyW, Math.abs(closeY - openY));
      }
    });

    const lastCandle = candleData[candleData.length - 1];
    if (lastCandle) {
      const lastY = padding + ((maxPrice - lastCandle.close) / range) * chartH;
      ctx.strokeStyle = lastCandle.isGreen ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, lastY);
      ctx.lineTo(w, lastY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = lastCandle.isGreen ? '#22C55E' : '#EF4444';
      ctx.font = '11px Inter';
      ctx.fillText(lastCandle.close.toFixed(currentAsset.price < 1 ? 4 : 2), 5, lastY - 5);
    }
  }, [candleData, currentAsset.price]);

  const executeTrade = async () => {
    setIsExecuting(true);
    try {
      await api.post('/trading/execute', {
        assetId: currentAsset.id,
        type: tradeType,
        amount,
        stopLoss,
        takeProfit,
        isDemo,
      });
      toast.success('Trade executed!', `${tradeType} ${currentAsset.symbol} for $${amount}`);
      setShowTradeConfirm(false);
    } catch (err: any) {
      toast.error('Trade failed', err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Trade</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDemo(!isDemo)}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all', isDemo ? 'bg-accent-amber/15 text-accent-amber' : 'bg-surface-2 text-slate-400')}
          >
            {isDemo ? 'Demo' : 'Live'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          {/* Asset Selector & Timeframe */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{currentAsset.symbol}</span>
                <Badge variant={currentAsset.change >= 0 ? 'green' : 'red'}>
                  {currentAsset.change >= 0 ? '+' : ''}{currentAsset.change}%
                </Badge>
              </div>
              <span className="font-mono text-2xl font-bold text-white">
                {currentAsset.price.toLocaleString(undefined, { minimumFractionDigits: currentAsset.price < 1 ? 4 : 2 })}
              </span>
            </div>
            <Tabs tabs={timeframes} activeTab={activeTimeframe} onChange={setActiveTimeframe} variant="pills" />
          </div>

          {/* Chart */}
          <Card variant="glass" padding="none" className="overflow-hidden">
            <canvas ref={canvasRef} className="w-full" style={{ height: '400px' }} />
          </Card>

          {/* Indicators */}
          <Card variant="glass" padding="md">
            <div className="flex items-center justify-between mb-3">
              <Tabs tabs={indicatorTabs} activeTab={activeIndicator} onChange={setActiveIndicator} variant="underline" />
            </div>
            <div className="h-24 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  {activeIndicator === 'rsi' && 'RSI(14): 58.3 — Neutral zone, slight bullish bias'}
                  {activeIndicator === 'macd' && 'MACD: Bullish crossover detected on 4H timeframe'}
                  {activeIndicator === 'ema' && 'EMA 20/50: Price above both, uptrend confirmed'}
                  {activeIndicator === 'bb' && 'Bollinger: Price near upper band, potential pullback'}
                </p>
              </div>
            </div>
          </Card>

          {/* Asset list */}
          <Card variant="glass" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-3/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Asset</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Price</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr
                      key={asset.symbol}
                      onClick={() => setSelectedAsset(asset.symbol)}
                      className={cn('table-row cursor-pointer', asset.symbol === selectedAsset && 'bg-surface-2/30')}
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-white">{asset.symbol}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-white">
                        {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant={asset.change >= 0 ? 'green' : 'red'} size="sm">
                          {asset.change >= 0 ? '+' : ''}{asset.change}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Trade Panel */}
        <div className="space-y-4">
          <Card variant="glass" padding="lg">
            <h3 className="text-base font-semibold text-white mb-4">Place Trade</h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setTradeType('BUY')}
                className={cn(
                  'py-3 rounded-xl font-semibold text-sm transition-all',
                  tradeType === 'BUY' ? 'bg-brand-500 text-white shadow-glow-green/30' : 'bg-surface-2 text-slate-400 hover:text-slate-200',
                )}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" /> Buy
              </button>
              <button
                onClick={() => setTradeType('SELL')}
                className={cn(
                  'py-3 rounded-xl font-semibold text-sm transition-all',
                  tradeType === 'SELL' ? 'bg-red-500 text-white shadow-glow-red/30' : 'bg-surface-2 text-slate-400 hover:text-slate-200',
                )}
              >
                <TrendingDown className="w-4 h-4 inline mr-1" /> Sell
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Amount (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="input-field"
                  min={1}
                />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[50, 100, 250, 500, 1000, 5000].map((val) => (
                  <button key={val} onClick={() => setAmount(val)} className={cn('py-2 rounded-lg text-xs font-medium transition-all', amount === val ? 'bg-brand-500/15 text-brand-400' : 'bg-surface-2 text-slate-400 hover:text-slate-200')}>
                    ${val}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Stop Loss</label>
                <input
                  type="number"
                  value={stopLoss || ''}
                  onChange={(e) => setStopLoss(e.target.value ? Number(e.target.value) : null)}
                  className="input-field"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Take Profit</label>
                <input
                  type="number"
                  value={takeProfit || ''}
                  onChange={(e) => setTakeProfit(e.target.value ? Number(e.target.value) : null)}
                  className="input-field"
                  placeholder="Optional"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowTradeConfirm(true)}
              variant={tradeType === 'BUY' ? 'primary' : 'danger'}
              className="w-full mt-4"
              size="lg"
            >
              {tradeType === 'BUY' ? 'Buy' : 'Sell'} {currentAsset.symbol}
            </Button>
          </Card>

          <Card variant="glass" padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-accent-amber" />
              <span className="text-sm font-medium text-white">AI Suggestion</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {tradeType === 'BUY'
                ? `Consider setting stop loss at ${(currentAsset.price * 0.98).toFixed(currentAsset.price < 1 ? 4 : 2)} and take profit at ${(currentAsset.price * 1.03).toFixed(currentAsset.price < 1 ? 4 : 2)} for a 1:1.5 risk-reward ratio.`
                : `Current trend shows bearish divergence. Consider a tight stop above ${(currentAsset.price * 1.02).toFixed(currentAsset.price < 1 ? 4 : 2)}.`}
            </p>
          </Card>
        </div>
      </div>

      {/* Trade Confirmation Modal */}
      <AnimatePresence>
        {showTradeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTradeConfirm(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative glass-card p-6 w-full max-w-sm z-10">
              <h2 className="text-lg font-semibold text-white mb-4">Confirm Trade</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span className="text-sm text-slate-400">Type</span><Badge variant={tradeType === 'BUY' ? 'green' : 'red'}>{tradeType}</Badge></div>
                <div className="flex justify-between"><span className="text-sm text-slate-400">Asset</span><span className="text-sm text-white font-medium">{currentAsset.symbol}</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-400">Amount</span><span className="text-sm text-white font-medium">${amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-400">Entry Price</span><span className="text-sm text-white font-mono">{currentAsset.price.toFixed(currentAsset.price < 1 ? 4 : 2)}</span></div>
                {stopLoss && <div className="flex justify-between"><span className="text-sm text-slate-400">Stop Loss</span><span className="text-sm text-red-400 font-mono">{stopLoss}</span></div>}
                {takeProfit && <div className="flex justify-between"><span className="text-sm text-slate-400">Take Profit</span><span className="text-sm text-brand-400 font-mono">{takeProfit}</span></div>}
                <div className="flex justify-between"><span className="text-sm text-slate-400">Mode</span><Badge variant={isDemo ? 'amber' : 'blue'}>{isDemo ? 'Demo' : 'Live'}</Badge></div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowTradeConfirm(false)} className="flex-1">Cancel</Button>
                <Button variant={tradeType === 'BUY' ? 'primary' : 'danger'} onClick={executeTrade} isLoading={isExecuting} className="flex-1">
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
