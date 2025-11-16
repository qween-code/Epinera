import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Epin Marketplace',
  description: 'The next generation digital marketplace for gamers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="font-sans bg-gray-900 text-white antialiased">
        <Providers>
          <Header />
          <main className="container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
