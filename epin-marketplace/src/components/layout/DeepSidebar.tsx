"use client";

import React from "react";
import Link from "next/link";
import {
  Gamepad2,
  Monitor,
  Smartphone,
  Gift,
  CreditCard,
  Trophy,
  Zap,
  ShieldCheck,
  Headphones
} from "lucide-react";

const categories = [
  { name: "PC Oyunları", icon: Monitor, href: "/category/pc-games" },
  { name: "Mobil Oyunlar", icon: Smartphone, href: "/category/mobile-games" },
  { name: "Oyun Parası", icon: CreditCard, href: "/category/game-currency" },
  { name: "Hesap Satış", icon: User, href: "/category/accounts" }, // Using local var User is tricky, let's import below or assume Lucide
  { name: "Random Key", icon: Gift, href: "/category/random-keys" },
  { name: "Boost", icon: Trophy, href: "/category/boost" },
];

import { User } from "lucide-react"; // Re-import to be safe

const popularGames = [
  { name: "Valorant", href: "/game/valorant", color: "text-red-500" },
  { name: "League of Legends", href: "/game/league-of-legends", color: "text-blue-500" },
  { name: "CS2", href: "/game/cs2", color: "text-orange-500" },
  { name: "PUBG Mobile", href: "/game/pubg-mobile", color: "text-yellow-500" },
  { name: "Knight Online", href: "/game/knight-online", color: "text-amber-700" },
  { name: "Metin2", href: "/game/metin2", color: "text-slate-400" },
];

export const DeepSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 sticky top-16 h-[calc(100vh-4rem)] border-r border-white/5 bg-[var(--color-surface-0)]/50 backdrop-blur-sm p-4 gap-8 overflow-y-auto">

      {/* Main Navigation */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Market</h3>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
          >
            <cat.icon size={18} className="group-hover:text-blue-400 transition-colors" />
            <span className="text-sm font-medium">{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Popular Games */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Popüler Oyunlar</h3>
        {popularGames.map((game) => (
          <Link
            key={game.name}
            href={game.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className={`h-2 w-2 rounded-full ${game.color} shadow-[0_0_8px_currentColor]`}></span>
            <span className="text-sm">{game.name}</span>
          </Link>
        ))}
      </div>

      {/* Banner / Promo */}
      <div className="mt-auto rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-2 text-yellow-400">
          <Zap size={16} />
          <span className="text-xs font-bold uppercase">Hızlı Satış</span>
        </div>
        <p className="text-xs text-slate-300 mb-3">
          İlanını öne çıkar, %50 daha hızlı sat!
        </p>
        <button className="w-full text-xs bg-white/10 hover:bg-white/20 text-white py-1.5 rounded transition-colors">
          İlan Ekle
        </button>
      </div>

      {/* Support */}
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[var(--color-surface-1)] border border-white/5">
        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
          <Headphones size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-200">Canlı Destek</span>
          <span className="text-[10px] text-slate-500">7/24 Aktif</span>
        </div>
      </div>

    </aside>
  );
};
