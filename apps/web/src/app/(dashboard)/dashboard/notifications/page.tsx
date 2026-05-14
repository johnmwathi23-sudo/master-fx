'use client';

import { useState } from 'react';
import { Bell, CheckCheck, TrendingUp, DollarSign, Shield, Bot, AlertTriangle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const notifications = [
  { id: '1', type: 'TRADE_CLOSED', title: 'Trade Closed', message: 'Your BUY trade on EUR/USD closed with +$62.50 profit', isRead: false, time: '5m ago' },
  { id: '2', type: 'AI_INSIGHT', title: 'AI Market Insight', message: 'BTC/USD showing strong bullish momentum above $67,000', isRead: false, time: '15m ago' },
  { id: '3', type: 'DEPOSIT_CONFIRMED', title: 'Deposit Confirmed', message: 'Your deposit of $5,000 has been credited', isRead: false, time: '1h ago' },
  { id: '4', type: 'SECURITY_ALERT', title: 'Security Alert', message: 'New login detected from Chrome on Windows', isRead: true, time: '2h ago' },
  { id: '5', type: 'TRADE_EXECUTED', title: 'Trade Executed', message: 'Your SELL trade on GOLD has been executed at $2,345.50', isRead: true, time: '3h ago' },
  { id: '6', type: 'REFERRAL_BONUS', title: 'Referral Bonus', message: 'You earned $25 from trader_4 signup bonus', isRead: true, time: '1d ago' },
  { id: '7', type: 'SYSTEM', title: 'Platform Update', message: 'New AI features have been added. Check the AI assistant!', isRead: true, time: '2d ago' },
];

const iconMap: Record<string, any> = {
  TRADE_CLOSED: TrendingUp,
  TRADE_EXECUTED: TrendingUp,
  DEPOSIT_CONFIRMED: DollarSign,
  AI_INSIGHT: Bot,
  SECURITY_ALERT: AlertTriangle,
  REFERRAL_BONUS: DollarSign,
  SYSTEM: Info,
  KYC_APPROVED: Shield,
};

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, isRead: true })));
  const markRead = (id: string) => setItems(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const unreadCount = items.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && <Badge variant="blue">{unreadCount} new</Badge>}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" leftIcon={<CheckCheck className="w-4 h-4" />} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((notif) => {
          const Icon = iconMap[notif.type] || Bell;
          return (
            <Card
              key={notif.id}
              variant="glass"
              padding="md"
              className={cn('cursor-pointer transition-all', !notif.isRead && 'border-l-2 border-l-brand-500 bg-brand-500/5')}
              onClick={() => markRead(notif.id)}
            >
              <div className="flex items-start gap-4">
                <div className={cn('p-2.5 rounded-xl', !notif.isRead ? 'bg-brand-500/10' : 'bg-surface-2')}>
                  <Icon className={cn('w-5 h-5', !notif.isRead ? 'text-brand-400' : 'text-slate-400')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-sm font-semibold', !notif.isRead ? 'text-white' : 'text-slate-300')}>{notif.title}</p>
                    {!notif.isRead && <div className="w-2 h-2 rounded-full bg-brand-400" />}
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
