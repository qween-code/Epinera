'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WithdrawalHeader from '@/components/wallet/WithdrawalHeader';
import WithdrawalForm from '@/components/wallet/WithdrawalForm';
import WithdrawalSummary from '@/components/wallet/WithdrawalSummary';
import { getWalletBalance } from '@/app/actions/wallet';

export default function WithdrawPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [transactionFee] = useState(2.50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      try {
        const result = await getWalletBalance('USD');
        if (result.success) {
          setWallet(result);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const handleWithdraw = async (amount: number, method: string, accountId: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const { requestPayout } = await import('@/app/actions/payout');
      const result = await requestPayout(amount, currency, method as 'bank' | 'crypto', {
        accountNumber: method === 'bank' ? accountId : undefined,
        cryptoAddress: method === 'crypto' ? accountId : undefined,
      });

      if (result.success) {
        setWithdrawalAmount(amount);
        router.push('/wallet?withdraw=success');
      } else {
        setError(result.error || 'Withdrawal failed');
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    // TODO: Implement 2FA verification modal
    console.log('Continue to verification');
  };

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
        <WithdrawalHeader />
        <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
            <div className="text-center text-black dark:text-white/50">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  const availableBalance = wallet?.balance || 0;
  const currency = wallet?.currency || 'USD';

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <WithdrawalHeader />
        <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Withdraw Funds
                </p>
                <p className="text-gray-500 dark:text-[#90b8cb] text-base font-normal leading-normal">
                  Securely transfer funds from your wallet to your bank or crypto account.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <WithdrawalForm
                  availableBalance={availableBalance}
                  currency={currency}
                  onWithdraw={handleWithdraw}
                />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <WithdrawalSummary
                  withdrawalAmount={withdrawalAmount}
                  transactionFee={transactionFee}
                  currency={currency}
                  onContinue={handleContinue}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

