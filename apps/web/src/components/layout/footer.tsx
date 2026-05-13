import Link from 'next/link';
import { TrendingUp, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Markets', href: '/markets' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Trading: [
    { label: 'Forex', href: '/markets?category=FOREX' },
    { label: 'Crypto', href: '/markets?category=CRYPTO' },
    { label: 'Commodities', href: '/markets?category=COMMODITIES' },
    { label: 'Stocks', href: '/markets?category=STOCKS' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Blog', href: '/about' },
    { label: 'Press', href: '/about' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Risk Disclosure', href: '#' },
    { label: 'Compliance', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface-1 border-t border-surface-3/30">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NexTrade</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              AI-enhanced trading platform with professional-grade tools and real-time market insights.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-surface-2 text-slate-400 hover:text-white hover:bg-surface-3 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-slate-200 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-surface-3/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} NexTrade. All rights reserved.
            </p>
            <p className="text-xs text-slate-600 max-w-xl text-center md:text-right">
              Risk Disclosure: Trading involves substantial risk of loss and is not suitable for all investors.
              Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
