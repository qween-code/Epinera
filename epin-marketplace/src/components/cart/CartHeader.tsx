'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/CartContext';
import { useState } from 'react';

export default function CartHeader() {
  const { getItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/10 bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-3 text-white" href="/">
              <div className="size-6 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fillRule="evenodd"></path>
                  <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-white text-xl font-bold leading-tight">Epin Marketplace</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-gray-300 hover:text-primary text-sm font-medium transition-colors" href="/">Home</Link>
              <Link className="text-gray-300 hover:text-primary text-sm font-medium transition-colors" href="/products">Store</Link>
              <Link className="text-gray-300 hover:text-primary text-sm font-medium transition-colors" href="/wallet">My Profile</Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end items-center gap-4">
            <form onSubmit={handleSearch} className="hidden lg:flex flex-col relative !h-10 w-full max-w-xs">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200/20 bg-gray-200/10 focus:border-primary/50 h-full placeholder:text-gray-400 pl-10 pr-4 text-sm font-normal"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <Link
              href="/cart"
              className="relative flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-200/10 text-white hover:bg-gray-200/20 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_cart</span>
              {itemCount > 0 && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {itemCount}
                </div>
              )}
            </Link>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User avatar image"
              style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

