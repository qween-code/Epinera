'use client';

interface WithdrawalSummaryProps {
  withdrawalAmount: number;
  transactionFee: number;
  currency?: string;
  onContinue?: () => void;
}

export default function WithdrawalSummary({
  withdrawalAmount,
  transactionFee,
  currency = 'USD',
  onContinue,
}: WithdrawalSummaryProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const totalReceived = withdrawalAmount - transactionFee;

  return (
    <div className="flex flex-col gap-4 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-[#182b34] p-6 h-fit">
      <h3 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
        Transaction Summary
      </h3>
      <div className="flex flex-col gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-normal">Withdrawal Amount</p>
          <p className="text-black dark:text-white text-sm font-medium">{formatAmount(withdrawalAmount)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-normal">Transaction Fee</p>
          <p className="text-black dark:text-white text-sm font-medium">{formatAmount(transactionFee)}</p>
        </div>
      </div>
      <div className="flex justify-between items-center font-bold">
        <p className="text-black dark:text-white text-base">You will receive</p>
        <p className="text-black dark:text-white text-base">{formatAmount(totalReceived)}</p>
      </div>
      <button
        onClick={onContinue}
        disabled={withdrawalAmount <= 0 || totalReceived <= 0}
        className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-primary/90 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Verification
      </button>
      <div className="flex flex-col gap-4 text-center mt-4">
        <div className="flex items-center gap-3 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary p-3 rounded-lg">
          <span className="material-symbols-outlined text-xl">schedule</span>
          <p className="text-sm font-normal">Bank transfers may take 1-3 business days.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 p-3 rounded-lg">
          <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
          <p className="text-sm font-normal">Daily withdrawal limit: $5,000 / $10,000</p>
        </div>
      </div>
    </div>
  );
}

