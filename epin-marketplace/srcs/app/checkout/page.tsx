'use client';

import { useEffect, useState } from 'react';
import useCartStore from '@/store/cart';
import useWalletStore from '@/store/wallet';
import { createOrder } from '@/app/actions/checkout';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, fetchCart } = useCartStore();
  const { wallet, fetchWallet } = useWalletStore();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
    fetchWallet();
  }, [fetchCart, fetchWallet]);

  const subtotal = cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const taxes = subtotal * 0.1; // Example tax rate
  const total = subtotal + taxes;
  const sufficientFunds = wallet && wallet.balance >= total;

  const handleConfirmPurchase = async () => {
    setError(null);
    if (!sufficientFunds) {
      setError('Insufficient credits. Please add funds to your wallet.');
      return;
    }
    if (!cart) {
      setError('Your cart is empty.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createOrder();
      if (result.success && result.orderId) {
        // Redirect to a success page
        router.push(`/order-confirmation/${result.orderId}`);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create order.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || !wallet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Confirm Your Purchase</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <div className="bg-gray-800 p-6 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Site Credits</h3>
                <p className="text-sm text-gray-400">Using your available balance</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Available</p>
                <p className="text-xl font-bold">{wallet.balance.toFixed(2)} {wallet.currency}</p>
              </div>
            </div>
          </div>

          {!sufficientFunds && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
              <h3 className="font-bold">Insufficient Credits</h3>
              <p>You do not have enough credits for this purchase. Please add more credits to your wallet to proceed.</p>
            </div>
          )}

          {error && (
             <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
             </div>
          )}

        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-lg sticky top-28">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} {cart.currency}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} {cart.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>{taxes.toFixed(2)} {cart.currency}</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-4">
                <span>Total</span>
                <span className="text-sky-400">{total.toFixed(2)} {cart.currency}</span>
              </div>
            </div>
            <button
              onClick={handleConfirmPurchase}
              disabled={!sufficientFunds || isProcessing}
              className="w-full mt-6 py-3 bg-sky-600 rounded-md text-lg font-semibold hover:bg-sky-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : `Pay ${total.toFixed(2)} ${cart.currency}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
