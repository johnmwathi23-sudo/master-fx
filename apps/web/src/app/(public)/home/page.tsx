'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Bot, Zap, Globe, BarChart3, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const features = [
  { icon: Bot, title: 'AI-Powered Insights', description: 'Advanced AI analyzes market patterns, identifies opportunities, and provides personalized trading recommendations.' },
  { icon: TrendingUp, title: 'Real-Time Trading', description: 'Execute trades instantly with live market data, advanced charting tools, and multiple order types.' },
  { icon: Shield, title: 'Bank-Grade Security', description: 'Your funds and data are protected with military-grade encryption, 2FA, and rigorous security protocols.' },
  { icon: Zap, title: 'Lightning Fast', description: 'Sub-millisecond execution with our optimized trading engine and global server infrastructure.' },
  { icon: Globe, title: 'Global Markets', description: 'Access 100+ instruments across forex, crypto, commodities, and stocks from a single platform.' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Professional-grade charts with RSI, MACD, EMA, and Bollinger Bands indicators built in.' },
];

const stats = [
  { label: 'Active Traders', value: 25000, suffix: '+' },
  { label: 'Daily Volume', value: 2.4, prefix: '$', suffix: 'B' },
  { label: 'Countries', value: 120, suffix: '+' },
  { label: 'Uptime', value: 99.9, suffix: '%' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Forex Trader', quote: 'The AI assistant completely transformed my trading strategy. I went from losing to consistently profitable in 3 months.', rating: 5 },
  { name: 'Marcus Rodriguez', role: 'Crypto Investor', quote: 'Real-time execution is unmatched. The platform handles volatility like no other exchange I have used.', rating: 5 },
  { name: 'Emily Watson', role: 'Portfolio Manager', quote: 'The analytics tools rival platforms costing 10x more. The risk management features give me confidence.', rating: 5 },
];

const faqs = [
  { q: 'How does the AI trading assistant work?', a: 'Our AI analyzes thousands of market signals in real-time using advanced language models. It identifies patterns, assesses risk, and provides actionable insights — but always reminds you that these are suggestions, not financial advice.' },
  { q: 'Is my money safe on Master FX?', a: 'We employ bank-grade security including 256-bit encryption, two-factor authentication, cold storage for digital assets, and regular security audits. Your funds are held in segregated accounts.' },
  { q: 'What markets can I trade?', a: 'Master FX offers access to 100+ instruments including major and minor forex pairs, popular cryptocurrencies, commodities like gold and oil, and major stock CFDs.' },
  { q: 'How do deposits and withdrawals work?', a: 'We support multiple payment methods including bank transfers, credit/debit cards, and crypto wallets. Deposits are typically instant, and withdrawals process within 24-48 hours.' },
  { q: 'Can I practice before trading with real money?', a: 'Every account includes a $10,000 demo account with live market data. Practice your strategies risk-free before committing real capital.' },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute inset-0 bg-glow-green opacity-50" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />

        <div className="section-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
                <Zap className="w-4 h-4" /> AI-Powered Trading Platform
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Trade Smarter<br />
              <span className="gradient-text">with AI</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence to analyze markets, manage risk, and execute trades with confidence. Join 25,000+ traders worldwide.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Trading Free
                </Button>
              </Link>
              <Link href="/markets">
                <Button variant="secondary" size="lg">
                  Explore Markets
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-brand-400" /> Secure & Regulated</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-accent-blue" /> Instant Execution</span>
              <span className="flex items-center gap-1.5"><Bot className="w-4 h-4 text-accent-amber" /> AI Assistance</span>
            </motion.div>
          </div>
        </div>

        {/* Animated chart lines at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,80 Q150,20 300,50 T600,30 T900,60 T1200,40" fill="none" stroke="#22C55E" strokeWidth="2" />
            <path d="M0,60 Q200,80 400,40 T800,70 T1200,50" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-surface-3/30 bg-surface-1/50">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  <AnimatedCounter target={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} prefix={stat.prefix || ''} suffix={stat.suffix || ''} />
                </div>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Choose Master FX?</h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">Everything you need to trade professionally, powered by cutting-edge AI technology.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card variant="hover" padding="lg">
                  <div className="p-3 rounded-xl bg-brand-500/10 w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-brand-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Preview Section */}
      <section className="py-24 bg-surface-1/50">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-amber/10 text-accent-amber text-sm font-medium mb-6">
                <Bot className="w-4 h-4" /> AI Assistant
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Your Personal<br /><span className="gradient-text">AI Trading Coach</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Ask questions, get market analysis, learn strategies, and receive risk management advice — all from your AI assistant available 24/7.
              </p>
              <ul className="space-y-3">
                {['Explain trades and market movements', 'Analyze trends with technical indicators', 'Suggest risk management strategies', 'Answer platform and trading questions'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-amber/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-accent-amber" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Master FX AI</p>
                    <p className="text-xs text-slate-500">Always learning, always helping</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-surface-2 rounded-2xl rounded-tl-sm p-4 max-w-[80%]">
                    <p className="text-sm text-slate-300">What is the current trend for EUR/USD?</p>
                  </div>
                  <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl rounded-tr-sm p-4 max-w-[85%] ml-auto">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      EUR/USD is showing a modest bullish trend at 1.08500 (+0.14%). The pair found support at 1.08200 and is testing resistance at 1.08750. RSI at 58 suggests room for further upside. Consider watching the 1.08750 breakout for long positions.
                    </p>
                  </div>
                  <div className="bg-surface-2 rounded-2xl rounded-tl-sm p-4 max-w-[80%]">
                    <p className="text-sm text-slate-300">How should I set my stop loss?</p>
                  </div>
                  <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl rounded-tr-sm p-4 max-w-[85%] ml-auto">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      For EUR/USD longs, place your stop below 1.08200 support. Risk no more than 1-2% of your capital per trade. With a 1:2 risk-reward ratio, a 30-pip stop would target 60 pips profit.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Trusted by Thousands</h2>
            <p className="mt-4 text-slate-400">See what our traders have to say about their experience.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card variant="glass" padding="lg">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="text-accent-amber">&#9733;</span>
                    ))}
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-surface-1/50">
        <div className="section-container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card variant="glass" padding="md">
                  <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl bg-gradient-brand p-12 text-center">
            <div className="absolute inset-0 bg-glow-green opacity-30" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Trading?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join 25,000+ traders and start with a free $10,000 demo account. No credit card required.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-brand-600 hover:bg-slate-100 hover:shadow-none" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Create Free Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
