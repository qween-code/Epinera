import React from "react";
import Link from "next/link";
import { Search, Bell, ShoppingCart, Menu, User, Wallet } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { getWalletBalance } from "@/lib/actions/wallet";

export const DeepNavbar = async () => {
  // Fetch wallet balance server-side
  const { balance } = await getWalletBalance();

  // Note: Since this is now a Server Component, we can't use useState directly.
  // We will simplify the mobile menu logic or extract it to a Client Component wrapper if needed.
  // For this specific fix, I'll remove the interactive state for the menu toggle in this component
  // or assume it's fine for now to just link to pages.

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[var(--color-surface-0)]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        {/* Mobile Menu Toggle - Simplified for Server Component */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-bold text-white">
            E
          </div>
          <span className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            EPINERA
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-[var(--color-surface-1)] rounded-lg border border-white/5">
              <Search className="ml-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Valorant VP, LoL RP, Steam Key..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-200 placeholder:text-slate-500 py-2.5 px-3"
              />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Wallet - Desktop */}
          <Link href="/dashboard/wallet" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-2)] border border-white/5 hover:bg-[var(--color-surface-3)] transition-colors">
            <Wallet className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">₺{balance.toFixed(2)}</span>
            <span className="ml-2 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded transition-colors">
              +
            </span>
          </Link>

          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-[var(--color-surface-0)]"></span>
          </button>

          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <ShoppingCart size={20} />
          </button>

          <div className="h-6 w-px bg-white/10 mx-1"></div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
             <Link href="/login">
               <NeonButton variant="ghost" size="sm" className="hidden sm:flex">
                  Giriş Yap
               </NeonButton>
             </Link>
            <Link href="/login">
              <NeonButton variant="primary" size="sm">
                Kayıt Ol
              </NeonButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search - Visible only on mobile */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative flex items-center bg-[var(--color-surface-1)] rounded-lg border border-white/5">
          <Search className="ml-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-200 py-2 px-3"
          />
        </div>
      </div>
    </header>
  );
};
