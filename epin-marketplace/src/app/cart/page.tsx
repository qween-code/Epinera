'use client';

import { useCart } from '@/lib/cart/CartContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import WalletBalance from '@/components/cart/WalletBalance';
import CartHeader from '@/components/cart/CartHeader';
import { createClient } from '@/utils/supabase/client';

export default function CartPage() {
  const { items, loading, removeFromCart, updateQuantity, getTotal } = useCart();
  const [walletBalance, setWalletBalance] = useState(10000); // Default, will fetch from API
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const version = searchParams.get('version') || '1';
  const supabase = createClient();

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .eq('currency', 'USD')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching wallet balance:', error);
          return;
        }

        if (data) {
          setWalletBalance(parseFloat(data.balance.toString()));
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };
    fetchWalletBalance();
  }, [supabase]);

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const { processCheckout } = await import('@/app/actions/checkout');
      const result = await processCheckout();
      
      if (result.success) {
        // Navigate to order confirmation
        router.push(`/orders/${result.orderId}`);
      } else {
        alert(result.error || 'Checkout failed');
        if (result.required && result.available !== undefined) {
          // Insufficient balance - redirect to wallet deposit
          router.push(`/wallet/deposit?required=${result.required}&available=${result.available}`);
        }
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-display bg-background-light dark:bg-background-dark">
        <div className="text-xl text-white">Loading your cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark">
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <span className="text-gray-500 text-sm">/</span>
                <span className="text-white text-sm font-medium">Your Cart</span>
              </div>
              <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tighter">
                Your Shopping Cart
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <span className="material-symbols-outlined text-6xl text-gray-400">shopping_cart</span>
              <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
              <p className="text-gray-400">Looks like you haven't added anything to your cart yet.</p>
              <Link
                href="/"
                className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors text-white"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const subtotal = getTotal();
  const discount = 0; // TODO: Calculate from applied discount codes
  const taxes = subtotal * 0.08; // 8% tax (mock)
  const total = subtotal - discount + taxes;
  const currency = items[0]?.variant?.currency || 'USD';
  const useCredits = version === '3' || version === '4' || version === '5';
  const displayCurrency = useCredits ? 'Credits' : currency;
  const isBalanceSufficient = walletBalance >= total;

  // Version 4 Layout (Credits format with compact insufficient balance warning)
  if (version === '4') {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark">
        <CartHeader />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumbs & Heading */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <span className="text-gray-500 text-sm">/</span>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary text-sm font-medium transition-colors"
                >
                  Store
                </Link>
                <span className="text-gray-500 text-sm">/</span>
                <span className="text-white text-sm font-medium">Your Cart</span>
              </div>
              <div className="flex flex-wrap justify-between gap-4 items-baseline">
                <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tighter">
                  Your Shopping Cart
                </h1>
                <Link
                  href="/"
                  className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="mb-6 flex justify-end">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200/20 bg-background-dark p-3 px-4">
                <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Current Balance</span>
                  <span className="text-lg font-bold text-white">
                    {walletBalance.toLocaleString()} {displayCurrency}
                  </span>
                </div>
              </div>
            </div>

            {/* Cart Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-gray-200/20 bg-gray-200/20">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      product={{
                        id: item.product.id,
                        title: item.product.title,
                        slug: item.product.slug,
                        image: item.product.image || null,
                      }}
                      variant={{
                        id: item.variant.id,
                        name: item.variant.name,
                        price: parseFloat(item.variant.price.toString()),
                        currency: displayCurrency,
                      }}
                      quantity={item.quantity}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      platform={item.variant.name.includes('Steam') ? 'Steam' : item.variant.name.includes('Fortnite') ? 'Fortnite' : undefined}
                    />
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
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
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300" htmlFor="discount-code">
                      Discount Code or Coupon
                    </label>
                    <div className="flex gap-2">
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200/20 bg-gray-200/10 focus:border-primary/50 h-11 placeholder:text-gray-400 px-4 text-sm font-normal"
                        id="discount-code"
                        name="discount-code"
                        placeholder="Enter code"
                        type="text"
                      />
                      <button className="flex shrink-0 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-gray-200/20 text-white gap-2 text-sm font-bold min-w-0 px-4 hover:bg-gray-200/30 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {!isBalanceSufficient && (
                      <div className="flex items-center justify-between rounded-lg bg-red-900/40 p-4 border border-red-500/50">
                        <div className="flex flex-col">
                          <p className="text-red-400 text-sm font-semibold">Insufficient Credits</p>
                          <p className="text-gray-300 text-sm">
                            Your balance: <span className="font-bold">{walletBalance.toLocaleString()} {displayCurrency}</span>
                          </p>
                        </div>
                        <Link
                          className="flex shrink-0 items-center justify-center rounded-lg h-10 bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
                          href="/wallet/deposit"
                        >
                          <span className="material-symbols-outlined mr-2">add_card</span>
                          <span>Deposit</span>
                        </Link>
                      </div>
                    )}
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut || !isBalanceSufficient}
                      className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-gray-500 text-gray-300 gap-2 text-base font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined">lock</span>
                      <span>Proceed to Credit Payment</span>
                    </button>
                    <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-green-400">verified_user</span>
                      Blockchain Secured Transactions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Version 3, 5 Layout (Credits format with insufficient balance warning)
  if (version === '3' || version === '5') {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark">
        <CartHeader />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumbs & Heading */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <span className="text-gray-500 text-sm">/</span>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary text-sm font-medium transition-colors"
                >
                  Store
                </Link>
                <span className="text-gray-500 text-sm">/</span>
                <span className="text-white text-sm font-medium">Your Cart</span>
              </div>
              <div className="flex flex-wrap justify-between gap-4 items-baseline">
                <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tighter">
                  Your Shopping Cart
                </h1>
                <Link
                  href="/"
                  className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="mb-6 flex justify-end">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200/20 bg-background-dark p-3 px-4">
                <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Current Balance</span>
                  <span className="text-lg font-bold text-white">
                    {walletBalance.toLocaleString()} {displayCurrency}
                  </span>
                </div>
              </div>
            </div>

            {/* Cart Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-gray-200/20 bg-gray-200/20">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      product={{
                        id: item.product.id,
                        title: item.product.title,
                        slug: item.product.slug,
                        image: item.product.image || null,
                      }}
                      variant={{
                        id: item.variant.id,
                        name: item.variant.name,
                        price: parseFloat(item.variant.price.toString()),
                        currency: displayCurrency,
                      }}
                      quantity={item.quantity}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      platform={item.variant.name.includes('Steam') ? 'Steam' : item.variant.name.includes('Fortnite') ? 'Fortnite' : undefined}
                    />
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
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
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300" htmlFor="discount-code">
                      Discount Code or Coupon
                    </label>
                    <div className="flex gap-2">
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200/20 bg-gray-200/10 focus:border-primary/50 h-11 placeholder:text-gray-400 px-4 text-sm font-normal"
                        id="discount-code"
                        name="discount-code"
                        placeholder="Enter code"
                        type="text"
                      />
                      <button className="flex shrink-0 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-gray-200/20 text-white gap-2 text-sm font-bold min-w-0 px-4 hover:bg-gray-200/30 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                  {!isBalanceSufficient && (
                    <div className="flex flex-col items-center gap-4 rounded-lg bg-red-900/40 p-4 border border-red-500/50 text-center">
                      <div className="flex items-center gap-2 text-red-400">
                        <span className="material-symbols-outlined text-3xl">error</span>
                        <h3 className="text-xl font-bold">Action Required</h3>
                      </div>
                      <p className="text-gray-300 text-sm max-w-sm">
                        Your balance of <span className="font-bold text-white">{walletBalance.toLocaleString()} {displayCurrency}</span> is too low. Please add more credits to complete your purchase.
                      </p>
                      <Link
                        className="flex w-full shrink-0 items-center justify-center rounded-lg h-11 bg-primary px-5 text-base font-bold text-white hover:bg-primary/90 transition-colors"
                        href="/wallet/deposit"
                      >
                        <span className="material-symbols-outlined mr-2">add_card</span>
                        <span>Add Credits to Your Wallet</span>
                      </Link>
                    </div>
                  )}
                  {isBalanceSufficient && (
                    <div className="flex flex-col gap-4">
                      <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold tracking-wide hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined">lock</span>
                        <span>Proceed to Secure Payment</span>
                      </button>
                      <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-green-400">verified_user</span>
                        Blockchain Secured Transactions
                      </p>
                    </div>
                  )}
                  {!isBalanceSufficient && version === '5' && (
                    <button
                      disabled
                      className="flex w-full cursor-not-allowed items-center justify-center overflow-hidden rounded-lg h-12 bg-gray-500 text-gray-300 gap-2 text-base font-bold tracking-wide transition-all"
                    >
                      <span className="material-symbols-outlined">lock</span>
                      <span>Proceed to Credit Payment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Default Layout (Version 1, 2, 4, 5)
  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark">
      <CartHeader />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumbs & Heading */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href="/"
                className="text-gray-400 hover:text-primary text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-500 text-sm">/</span>
              <Link
                href="/"
                className="text-gray-400 hover:text-primary text-sm font-medium transition-colors"
              >
                Store
              </Link>
              <span className="text-gray-500 text-sm">/</span>
              <span className="text-white text-sm font-medium">Your Cart</span>
            </div>
            <div className="flex flex-wrap justify-between gap-4 items-baseline">
              <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tighter">
                Your Shopping Cart
              </h1>
              <Link
                href="/"
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Wallet Balance */}
          <WalletBalance balance={walletBalance} currency={currency} />

          {/* Cart Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-gray-200/20 bg-gray-200/20">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    product={{
                      id: item.product.id,
                      title: item.product.title,
                      slug: item.product.slug,
                      image: item.product.image || null,
                    }}
                    variant={{
                      id: item.variant.id,
                      name: item.variant.name,
                      price: parseFloat(item.variant.price.toString()),
                      currency: item.variant.currency,
                    }}
                    quantity={item.quantity}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                    platform={item.variant.name.includes('Steam') ? 'Steam' : item.variant.name.includes('Fortnite') ? 'Fortnite' : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal}
                discount={discount}
                taxes={taxes}
                total={total}
                currency={currency}
                walletBalance={walletBalance}
                onCheckout={handleCheckout}
                isLoading={isCheckingOut}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
