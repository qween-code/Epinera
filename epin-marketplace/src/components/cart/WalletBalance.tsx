'use client';

interface WalletBalanceProps {
  balance: number;
  currency: string;
}

export default function WalletBalance({ balance, currency }: WalletBalanceProps) {
  const displayCurrency = currency === 'USD' ? 'Credits' : currency;

  return (
    <div className="mb-6 flex justify-end">
      <div className="flex items-center gap-3 rounded-lg border border-gray-200/20 bg-background-dark p-3 px-4">
        <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Current Balance</span>
          <span className="text-lg font-bold text-white">
            {balance.toLocaleString()} {displayCurrency}
          </span>
        </div>
      </div>
    </div>
  );
}

