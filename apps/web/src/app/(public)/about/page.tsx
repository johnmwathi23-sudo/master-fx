'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Globe, Award, Target, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';

const values = [
  { icon: Shield, title: 'Security First', description: 'We protect our traders with bank-grade security and never compromise on data protection.' },
  { icon: Target, title: 'Innovation', description: 'We push the boundaries of what trading platforms can do, integrating AI and cutting-edge technology.' },
  { icon: Users, title: 'Community', description: 'We build for traders, listening to feedback and continuously improving the experience.' },
  { icon: Heart, title: 'Transparency', description: 'Clear pricing, honest risk disclosures, and no hidden fees. What you see is what you get.' },
];

const team = [
  { name: 'Alex Rivera', role: 'CEO & Co-Founder', bio: 'Former Goldman Sachs VP with 15 years in fintech and algorithmic trading.' },
  { name: 'Dr. Priya Sharma', role: 'CTO & Co-Founder', bio: 'PhD in Machine Learning from MIT. Built AI systems at Google DeepMind.' },
  { name: 'James Okafor', role: 'Head of Trading', bio: '20 years on Wall Street. Specializes in forex and derivatives markets.' },
  { name: 'Lisa Zhang', role: 'Head of Security', bio: 'Ex-NSA cybersecurity expert. Ensures our platform meets the highest security standards.' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-blue opacity-30" />
        <div className="section-container relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Building the Future of<br /><span className="gradient-text">Intelligent Trading</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Master FX was founded in 2024 with a simple mission: make professional-grade trading accessible to everyone through the power of artificial intelligence. We believe every trader deserves the tools and insights previously available only to Wall Street.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-surface-1/50">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                We are democratizing access to sophisticated trading tools. Our AI-powered platform combines real-time market analysis, intelligent risk management, and seamless execution to give every trader an edge.
              </p>
              <p className="text-slate-400 leading-relaxed">
                From beginners learning their first strategy to professionals managing multi-million dollar portfolios, Master FX scales to meet your needs. Our $10,000 demo accounts let you practice without risk, while our advanced tools handle the demands of high-frequency trading.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Founded', value: '2024' },
                { label: 'Team Size', value: '85+' },
                { label: 'Countries', value: '120+' },
                { label: 'Daily Trades', value: '50K+' },
              ].map((stat) => (
                <Card key={stat.label} variant="stat">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card variant="hover" padding="lg">
                  <div className="p-3 rounded-xl bg-accent-blue/10 w-fit mb-4">
                    <v.icon className="w-6 h-6 text-accent-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{v.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-1/50">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card variant="glass" padding="lg" className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-brand mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-base font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-brand-400 mb-3">{member.role}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
