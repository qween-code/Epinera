import React from "react";
import { DeepNavbar } from "./DeepNavbar";
import { DeepSidebar } from "./DeepSidebar";

interface DeepLayoutProps {
  children: React.ReactNode;
}

export const DeepLayout = ({ children }: DeepLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-0)] text-white font-display">
      <DeepNavbar />
      <div className="flex flex-1 container mx-auto max-w-[1600px] px-0 md:px-4">
        <DeepSidebar />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
      <footer className="border-t border-white/5 py-12 mt-12 bg-[var(--color-surface-0)]">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p>&copy; 2025 EPINERA Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
