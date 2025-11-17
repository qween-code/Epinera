'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileMenu from '@/components/shared/MobileMenu';
import MobileMenuButton from '@/components/shared/MobileMenuButton';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <aside className="w-full h-full bg-[#0c161b] p-4 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {/* Placeholder for store logo and name */}
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=seller")'}}></div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">Mehmet's Game Store</h1>
              <p className="text-slate-400 text-sm font-normal leading-normal">Store Owner</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <Link href="/seller/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link href="/seller/products" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/10 rounded-lg">
              <span className="material-symbols-outlined">inventory_2</span>
              <p className="text-sm font-medium leading-normal">Products</p>
            </Link>
            <Link href="/seller/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
              <p className="text-sm font-bold leading-normal">Order Management</p>
            </Link>
            <Link href="/seller/analytics" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/10 rounded-lg">
              <span className="material-symbols-outlined">bar_chart</span>
              <p className="text-sm font-medium leading-normal">Analytics</p>
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
            <span className="truncate">Upload Product</span>
          </button>
          <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
            <a className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/10 rounded-lg" href="/seller/settings">
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/10 rounded-lg" href="/seller/help">
              <span className="material-symbols-outlined">help</span>
              <p className="text-sm font-medium leading-normal">Help</p>
            </a>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden mt-4 p-2 rounded-lg hover:bg-white/10 text-white text-sm"
        >
          Close Menu
        </button>
      </aside>
      </MobileMenu>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#0c161b] p-4 flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {/* Placeholder for store logo and name */}
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=seller")'}}></div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">Mehmet's Game Store</h1>
              <p className="text-slate-400 text-sm font-normal leading-normal">Store Owner</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <Link href="/seller/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link href="/seller/products" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/10 rounded-lg">
              <span className="material-symbols-outlined">inventory_2</span>
              <p className="text-sm font-medium leading-normal">Products</p>
            </Link>
            <Link href="/seller/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
              <p className="text-sm font-bold leading-normal">Order Management</p>
            </Link>
            <Link href="/seller/analytics" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/10 rounded-lg">
              <span className="material-symbols-outlined">bar_chart</span>
              <p className="text-sm font-medium leading-normal">Analytics</p>
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
            <span className="truncate">Upload Product</span>
          </button>
          <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
            <a className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/10 rounded-lg" href="/seller/settings">
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/10 rounded-lg" href="/seller/help">
              <span className="material-symbols-outlined">help</span>
              <p className="text-sm font-medium leading-normal">Help</p>
            </a>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
