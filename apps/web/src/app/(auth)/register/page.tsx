'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/components/ui/toaster';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', referralCode: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.post<{ accessToken: string; refreshToken: string; user: any }>('/auth/register', {
        email: form.email,
        username: form.username,
        password: form.password,
        referralCode: form.referralCode || undefined,
      });
      api.setAuth(data.accessToken, data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Account created!', 'Welcome to NexTrade. Your demo account has $10,000 ready.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error('Registration failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="mt-2 text-sm text-slate-400">Start trading with a free $10,000 demo account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Username" placeholder="Choose a username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} leftIcon={<User className="w-4 h-4" />} required />
        <Input label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} leftIcon={<Mail className="w-4 h-4" />} required />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min 8 chars, uppercase, lowercase, number"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-slate-300">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
          required
        />
        <Input label="Confirm Password" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} leftIcon={<Lock className="w-4 h-4" />} required />
        <Input label="Referral Code (Optional)" placeholder="Enter referral code" value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value })} leftIcon={<Link2 className="w-4 h-4" />} />
        <label className="flex items-start gap-2 text-xs text-slate-400">
          <input type="checkbox" className="rounded bg-surface-2 border-surface-3 text-brand-500 focus:ring-brand-500 mt-0.5" required />
          I agree to the Terms of Service and Privacy Policy
        </label>
        <Button type="submit" isLoading={isLoading} className="w-full" leftIcon={<UserPlus className="w-4 h-4" />}>
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}
