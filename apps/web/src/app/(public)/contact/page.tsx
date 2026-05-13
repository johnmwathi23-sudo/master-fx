'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <section className="py-24">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Have questions? Our team is here to help. Reach out and we will get back to you within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-1 space-y-4">
              {[
                { icon: Mail, label: 'Email', value: 'support@nextrade.io', sub: 'We respond within 24h' },
                { icon: Phone, label: 'Phone', value: '+1 (888) 555-0123', sub: 'Mon-Fri 9AM-6PM EST' },
                { icon: MapPin, label: 'Office', value: 'Singapore', sub: '1 Raffles Place, #44-02' },
                { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7', sub: 'Pro & Enterprise users' },
              ].map((contact) => (
                <Card key={contact.label} variant="hover" padding="md">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-brand-500/10">
                      <contact.icon className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{contact.label}</p>
                      <p className="text-sm text-slate-300">{contact.value}</p>
                      <p className="text-xs text-slate-500">{contact.sub}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card variant="glass" padding="lg" className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <Input label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all resize-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />} className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
