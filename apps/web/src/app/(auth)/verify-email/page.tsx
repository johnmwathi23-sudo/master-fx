'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="w-16 h-16 rounded-full bg-brand-500/15 flex items-center justify-center mx-auto mb-4">
        <MailCheck className="w-8 h-8 text-brand-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">
        {isVerified ? 'Email Verified!' : 'Verify Your Email'}
      </h1>
      <p className="text-sm text-slate-400 mb-6">
        {isVerified
          ? 'Your email has been verified successfully. You can now access all features.'
          : 'We have sent a verification link to your email. Please check your inbox and click the link.'}
      </p>
      {!isVerified ? (
        <div className="space-y-3">
          <Button onClick={() => setIsVerified(true)} className="w-full">Verify Email</Button>
          <Button variant="ghost" className="w-full">Resend Verification</Button>
        </div>
      ) : (
        <Link href="/dashboard">
          <Button className="w-full">Go to Dashboard</Button>
        </Link>
      )}
      <div className="mt-6">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    </motion.div>
  );
}
