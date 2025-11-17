'use client';

import Link from 'next/link';

export default function WithdrawalHeader() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 dark:border-b-[#223d49] px-4 sm:px-10 py-3 sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-4 text-black dark:text-white">
          <div className="size-6 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fillRule="evenodd"></path>
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
        </Link>
        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-gray-400 dark:text-[#90b8cb] flex border-none bg-black/5 dark:bg-[#223d49] items-center justify-center pl-4 rounded-l-lg border-r-0">
              <span className="material-symbols-outlined text-base">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-0 border-none bg-black/5 dark:bg-[#223d49] focus:border-none h-full placeholder:text-gray-400 dark:placeholder:text-[#90b8cb] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              placeholder="Search"
              value=""
            />
          </div>
        </label>
      </div>
      <div className="flex flex-1 justify-end gap-2 sm:gap-4 md:gap-8">
        <div className="hidden lg:flex items-center gap-9">
          <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" href="/">
            Dashboard
          </Link>
          <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" href="/">
            Marketplace
          </Link>
          <Link className="text-primary dark:text-primary text-sm font-bold leading-normal" href="/wallet">
            Wallet
          </Link>
          <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" href="/wallet/history">
            History
          </Link>
          <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" href="/settings">
            Settings
          </Link>
        </div>
        <div className="flex gap-2">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-black/5 dark:bg-[#223d49] text-gray-600 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-black/5 dark:bg-[#223d49] text-gray-600 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <span className="material-symbols-outlined text-xl">help</span>
          </button>
        </div>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          data-alt="User's profile picture"
          style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")' }}
        />
      </div>
    </header>
  );
}

