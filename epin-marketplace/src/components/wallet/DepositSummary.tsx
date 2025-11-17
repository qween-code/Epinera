'use client';

import Link from 'next/link';

interface DepositSummaryProps {
  depositAmount: number;
  processingFee: number;
  totalPayable: number;
  creditsToReceive: number;
  currency: string;
  onDeposit: () => void;
  isProcessing?: boolean;
}

export default function DepositSummary({
  depositAmount,
  processingFee,
  totalPayable,
  creditsToReceive,
  currency,
  onDeposit,
  isProcessing = false,
}: DepositSummaryProps) {
  return (
    <div className="flex flex-col gap-6 sticky top-28">
      <div className="bg-white dark:bg-black/20 p-6 rounded-xl border border-gray-200 dark:border-white/10">
        <h3 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
          Deposit Summary
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">Deposit Amount</p>
            <p className="text-black dark:text-white font-medium">
              {depositAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">Processing Fee</p>
            <p className="text-black dark:text-white font-medium">
              {processingFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </p>
          </div>
          <div className="border-t border-dashed border-gray-300 dark:border-white/20 my-2"></div>
          <div className="flex justify-between items-center text-base">
            <p className="text-black dark:text-white font-bold">Total Payable Amount</p>
            <p className="text-black dark:text-white font-bold text-lg">
              {totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </p>
          </div>
          <div className="flex justify-between items-center text-primary text-base font-bold bg-primary/10 p-4 rounded-lg mt-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl">workspace_premium</span>
              <span>Credits You'll Receive</span>
            </div>
            <span>{creditsToReceive.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CR</span>
          </div>
        </div>
      </div>
      <button
        onClick={onDeposit}
        disabled={isProcessing || depositAmount <= 0}
        className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="truncate">
          {isProcessing
            ? 'Processing...'
            : `Deposit ${totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency} & Get ${creditsToReceive.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Credits`}
        </span>
      </button>
      <div className="flex flex-col gap-3 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <p className="text-xs font-medium">Your transactions are secured with end-to-end encryption.</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <span>·</span>
          <Link href="/payment-policy" className="hover:text-primary transition-colors">
            Payment Policy
          </Link>
          <span>·</span>
          <Link href="/help" className="hover:text-primary transition-colors">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
}

