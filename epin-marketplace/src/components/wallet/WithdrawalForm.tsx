'use client';

import { useState } from 'react';
import Link from 'next/link';

interface WithdrawalFormProps {
  availableBalance: number;
  currency?: string;
  onWithdraw?: (amount: number, method: string, accountId: string) => void;
}

export default function WithdrawalForm({ availableBalance, currency = 'USD', onWithdraw }: WithdrawalFormProps) {
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('chase');

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const transactionFee = 2.50;
  const withdrawalAmount = parseFloat(amount) || 0;
  const totalReceived = withdrawalAmount - transactionFee;

  const handleMaxClick = () => {
    setAmount(availableBalance.toFixed(2));
  };

  const handleSubmit = () => {
    if (withdrawalAmount > 0 && withdrawalAmount <= availableBalance) {
      onWithdraw?.(withdrawalAmount, withdrawalMethod, selectedAccount);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-[#182b34] p-4 sm:p-6">
      {/* Available Balance */}
      <div className="p-4 @container">
        <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-[#182b34] p-6">
          <div className="w-full flex min-w-72 grow flex-col items-stretch justify-center gap-1">
            <p className="text-gray-500 dark:text-[#90b8cb] text-base font-medium leading-normal">Available Balance</p>
            <div className="flex items-end gap-3 justify-between">
              <p className="text-black dark:text-white text-4xl font-bold leading-tight tracking-[-0.015em]">
                {formatBalance(availableBalance)}
              </p>
              <Link href="/wallet/history" className="text-primary text-sm font-medium leading-normal hover:underline">
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Method Selection */}
      <div className="flex px-0 py-3">
        <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-black/5 dark:bg-[#223d49] p-1">
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-colors ${
              withdrawalMethod === 'bank'
                ? 'bg-white dark:bg-[#101d23] shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-black dark:text-white'
                : 'text-gray-500 dark:text-[#90b8cb]'
            }`}
          >
            <span className="truncate">Bank Account</span>
            <input
              checked={withdrawalMethod === 'bank'}
              onChange={() => setWithdrawalMethod('bank')}
              className="invisible w-0"
              name="withdrawal_method"
              type="radio"
              value="Bank Account"
            />
          </label>
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-colors ${
              withdrawalMethod === 'crypto'
                ? 'bg-white dark:bg-[#101d23] shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-black dark:text-white'
                : 'text-gray-500 dark:text-[#90b8cb]'
            }`}
          >
            <span className="truncate">Crypto Wallet</span>
            <input
              checked={withdrawalMethod === 'crypto'}
              onChange={() => setWithdrawalMethod('crypto')}
              className="invisible w-0"
              name="withdrawal_method"
              type="radio"
              value="Crypto Wallet"
            />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-black dark:text-white text-base font-medium leading-normal pb-2">
            {withdrawalMethod === 'bank' ? 'Saved Bank Accounts' : 'Saved Crypto Wallets'}
          </p>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-[#315768] bg-white dark:bg-[#182b34] focus:border-primary dark:focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-[#90b8cb] p-[15px] text-base font-normal leading-normal"
          >
            {withdrawalMethod === 'bank' ? (
              <>
                <option value="chase">Chase Bank - **** 1234</option>
                <option value="boa">Bank of America - **** 5678</option>
                <option value="new">Add New Bank Account</option>
              </>
            ) : (
              <>
                <option value="btc">Bitcoin Wallet - bc1q...</option>
                <option value="eth">Ethereum Wallet - 0x1234...</option>
                <option value="new">Add New Crypto Wallet</option>
              </>
            )}
          </select>
        </label>
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-black dark:text-white text-base font-medium leading-normal pb-2">
            Amount ({currency})
          </p>
          <div className="relative flex w-full flex-1 items-stretch rounded-lg h-14">
            <input
              type="number"
              step="0.01"
              min="0"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-[#315768] bg-white dark:bg-[#182b34] focus:border-primary dark:focus:border-primary h-full placeholder:text-gray-400 dark:placeholder:text-[#90b8cb] p-[15px] text-base font-normal leading-normal pr-20"
              placeholder="0.00"
            />
            <button
              onClick={handleMaxClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-bold hover:underline"
            >
              Max
            </button>
          </div>
        </label>
      </div>

      {/* Account Details (Read-only for bank) */}
      {withdrawalMethod === 'bank' && (
        <div className="flex flex-col gap-4">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-black dark:text-white text-base font-medium leading-normal pb-2">Account Holder Name</p>
            <input
              readOnly
              value="John Doe"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-[#315768] bg-white dark:bg-[#182b34] focus:border-primary dark:focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-[#90b8cb] p-[15px] text-base font-normal leading-normal"
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-black dark:text-white text-base font-medium leading-normal pb-2">
              IBAN / Account Number
            </p>
            <input
              readOnly
              value="US12345678901234567890"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-[#315768] bg-white dark:bg-[#182b34] focus:border-primary dark:focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-[#90b8cb] p-[15px] text-base font-normal leading-normal"
            />
          </label>
        </div>
      )}
    </div>
  );
}

