'use client';

import useCartStore from '@/store/cart';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, fetchCart, updateItemQuantity, removeItem } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity > 0) {
      updateItemQuantity(itemId, quantity);
    }
  };

  const subtotal = cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const taxes = subtotal * 0.1; // Example tax rate
  const total = subtotal + taxes;

  if (!cart) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Loading your cart...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/" className="px-8 py-3 bg-sky-600 rounded-md font-semibold hover:bg-sky-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-700 rounded-md flex-shrink-0">
                    {/* Placeholder for an image */}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-400">Unit Price: {item.price.toFixed(2)} {cart.currency}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-400 text-sm font-semibold mt-1">
                      Remove
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="w-20 bg-gray-900 border border-gray-700 rounded-md p-2 text-center"
                    min="1"
                  />
                  <p className="w-24 text-right font-semibold text-lg">
                    {(item.price * item.quantity).toFixed(2)} {cart.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg h-fit sticky top-28">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{subtotal.toFixed(2)} {cart.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span className="font-semibold text-white">{taxes.toFixed(2)} {cart.currency}</span>
            </div>
            <div className="border-t border-gray-700 my-4"></div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-sky-400">{total.toFixed(2)} {cart.currency}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full mt-6 py-3 bg-sky-600 rounded-md text-lg font-semibold hover:bg-sky-700 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
