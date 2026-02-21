import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-20">
      {/* Top divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg neo-sm flex items-center justify-center border border-[rgba(0,240,255,0.15)]">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[var(--neon-cyan)]" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-lg">
                <span className="text-neon-cyan">EPI</span>NERA
              </span>
            </div>
            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
              Turkiye&apos;nin en guvenli gaming marketplace platformu. Anlik teslimat, guvenli odeme.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="terminal-label mb-4">// Oyunlar</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/category/valorant">Valorant</FooterLink>
              <FooterLink href="/category/league-of-legends">League of Legends</FooterLink>
              <FooterLink href="/category/pubg-mobile">PUBG Mobile</FooterLink>
              <FooterLink href="/category/steam">Steam</FooterLink>
              <FooterLink href="/category/knight-online">Knight Online</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="terminal-label mb-4">// Platform</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/search">Urun Ara</FooterLink>
              <FooterLink href="/seller/dashboard">Satici Ol</FooterLink>
              <FooterLink href="/orders">Siparislerim</FooterLink>
              <FooterLink href="/cart">Sepetim</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="terminal-label mb-4">// Destek</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/help">Yardim Merkezi</FooterLink>
              <FooterLink href="/terms">Kullanim Kosullari</FooterLink>
              <FooterLink href="/privacy">Gizlilik Politikasi</FooterLink>
              <FooterLink href="/contact">Iletisim</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border-dim)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-mono-accent text-[var(--text-ghost)]">
              &copy; 2026 EPINERA. TUM HAKLARI SAKLIDIR.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-[var(--text-ghost)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
                Sistem Aktif
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-[var(--text-tertiary)] hover:text-[var(--neon-cyan)] transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}
