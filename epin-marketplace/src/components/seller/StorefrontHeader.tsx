'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StorefrontHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-1 justify-center w-full bg-[#101d23]">
      <div className="flex flex-col w-full max-w-7xl">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#223d49] px-6 py-3">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 text-white">
              <div className="size-6 text-primary">
                <span className="material-symbols-outlined !text-4xl">storefront</span>
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
            </Link>
            <form onSubmit={handleSearch} className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-[#90b8cb] flex border-none bg-[#223d49] items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#223d49] focus:border-none h-full placeholder:text-[#90b8cb] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="hidden lg:flex items-center gap-9">
              <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/">
                Home
              </Link>
              <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/products">
                Browse
              </Link>
              <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/wallet">
                My Wallet
              </Link>
              <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/support">
                Support
              </Link>
            </div>
            <div className="hidden md:flex gap-2">
              <Link
                href="/login"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
              >
                <span className="truncate">Log In</span>
              </Link>
              <Link
                href="/signup"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#223d49] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#315768] transition-colors"
              >
                <span className="truncate">Sign Up</span>
              </Link>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User avatar image"
              style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")' }}
            />
          </div>
        </header>
      </div>
    </div>
  );
}

