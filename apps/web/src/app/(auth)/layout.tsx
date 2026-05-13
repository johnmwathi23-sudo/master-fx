import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-container">
      <Navbar />
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
