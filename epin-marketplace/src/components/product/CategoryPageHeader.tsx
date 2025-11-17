'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';

export default function CategoryPageHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center border-b border-white/10 bg-background-dark/80 px-4 py-3 backdrop-blur-lg sm:px-6 lg:px-8">
      <div className="flex w-full max-w-7xl items-center justify-between whitespace-nowrap">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-white">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fillRule="evenodd"
                ></path>
                <path
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="/">
              Home
            </Link>
            <Link className="text-white text-sm font-bold leading-normal" href="/products">
              Games
            </Link>
            <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="/products">
              Platforms
            </Link>
            <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="/products">
              Publishers
            </Link>
            <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="/products">
              Deals
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-4">
          <form onSubmit={handleSearch} className="relative hidden w-full max-w-xs md:flex">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full rounded-lg border-none bg-white/10 text-white placeholder:text-white/50 focus:outline-0 focus:ring-2 focus:ring-primary/50 h-10 pl-10 pr-4 text-sm font-normal leading-normal"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex items-center gap-2">
            <Link
              href="/wallet"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white hover:bg-white/20 text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
            >
              <span className="truncate">Wallet</span>
            </Link>
            <Link
              href="/cart"
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-white/10 text-white hover:bg-white/20 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors relative"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")',
            }}
          ></div>
        </div>
      </div>
    </header>
  );
}

