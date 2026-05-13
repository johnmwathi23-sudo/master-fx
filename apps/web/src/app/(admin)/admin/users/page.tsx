'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ToggleLeft, ToggleRight, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/ui/loading';
import { api } from '@/lib/api-client';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  wallet?: { balance: number; totalProfit: number; totalLoss: number };
  kycSubmission?: { status: string };
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.get<{ data: User[]; meta: any }>(`/admin/users?limit=50${search ? `&search=${search}` : ''}`);
      setUsers(data.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const toggleStatus = async (id: string) => {
    setTogglingId(id);
    try {
      await api.put(`/admin/users/${id}/toggle-status`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} className="w-64" />
      </div>

      <Card variant="glass" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-3/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">KYC</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Balance</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'SUPER_ADMIN' ? 'purple' : user.role === 'ADMIN' ? 'blue' : 'default'} size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={user.kycSubmission?.status === 'APPROVED' ? 'green' : user.kycSubmission?.status === 'REJECTED' ? 'red' : 'amber'}
                      size="sm"
                    >
                      {user.kycSubmission?.status || 'PENDING'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-white">
                    ${Number(user.wallet?.balance ?? 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={user.isActive ? 'green' : 'red'} size="sm" dot>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(user.id)}
                      disabled={togglingId === user.id}
                      leftIcon={user.isActive ? <ToggleRight className="w-4 h-4 text-brand-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
