'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';

export default function CheckoutHeader() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-6 sm:px-10 lg:px-20 py-4 bg-background-light dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-4 text-slate-800 dark:text-white">
        <Link href="/" className="flex items-center gap-4">
          <div className="size-6 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fillRule="evenodd"></path>
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
        </Link>
      </div>
      <div className="hidden lg:flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary transition-colors" href="/">Home</Link>
          <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary transition-colors" href="/products">Store</Link>
          <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary transition-colors" href="/publishers">Publishers</Link>
          <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary transition-colors" href="/brands">Brands</Link>
        </div>
        <div className="flex gap-2">
          <Link
            href="/wallet"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
          >
            <span className="truncate">My Wallet</span>
          </Link>
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <Link
            href="/cart"
            className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">shopping_basket</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          data-alt="User profile picture"
          style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")' }}
        />
      </div>
    </header>
  );
}

