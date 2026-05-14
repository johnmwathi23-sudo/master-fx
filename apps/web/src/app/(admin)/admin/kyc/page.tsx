'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, FileText } from 'lucide-react';
import { PageLoader } from '@/components/ui/loading';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/toaster';

interface KycSubmission {
  id: string;
  userId: string;
  documentType: string;
  country: string;
  status: string;
  createdAt: string;
  user: { username: string; email: string };
}

export default function AdminKycPage() {
  const [submissions, setSubmissions] = useState<KycSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await api.get<KycSubmission[]>('/kyc/pending');
      setSubmissions(Array.isArray(data) ? data : []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.put(`/kyc/${id}/review`, { status: action === 'approve' ? 'APPROVED' : 'REJECTED' });
      setSubmissions(prev => prev.filter(s => s.id !== id));
      toast.success(`KYC ${action}d successfully`);
    } catch {
      toast.error(`Failed to ${action} KYC`);
    }
  };

  if (loading) return <PageLoader />;

  const pending = submissions.filter(s => s.status === 'SUBMITTED').length;
  const underReview = submissions.filter(s => s.status === 'UNDER_REVIEW').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">KYC Management</h1>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card variant="stat"><p className="text-sm text-slate-400">Pending Review</p><p className="text-2xl font-bold text-white">{pending}</p></Card>
        <Card variant="stat"><p className="text-sm text-slate-400">Under Review</p><p className="text-2xl font-bold text-brand-400">{underReview}</p></Card>
        <Card variant="stat"><p className="text-sm text-slate-400">Total Pending</p><p className="text-2xl font-bold text-amber-400">{submissions.length}</p></Card>
      </div>

      <Card variant="glass" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-3/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Document</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Country</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Submitted</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((kyc) => (
                <tr key={kyc.id} className="table-row">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{kyc.user?.username || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{kyc.user?.email || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{kyc.documentType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{kyc.country}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={kyc.status === 'SUBMITTED' ? 'amber' : kyc.status === 'UNDER_REVIEW' ? 'blue' : 'default'}
                      size="sm"
                    >
                      {kyc.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(kyc.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleAction(kyc.id, 'approve')} leftIcon={<Check className="w-4 h-4 text-brand-400" />}>
                        Approve
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAction(kyc.id, 'reject')} leftIcon={<X className="w-4 h-4 text-red-400" />}>
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">No pending KYC submissions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
