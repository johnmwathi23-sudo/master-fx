'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m NexTrade AI. Ask me anything about markets, trading, or risk management.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await api.post<{ message: string }>('/ai/chat', { message });
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const fallbacks: Record<string, string> = {
        market: 'Markets are showing mixed signals. EUR/USD consolidating near 1.08500. BTC testing $68K resistance.',
        risk: 'Never risk more than 1-2% per trade. Always use stop-losses. Maintain 1:2+ risk-reward ratio.',
        tips: 'Start with demo. Focus on 1-2 pairs. Learn price action. Follow the trend. Keep emotions in check.',
      };

      const lower = message.toLowerCase();
      let response = 'I can help with market analysis, trading strategies, and risk management. What would you like to know?';
      if (lower.includes('market') || lower.includes('analysis')) response = fallbacks.market;
      else if (lower.includes('risk') || lower.includes('stop')) response = fallbacks.risk;
      else if (lower.includes('tip') || lower.includes('strateg')) response = fallbacks.tips;

      await new Promise(r => setTimeout(r, 800));
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-surface-1 border border-surface-3/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-3/30 bg-surface-2/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-amber/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">NexTrade AI</h3>
                  <p className="text-xs text-slate-500">GPT-4o powered</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-brand-500/20 text-slate-200 rounded-tr-sm'
                        : 'bg-surface-2/80 text-slate-300 rounded-tl-sm border border-surface-3/20',
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-2/80 rounded-xl rounded-tl-sm px-3 py-2 border border-surface-3/20">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-surface-3/30 p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask about markets..."
                  className="input-field flex-1 text-sm py-2"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-colors',
          isOpen
            ? 'bg-surface-2 border border-surface-3/30 text-slate-400 hover:text-white'
            : 'bg-gradient-brand text-white',
        )}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </motion.button>
    </>
  );
}
