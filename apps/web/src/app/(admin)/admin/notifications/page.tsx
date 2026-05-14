'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Send, Users } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';
import { api } from '@/lib/api-client';

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recent, setRecent] = useState<Notification[]>([]);
  const [sending, setSending] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchRecent();
  }, []);

  const fetchRecent = async () => {
    try {
      const data = await api.get<Notification[]>('/notifications?limit=10');
      setRecent(Array.isArray(data) ? data : []);
    } catch {
      setRecent([]);
    }
  };

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    try {
      await api.post('/notifications/send', { title, message });
      toast.success('Notification sent to all users');
      setTitle('');
      setMessage('');
      fetchRecent();
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Notifications</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-4">Send Notification</h2>
          <div className="space-y-4">
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all resize-none"
                placeholder="Notification message..."
              />
            </div>
            <div className="flex gap-3">
              <Button leftIcon={<Send className="w-4 h-4" />} onClick={sendNotification} disabled={sending || !title.trim() || !message.trim()}>
                Send to All
              </Button>
              <Button variant="secondary" leftIcon={<Users className="w-4 h-4" />}>Send to Selected</Button>
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            {recent.length > 0 ? recent.map((notif) => (
              <div key={notif.id} className="p-3 rounded-xl bg-surface-2/50">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-sm font-medium text-white">{notif.title}</span>
                  <span className="text-xs text-slate-500 ml-auto">{new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-400">{notif.message}</p>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No notifications yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
