'use client';

import Link from 'next/link';

interface PaymentMethodSelectorProps {
  walletBalance: number;
  total: number;
  currency: string;
  onDepositClick?: () => void;
}

export default function PaymentMethodSelector({
  walletBalance,
  total,
  currency,
  onDepositClick,
}: PaymentMethodSelectorProps) {
  const displayCurrency = currency === 'USD' ? 'Credits' : currency;
  const isBalanceSufficient = walletBalance >= total;

  return (
    <div>
      <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
        Payment Method
      </h2>
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Site Credits</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Using your available balance</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Available</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {walletBalance.toLocaleString()} {displayCurrency}
            </p>
          </div>
        </div>
      </div>
      {!isBalanceSufficient && (
        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mt-6">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400 mt-0.5">error</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-800 dark:text-red-300">Insufficient Credits</h3>
              <p className="text-red-700 dark:text-red-400 mt-2 text-base">
                You do not have enough credits for this purchase. Please deposit more credits to your wallet to proceed.
              </p>
              <div className="mt-6">
                <Link
                  href="/wallet/deposit"
                  onClick={onDepositClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-primary text-white text-base font-bold transition-opacity hover:opacity-90"
                >
                  <span className="material-symbols-outlined">add_card</span>
                  <span>Deposit Credits</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

