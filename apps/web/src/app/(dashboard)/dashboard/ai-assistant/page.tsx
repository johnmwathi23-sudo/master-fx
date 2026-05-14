'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Lightbulb, TrendingUp, Shield, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  { icon: TrendingUp, label: 'Market analysis', question: 'Give me a market overview for today' },
  { icon: Shield, label: 'Risk management', question: 'How should I manage risk on my current positions?' },
  { icon: Lightbulb, label: 'Trading tips', question: 'What are some beginner trading strategies?' },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am Master FX AI, your personal trading assistant. I can help you analyze markets, understand trading concepts, manage risk, and navigate the platform. What would you like to know?', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await api.post<{ message: string }>('/ai/chat', { message });
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const fallbackResponses: Record<string, string> = {
        market: 'Markets are showing mixed signals today. EUR/USD is consolidating near 1.08500 with mild bullish bias. Crypto markets are in a relief rally, with BTC testing $68,000 resistance. Gold continues its safe-haven demand above $2,340.',
        risk: 'Key risk management principles: 1) Never risk more than 1-2% per trade. 2) Always use stop-losses. 3) Maintain 1:2+ risk-reward ratio. 4) Diversify across asset classes. 5) Avoid overleveraging. 6) Keep a trading journal.',
        tips: 'For beginners: 1) Start with a demo account. 2) Focus on one or two pairs. 3) Learn price action and support/resistance. 4) Follow the trend. 5) Keep emotions in check. 6) Use proper position sizing. 7) Be patient — quality over quantity.',
      };

      const lowerMsg = message.toLowerCase();
      let response = 'I am here to help with market analysis, trading strategies, risk management, and platform features. What specific topic would you like to explore?';
      if (lowerMsg.includes('market') || lowerMsg.includes('analysis') || lowerMsg.includes('trend')) response = fallbackResponses.market;
      else if (lowerMsg.includes('risk') || lowerMsg.includes('manage') || lowerMsg.includes('stop')) response = fallbackResponses.risk;
      else if (lowerMsg.includes('tip') || lowerMsg.includes('strateg') || lowerMsg.includes('beginner')) response = fallbackResponses.tips;

      await new Promise(r => setTimeout(r, 1000));
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-amber/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
            <p className="text-sm text-slate-400">Powered by GPT-4o</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-4 h-4" />} onClick={() => setMessages([messages[0]])}>
          Clear Chat
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card variant="glass" padding="none" className="flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div className={cn('max-w-[80%] rounded-2xl p-4', msg.role === 'user' ? 'bg-surface-2 rounded-tr-sm' : 'bg-brand-500/10 border border-brand-500/20 rounded-tl-sm')}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-4 h-4 text-accent-amber" />
                          <span className="text-xs font-medium text-accent-amber">Master FX AI</span>
                        </div>
                      )}
                      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl rounded-tl-sm p-4">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-accent-amber" />
                      <span className="text-xs text-slate-400">Analyzing...</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-surface-3/30 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask about markets, trading strategies, risk management..."
                  className="input-field flex-1"
                />
                <Button onClick={() => sendMessage()} disabled={!input.trim() || isTyping} leftIcon={<Send className="w-4 h-4" />}>
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card variant="glass" padding="md">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Questions</h3>
            <div className="space-y-2">
              {quickQuestions.map((q) => (
                <button key={q.label} onClick={() => sendMessage(q.question)} className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-surface-2/50 hover:bg-surface-2 transition-colors text-left">
                  <q.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{q.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card variant="glass" padding="md">
            <h3 className="text-sm font-semibold text-white mb-3">AI Capabilities</h3>
            <div className="space-y-2">
              {['Market analysis', 'Risk assessment', 'Strategy suggestions', 'Platform guidance', 'Trading education', 'Portfolio review'].map((cap) => (
                <div key={cap} className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  {cap}
                </div>
              ))}
            </div>
          </Card>

          <Card variant="glass" padding="md" className="border-amber-500/20">
            <p className="text-xs text-slate-500 leading-relaxed">
              AI responses are for informational purposes only and do not constitute financial advice. Always do your own research before making trading decisions.
            </p>
          </Card>
        </div>
      </div>
    </div>
);
}
