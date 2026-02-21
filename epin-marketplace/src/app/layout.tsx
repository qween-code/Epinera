import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Epinera | Gaming Marketplace',
  description: 'Retro-futuristic gaming marketplace. Valorant, LOL, PUBG, Steam ve daha fazlasi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
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
