import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-container">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
