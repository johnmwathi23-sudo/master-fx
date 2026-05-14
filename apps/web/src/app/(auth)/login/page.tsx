'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/components/ui/toaster';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await api.post<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', { email, password });
      api.setAuth(data.accessToken, data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Welcome back!', 'You have been logged in successfully.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error('Login failed', err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to your Master FX account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4" />} required />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-slate-300">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
          required
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" className="rounded bg-surface-2 border-surface-3 text-brand-500 focus:ring-brand-500" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</Link>
        </div>
        <Button type="submit" isLoading={isLoading} className="w-full" leftIcon={<LogIn className="w-4 h-4" />}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          Do not have an account?{' '}
          <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign up free</Link>
        </p>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-3/50" /></div>
          <div className="relative flex justify-center text-xs"><span className="px-2 bg-surface-1 text-slate-500">or continue with</span></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="secondary" type="button" className="w-full text-sm">Google</Button>
          <Button variant="secondary" type="button" className="w-full text-sm">Apple</Button>
        </div>
      </div>
    </motion.div>
  );
}
