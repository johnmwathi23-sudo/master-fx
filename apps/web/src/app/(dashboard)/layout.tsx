'use client';

import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { AIWidget } from '@/components/ai/ai-widget';
import { useAuthStore } from '@/store/auth-store';
import { useMarketSocket } from '@/hooks/use-market-socket';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageLoader } from '@/components/ui/loading';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useMarketSocket();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-surface-0">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-surface-1 border-b border-surface-3/30 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-slate-400">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-semibold text-white">NexTrade</span>
        <div className="w-9" />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`lg:block ${sidebarOpen ? 'block' : 'hidden'} lg:relative`}>
        <div className="lg:hidden fixed inset-y-0 left-0 z-50">
          <DashboardSidebar />
        </div>
      </div>

      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      <main className="lg:ml-64 min-h-screen p-4 lg:p-6 pt-18 lg:pt-6 transition-all duration-200">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <AIWidget />
    </div>
  );
}
