'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, TrendingUp, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/markets', label: 'Markets' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { mode, toggleTheme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-surface-3/30">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">NexTrade</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-2',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-surface-2 text-slate-400 transition-colors">
              {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-surface-2 text-slate-400">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-3/30 bg-surface-0/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                    pathname === link.href ? 'text-brand-400 bg-brand-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-surface-2',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-surface-3/30 flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button size="sm" className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
