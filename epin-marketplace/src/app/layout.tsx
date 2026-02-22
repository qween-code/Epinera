import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: {
    default: 'Epinera | Gaming Marketplace',
    template: '%s | Epinera',
  },
  description:
    'Türkiye\'nin en güvenilir gaming marketplace platformu. Valorant, League of Legends, PUBG, Steam ve daha fazlası için güvenli ve hızlı alışveriş.',
  keywords: [
    'gaming',
    'marketplace',
    'valorant',
    'lol',
    'pubg',
    'steam',
    'epin',
    'oyun',
    'türkiye',
    'güvenli alışveriş',
  ],
  authors: [{ name: 'Epinera' }],
  creator: 'Epinera',
  publisher: 'Epinera',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'Epinera',
    title: 'Epinera | Gaming Marketplace',
    description: 'Türkiye\'nin en güvenilir gaming marketplace platformu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Epinera | Gaming Marketplace',
    description: 'Türkiye\'nin en güvenilir gaming marketplace platformu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=Exo+2:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
          {/* Ambient glow effects */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[radial-gradient(ellipse,rgba(0,240,255,0.03),transparent_70%)]" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[radial-gradient(ellipse,rgba(184,41,255,0.025),transparent_70%)]" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[radial-gradient(ellipse,rgba(255,45,120,0.02),transparent_70%)]" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
