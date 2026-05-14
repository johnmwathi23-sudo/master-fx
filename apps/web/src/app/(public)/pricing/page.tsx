'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: 0,
    period: 'Free forever',
    description: 'Perfect for beginners learning to trade',
    features: [
      '$10,000 demo account',
      'Basic market data',
      '5 open trades maximum',
      'AI assistant (10 queries/day)',
      'Email support',
      'Basic charts',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 49,
    period: '/month',
    description: 'For serious traders who want an edge',
    features: [
      'Unlimited demo & live trading',
      'Real-time market data',
      'Unlimited open trades',
      'Unlimited AI assistant',
      'Priority support (24/7)',
      'Advanced charts & indicators',
      'Trading signals',
      'Risk management tools',
      'Referral program (2x bonus)',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    period: '/month',
    description: 'For institutions and professional traders',
    features: [
      'Everything in Pro',
      'API access',
      'Custom indicators',
      'Dedicated account manager',
      'White-label options',
      'Advanced analytics',
      'Multi-user accounts',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div>
      <section className="py-24">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Start free and upgrade as you grow. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card variant={plan.popular ? 'glass' : 'default'} padding="none" className={cn('relative overflow-hidden', plan.popular && 'border-brand-500/30 ring-1 ring-brand-500/20')}>
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-brand text-center py-1.5 text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}
                  <div className={cn('p-8', plan.popular && 'pt-12')}>
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400 text-sm">{plan.period}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{plan.description}</p>

                    <ul className="mt-8 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                          <Check className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <Link href="/register">
                        <Button
                          variant={plan.popular ? 'primary' : 'secondary'}
                          className="w-full"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-1/50">
        <div className="section-container max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4 text-left">
            {[
              { q: 'Can I switch plans at any time?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.' },
              { q: 'Is there a free trial for Pro?', a: 'Yes! Pro includes a 14-day free trial. Cancel anytime during the trial and you will not be charged.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, bank transfers, and cryptocurrency payments.' },
              { q: 'Are there any trading commissions?', a: 'We charge a minimal 0.1% commission per trade. Pro and Enterprise users get reduced rates.' },
            ].map((faq, i) => (
              <Card key={i} variant="glass" padding="md">
                <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
