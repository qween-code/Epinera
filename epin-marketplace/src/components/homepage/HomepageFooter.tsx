'use client';

import Link from 'next/link';

export default function HomepageFooter() {
  const footerLinks = {
    marketplace: [
      { label: 'Games', href: '/products' },
      { label: 'Gift Cards', href: '/category/gift-cards' },
      { label: 'Deals', href: '/deals' },
      { label: 'Top-Ups', href: '/category/top-ups' },
    ],
    support: [
      { label: 'Help Center', href: '/support' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  };

  return (
    <footer className="bg-container-dark text-white/60">
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-12 px-10">
        <div>
          <h4 className="font-bold text-white mb-4">Marketplace</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.marketplace.map((link) => (
              <li key={link.label}>
                <Link className="hover:text-primary transition-colors" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.support.map((link) => (
              <li key={link.label}>
                <Link className="hover:text-primary transition-colors" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.company.map((link) => (
              <li key={link.label}>
                <Link className="hover:text-primary transition-colors" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.legal.map((link) => (
              <li key={link.label}>
                <Link className="hover:text-primary transition-colors" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 px-10">
        <p className="text-center text-sm text-white/40">© {new Date().getFullYear()} Epin Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
}

