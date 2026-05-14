'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

const mockPosts = [
  { id: '1', title: 'Getting Started with Master FX', status: 'Published', date: '2024-12-10' },
  { id: '2', title: 'Understanding Risk Management', status: 'Published', date: '2024-12-08' },
  { id: '3', title: 'AI Trading Strategies Guide', status: 'Draft', date: '2024-12-14' },
];

export default function AdminCmsPage() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>New Post</Button>
      </div>

      <Card variant="glass" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-3/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPosts.map((post) => (
                <tr key={post.id} className="table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /><span className="text-sm font-medium text-white">{post.title}</span></div>
                  </td>
                  <td className="px-6 py-4"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.status === 'Published' ? 'bg-brand-500/15 text-brand-400' : 'bg-surface-3 text-slate-400'}`}>{post.status}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-400">{post.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" leftIcon={<Edit className="w-4 h-4" />}>Edit</Button>
                      <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-4 h-4 text-red-400" />}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
