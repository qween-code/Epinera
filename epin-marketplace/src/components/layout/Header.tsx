'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import CartButton from '@/components/cart/CartButton';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      {/* Top neon accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-40" />

      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg neo-sm flex items-center justify-center border border-[rgba(0,240,255,0.2)] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[var(--neon-cyan)]" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-neon-cyan">EPI</span>
              <span className="text-[var(--text-primary)]">NERA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/search">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Ara
            </NavLink>
            <NavLink href="/categories">Kategoriler</NavLink>
            {user && (
              <>
                <NavLink href="/seller/dashboard">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Satici
                </NavLink>
                <NavLink href="/orders">Siparislerim</NavLink>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <CartButton />
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-xs font-mono-accent text-[var(--text-tertiary)] max-w-[120px] truncate">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-danger"
                  >
                    Cikis
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className="btn btn-sm btn-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
                Giris Yap
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden btn btn-ghost btn-icon"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden mt-4 pb-2 border-t border-[var(--border-dim)] pt-4 animate-slide-down space-y-1">
            <MobileNavLink href="/search" onClick={() => setMobileOpen(false)}>Ara</MobileNavLink>
            <MobileNavLink href="/categories" onClick={() => setMobileOpen(false)}>Kategoriler</MobileNavLink>
            {user && (
              <>
                <MobileNavLink href="/seller/dashboard" onClick={() => setMobileOpen(false)}>Satici Paneli</MobileNavLink>
                <MobileNavLink href="/orders" onClick={() => setMobileOpen(false)}>Siparislerim</MobileNavLink>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[var(--neon-red)] hover:bg-[rgba(255,58,58,0.06)] rounded-lg transition-colors"
                >
                  Cikis Yap
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan-pale)] rounded-lg transition-all duration-200"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan-pale)] rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
