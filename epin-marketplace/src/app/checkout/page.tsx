'use client';

import { useCart } from '@/lib/cart/CartContext';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import { processCheckout } from '@/app/actions/checkout';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const version = searchParams.get('version') || '1';

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/checkout');
        return;
      }
      setUser(user);

      // Fetch wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .eq('currency', 'USD')
        .single();

      if (wallet) {
        setWalletBalance(parseFloat(wallet.balance.toString()));
      }

      setLoading(false);
    };

    getUser();
  }, [supabase, router]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const subtotal = getTotal();
    const taxes = subtotal * 0.15; // 15% tax
    const total = subtotal + taxes;

    if (walletBalance < total) {
      alert('Insufficient wallet balance');
      return;
    }

    setProcessing(true);

    try {
      const result = await processCheckout();

      if (result.success) {
        await clearCart();
        router.push(`/orders/${result.orderId}?success=true`);
      } else {
        alert(result.error || 'Checkout failed');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout: ' + (error.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-slate-900 dark:text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
        <CheckoutHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h1>
            <p className="text-slate-500 dark:text-slate-400">Please add items to your cart before checkout</p>
            <Link
              href="/"
              className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const subtotal = getTotal();
  const taxes = subtotal * 0.15; // 15% tax
  const total = subtotal + taxes;
  const currency = items[0]?.variant?.currency || 'USD';
  const isBalanceSufficient = walletBalance >= total;
  const displayCurrency = currency === 'USD' ? 'Credits' : currency;
  const pageTitle = version === '4' ? 'Secure Checkout' : 'Confirm Your Purchase';

  // Version 2 Layout (Insufficient Credits with "Add Funds to Wallet" button)
  if (version === '2') {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div className="layout-container flex h-full grow flex-col">
          <CheckoutHeader />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex flex-wrap justify-between gap-4 mb-8">
              <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                Confirm Your Purchase
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1 lg:order-last">
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  taxes={taxes}
                  total={total}
                  currency={currency}
                />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {/* Payment Method */}
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
                          <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400 mt-0.5">
                            error
                          </span>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-red-800 dark:text-red-300">Insufficient Credits</h3>
                            <p className="text-red-700 dark:text-red-400 mt-2 text-base">
                              You do not have enough credits for this purchase. Please add funds to your wallet to proceed.
                            </p>
                            <div className="mt-6">
                              <Link
                                href="/wallet/deposit"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-primary text-white text-base font-bold transition-opacity hover:opacity-90"
                              >
                                <span className="material-symbols-outlined">add_card</span>
                                <span>Add Funds to Wallet</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Checkout Button */}
                  {isBalanceSufficient && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleCheckout}
                        disabled={processing}
                        className="flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-primary text-white text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing ? (
                          <>
                            <span className="material-symbols-outlined animate-spin">sync</span>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined">check_circle</span>
                            <span>Confirm Purchase</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Default Layout (Version 1, 3, 4, 5)
  return (
    <div className="relative flex min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <CheckoutHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-wrap justify-between gap-4 mb-8">
            <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              {pageTitle}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 lg:order-last">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                taxes={taxes}
                total={total}
                currency={currency}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Payment Method */}
                <PaymentMethodSelector
                  walletBalance={walletBalance}
                  total={total}
                  currency={currency}
                />

                {/* Checkout Button */}
                {isBalanceSufficient && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleCheckout}
                      disabled={processing}
                      className="flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-primary text-white text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">sync</span>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">check_circle</span>
                          <span>Confirm Purchase</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
