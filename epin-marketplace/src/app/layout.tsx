import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DeepLayout } from "@/components/layout/DeepLayout";

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
    default: "EPINERA | Next-Gen Epin Marketplace",
    template: "%s | EPINERA",
  },
  description:
    "The most advanced marketplace for gamers. Buy and sell accounts, items, and keys instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--color-surface-0)]`}>
        <DeepLayout>
          {children}
        </DeepLayout>
      </body>
    </html>
  );
}
