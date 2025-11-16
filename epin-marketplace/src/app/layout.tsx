import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: {
    default: "Epin Marketplace | AI-Powered Gaming Commerce",
    template: "%s | Epin Marketplace",
  },
  description:
    "Discover AI-curated epin deals, verified sellers, and lightning delivery across 150+ gaming ecosystems.",
  metadataBase: new URL("https://epin.marketplace"),
  openGraph: {
    title: "Epin Marketplace",
    description:
      "AI-first digital goods marketplace delivering verified game keys, creator bundles, and instant fulfillment.",
    url: "https://epin.marketplace",
    siteName: "Epin Marketplace",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Epin Marketplace",
    description:
      "Next-gen digital goods marketplace with AI fraud protection and creator-first economics.",
  },
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
