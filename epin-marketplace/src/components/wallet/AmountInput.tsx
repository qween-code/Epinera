'use client';

import { useState } from 'react';

interface AmountInputProps {
  amount: number;
  currency: string;
  onAmountChange: (amount: number) => void;
  onCurrencyChange?: (currency: string) => void;
}

const QUICK_AMOUNTS = [10, 25, 50, 100];

export default function AmountInput({ amount, currency, onAmountChange, onCurrencyChange }: AmountInputProps) {
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(50);

  const handleQuickAmountClick = (quickAmount: number) => {
    setSelectedQuickAmount(quickAmount);
    onAmountChange(quickAmount);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col min-w-40 flex-1">
        <p className="text-black dark:text-white text-base font-medium leading-normal pb-2">Enter Amount</p>
        <div className="flex w-full flex-1 items-stretch rounded-lg">
          <input
            type="number"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white text-2xl font-bold focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/5 h-16 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-r-none border-r-0"
            placeholder="50.00"
            value={amount || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              onAmountChange(value);
              setSelectedQuickAmount(null);
            }}
            min="0"
            step="0.01"
          />
          <div className="text-black dark:text-white flex border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/5 items-center justify-center px-4 rounded-r-lg border-l-0 text-base font-semibold">
            {currency}
            {onCurrencyChange && (
              <span className="material-symbols-outlined text-lg ml-1 text-gray-500 dark:text-gray-400">expand_more</span>
            )}
          </div>
        </div>
      </label>
      <div className="flex gap-3 flex-wrap">
        {QUICK_AMOUNTS.map((quickAmount) => (
          <button
            key={quickAmount}
            onClick={() => handleQuickAmountClick(quickAmount)}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${
              selectedQuickAmount === quickAmount
                ? 'bg-primary/20 ring-2 ring-primary'
                : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            <p className={`text-sm font-medium leading-normal ${
              selectedQuickAmount === quickAmount
                ? 'text-primary font-bold'
                : 'text-black dark:text-white'
            }`}>
              ${quickAmount}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

