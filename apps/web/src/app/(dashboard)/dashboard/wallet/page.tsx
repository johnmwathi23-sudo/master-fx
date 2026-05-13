'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Clock, CreditCard, Building2, Bitcoin } from 'lucide-react';
import { Card, StatCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toaster';

const transactions = [
  { id: '1', type: 'DEPOSIT', amount: 5000, status: 'COMPLETED', method: 'Credit Card', date: '2024-12-01', fee: 50 },
  { id: '2', type: 'DEPOSIT', amount: 3000, status: 'COMPLETED', method: 'Bank Transfer', date: '2024-12-05', fee: 30 },
  { id: '3', type: 'WITHDRAWAL', amount: 2000, status: 'COMPLETED', method: 'Bank Transfer', date: '2024-12-08', fee: 15 },
  { id: '4', type: 'TRADE_PROFIT', amount: 452.80, status: 'COMPLETED', method: 'EUR/USD Long', date: '2024-12-10', fee: 0 },
  { id: '5', type: 'WITHDRAWAL', amount: 1500, status: 'PENDING', method: 'Crypto Wallet', date: '2024-12-12', fee: 10 },
  { id: '6', type: 'REFERRAL_BONUS', amount: 25, status: 'COMPLETED', method: 'Referral', date: '2024-12-13', fee: 0 },
];

const paymentMethods = [
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard, fee: '1%' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2, fee: '0.5%' },
  { id: 'crypto', label: 'Crypto Wallet', icon: Bitcoin, fee: '0.1%' },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <div className="flex gap-3">
          <Button leftIcon={<ArrowDownCircle className="w-4 h-4" />} onClick={() => setShowDeposit(true)}>Deposit</Button>
          <Button variant="secondary" leftIcon={<ArrowUpCircle className="w-4 h-4" />} onClick={() => setShowWithdraw(true)}>Withdraw</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={50000} prefix="$" icon={<Wallet className="w-5 h-5" />} change={5.2} />
        <StatCard title="Available" value={45000} prefix="$" icon={<ArrowDownCircle className="w-5 h-5" />} />
        <StatCard title="Locked" value={5000} prefix="$" icon={<Clock className="w-5 h-5" />} />
        <StatCard title="Demo Balance" value={10000} prefix="$" icon={<Wallet className="w-5 h-5" />} />
      </div>

      <Card variant="glass" padding="none">
        <div className="p-4 flex items-center justify-between border-b border-surface-3/30">
          <Tabs tabs={[{ id: 'all', label: 'All' }, { id: 'deposit', label: 'Deposits' }, { id: 'withdrawal', label: 'Withdrawals' }]} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-3/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Fee</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Method</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter(t => activeTab === 'all' || t.type.toLowerCase() === activeTab.toUpperCase())
                .map((tx) => (
                  <tr key={tx.id} className="table-row">
                    <td className="px-6 py-4">
                      <Badge variant={tx.type.includes('PROFIT') || tx.type === 'DEPOSIT' || tx.type === 'REFERRAL_BONUS' ? 'green' : tx.type === 'WITHDRAWAL' ? 'amber' : 'default'} size="sm">
                        {tx.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm text-white">${tx.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-400">${tx.fee}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-300">{tx.method}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={tx.status === 'COMPLETED' ? 'green' : tx.status === 'PENDING' ? 'amber' : 'red'} size="sm">
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-slate-400">{tx.date}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showDeposit} onClose={() => setShowDeposit(false)} title="Deposit Funds" size="sm">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((m) => (
              <button key={m.id} onClick={() => setSelectedMethod(m.id)} className={`p-3 rounded-xl text-center transition-all ${selectedMethod === m.id ? 'bg-brand-500/15 border border-brand-500/30' : 'bg-surface-2 border border-transparent hover:border-surface-3'}`}>
                <m.icon className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                <p className="text-xs text-slate-300">{m.label}</p>
                <p className="text-xs text-slate-500">{m.fee} fee</p>
              </button>
            ))}
          </div>
          <Input label="Amount (USD)" type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Enter amount" min={10} />
          <Button className="w-full" onClick={() => { setShowDeposit(false); toast.success('Deposit initiated', `$${depositAmount || 0} via ${paymentMethods.find(m => m.id === selectedMethod)?.label}`); }}>
            Confirm Deposit
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} title="Withdraw Funds" size="sm">
        <div className="space-y-4">
          <Input label="Amount (USD)" type="number" placeholder="Min $10" />
          <Input label="Wallet Address" placeholder="Enter your wallet address" />
          <p className="text-xs text-slate-500">Processing time: 24-48 hours. Fee: 0.5% (min $5)</p>
          <Button className="w-full" onClick={() => { setShowWithdraw(false); toast.success('Withdrawal requested', 'Processing within 24-48 hours'); }}>
            Confirm Withdrawal
          </Button>
        </div>
      </Modal>
    </div>
  );
}
