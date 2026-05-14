import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/lib/providers';
import { ToasterProvider } from '@/components/ui/toaster-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: 'Master FX - AI-Enhanced Trading Platform',
  description: 'Trade smarter with AI-powered insights, real-time market data, and professional-grade tools. Join thousands of traders on the most advanced trading platform.',
  keywords: ['trading', 'forex', 'crypto', 'stocks', 'AI trading', 'investment platform'],
  authors: [{ name: 'Master FX' }],
  openGraph: {
  title: 'Master FX - AI-Enhanced Trading Platform',
    description: 'Trade smarter with AI-powered insights and professional-grade tools.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <ToasterProvider />
        </Providers>
      </body>
    </html>
  );
}
