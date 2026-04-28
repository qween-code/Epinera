import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Sentinel — SAP & ProManage Gözetim",
  description: "Proaktif log analizi, anomali tespiti ve aksiyon yönetimi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
