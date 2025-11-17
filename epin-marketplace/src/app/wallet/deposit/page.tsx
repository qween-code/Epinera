'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import WalletDepositHeader from '@/components/wallet/WalletDepositHeader';
import AmountInput from '@/components/wallet/AmountInput';
import PromoCodeInput from '@/components/wallet/PromoCodeInput';
import PaymentMethodSelector from '@/components/wallet/PaymentMethodSelector';
import CardForm from '@/components/wallet/CardForm';
import DepositSummary from '@/components/wallet/DepositSummary';
import { applyDiscountCode } from '@/app/actions/wallet';

export default function DepositPage() {
  const searchParams = useSearchParams();
  const version = parseInt(searchParams.get('version') || '1', 10);
  const [amount, setAmount] = useState(50.00);
  const [currency, setCurrency] = useState('USD');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Calculate fees and totals
  const processingFee = amount * 0.03; // 3% processing fee
  const totalPayable = amount + processingFee - promoDiscount;
  const creditsToReceive = amount; // 1:1 conversion for now

  const handlePromoCodeApply = async (code: string) => {
    const result = await applyDiscountCode(code);
    if (result.success && result.discount) {
      if (result.discount.percentage) {
        setPromoDiscount(amount * (result.discount.percentage / 100));
      } else if (result.discount.amount) {
        setPromoDiscount(parseFloat(result.discount.amount.toString()));
      }
    } else {
      throw new Error(result.error || 'Invalid promo code');
    }
  };

  const handleDeposit = async () => {
    if (amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // TODO: Implement actual payment processing
      // For now, simulate success
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Redirect to wallet page
      router.push('/wallet?deposit=success');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <WalletDepositHeader />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6">
          {/* Breadcrumbs */}
          <div>
            <div className="flex flex-wrap gap-2">
              <Link className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary transition-colors" href="/wallet">
                Wallet
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
              <span className="text-black dark:text-white text-sm font-medium leading-normal">Deposit</span>
            </div>
            <div className="flex flex-wrap justify-between gap-3 pt-2">
              <div>
                <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                  {version === 2 ? 'Deposit Funds' : 'Deposit Funds & Get Credits'}
                </p>
                {version !== 2 && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Deposit money into your wallet to receive site credits for purchases.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Form */}
            <div className="lg:col-span-2 bg-white dark:bg-black/20 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-white/10 flex flex-col gap-8">
              <AmountInput
                amount={amount}
                currency={currency}
                onAmountChange={setAmount}
              />

              {/* Promo code section - hidden in version 2 */}
              {version !== 2 && (
                <>
                  <div className="border-t border-dashed border-gray-200 dark:border-white/10"></div>
                  <PromoCodeInput onApply={handlePromoCodeApply} />
                </>
              )}

              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onSelectMethod={setSelectedPaymentMethod}
                version={version}
              />

              {selectedPaymentMethod === 'credit_card' && (
                <CardForm />
              )}

              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <DepositSummary
                depositAmount={amount}
                processingFee={processingFee}
                totalPayable={totalPayable}
                creditsToReceive={creditsToReceive}
                currency={currency}
                onDeposit={handleDeposit}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
