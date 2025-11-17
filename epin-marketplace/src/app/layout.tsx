import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
