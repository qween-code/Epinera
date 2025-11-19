'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/CartContext';

export default function HomepageHeader() {
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
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-6 sm:px-10 py-3 sticky top-0 z-50 bg-background-dark/80 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="material-symbols-outlined text-primary text-3xl">data_object</span>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
        </Link>
        <nav className="hidden lg:flex items-center gap-9">
          <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/products">Games</Link>
          <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/products?deals=true">Deals</Link>
          <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/community">Community</Link>
          <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/wallet">Wallet</Link>
        </nav>
      </div>
      <div className="flex flex-1 justify-end items-center gap-4">
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 justify-end max-w-xs">
          <label className="flex flex-col w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
              <div className="text-white/50 flex bg-container-dark items-center justify-center pl-3 rounded-l-lg">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-container-dark h-full placeholder:text-white/50 px-2 text-sm font-normal leading-normal"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
        </form>
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/signup"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-black text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
          >
            <span className="truncate">Sign Up</span>
          </Link>
          <Link
            href="/login"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-container-dark hover:bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
          >
            <span className="truncate">Sign In</span>
          </Link>
        </div>
        <Link
          href="/cart"
          className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 bg-gray-200 dark:bg-white/10 text-black dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-black dark:text-white">shopping_cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
        <Link
          href="/profile"
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 hover:ring-2 hover:ring-primary transition-all cursor-pointer"
          data-alt="User profile avatar"
          style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")' }}
        />
      </div>
    </header>
  );
}

