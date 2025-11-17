'use client';

import { useCart } from '@/lib/cart/CartContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
