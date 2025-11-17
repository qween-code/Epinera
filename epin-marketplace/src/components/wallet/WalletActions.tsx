'use client';

import Link from 'next/link';

export default function WalletActions() {
  return (
    <div className="flex flex-col gap-3 justify-start p-4 bg-[#223d49]/50 rounded-xl border border-white/10 h-full">
      <h3 className="text-white font-bold mb-2">Actions</h3>
      <Link
        href="/wallet/deposit"
        className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
      >
        <span className="truncate">Deposit</span>
      </Link>
      <Link
        href="/wallet/withdraw"
        className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#223d49] hover:bg-[#315768] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
      >
        <span className="truncate">Withdraw</span>
      </Link>
      <Link
        href="/wallet/bonus-terms"
        className="text-sm text-primary hover:underline mt-auto pt-4 text-center"
      >
        Bonus Terms
      </Link>
    </div>
  );
}

