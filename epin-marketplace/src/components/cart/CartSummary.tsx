'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  currency: string;
  walletBalance: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export default function CartSummary({
  subtotal,
  discount,
  taxes,
  total,
  currency,
  walletBalance,
  onCheckout,
  isLoading = false,
}: CartSummaryProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    try {
      const { applyDiscountCode } = await import('@/app/actions/wallet');
      const result = await applyDiscountCode(discountCode);
      if (result.success && result.discount) {
        // TODO: Update discount state in parent component
        console.log('Discount applied:', result.discount);
      } else {
        alert(result.error || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      alert('Failed to apply discount code');
    } finally {
      setApplyingDiscount(false);
    }
  };

  const isBalanceSufficient = walletBalance >= total;
  const displayCurrency = currency === 'USD' ? 'Credits' : currency;
  const shortCurrency = currency === 'USD' ? 'Cr' : currency;

  return (
    <div className="sticky top-28 flex flex-col gap-6 rounded-xl border border-gray-200/20 bg-background-dark p-6">
      <h2 className="text-white text-2xl font-bold">Order Summary</h2>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-gray-300">
          <span>Subtotal</span>
          <span className="text-white font-medium">
            {subtotal.toLocaleString()} {displayCurrency}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-300">
          <span>Discount</span>
          <span className="text-white font-medium">
            -{discount.toLocaleString()} {displayCurrency}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-300">
          <span>Taxes (if applicable)</span>
          <span className="text-white font-medium">
            {taxes.toLocaleString()} {displayCurrency}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200/20"></div>

      <div className="flex justify-between items-center">
        <span className="text-white text-xl font-bold">Total Cost</span>
        <span className="text-white text-2xl font-bold">
          {total.toLocaleString()} {displayCurrency}
        </span>
      </div>

      {/* Discount Code Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300" htmlFor="discount-code">
          Discount Code or Coupon
        </label>
        <div className="flex gap-2">
          <input
            id="discount-code"
            name="discount-code"
            type="text"
            placeholder="Enter code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200/20 bg-gray-200/10 focus:border-primary/50 h-11 placeholder:text-gray-400 px-4 text-sm font-normal"
          />
          <button
            onClick={handleApplyDiscount}
            disabled={applyingDiscount || !discountCode.trim()}
            className="flex shrink-0 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-gray-200/20 text-white gap-2 text-sm font-bold min-w-0 px-4 hover:bg-gray-200/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applyingDiscount ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Wallet Balance Status */}
      <div className="flex flex-col gap-4">
        {isBalanceSufficient ? (
          <div className="flex flex-col items-center gap-2 rounded-lg bg-green-900/40 p-4 border border-green-500/50 text-center">
            <div className="flex items-center gap-2 text-green-400">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
              <h3 className="text-xl font-bold">Ready to Purchase</h3>
            </div>
            <p className="text-gray-300 text-sm max-w-sm">
              Your balance of{' '}
              <span className="font-bold text-white">
                {walletBalance.toLocaleString()} {displayCurrency}
              </span>{' '}
              is sufficient to complete this purchase.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-lg bg-amber-900/40 p-4 border border-amber-500/50 text-center">
            <div className="flex items-center gap-2 text-amber-400">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-xl font-bold">Insufficient Balance</h3>
            </div>
            <p className="text-gray-300 text-sm max-w-sm">
              You need{' '}
              <span className="font-bold text-white">
                {(total - walletBalance).toLocaleString()} {displayCurrency}
              </span>{' '}
              more to complete this purchase.
            </p>
            <Link
              href="/wallet/deposit"
              className="text-primary hover:text-primary/80 text-sm font-medium mt-2"
            >
              Add Funds
            </Link>
          </div>
        )}

        <button
          onClick={onCheckout}
          disabled={!isBalanceSufficient || isLoading}
          className="flex w-full items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold tracking-wide transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span>{isLoading ? 'Processing...' : 'Pay with Credits'}</span>
        </button>

        <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-green-400">verified_user</span>
          Blockchain Secured Transactions
        </p>
      </div>
    </div>
  );
}

