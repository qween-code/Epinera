'use client';

import { NextPage } from 'next';
import {
  CreditCardIcon,
  AlertTriangleIcon,
  PlusCircleIcon
} from 'lucide-react';
import type { Metadata } from 'next';
import useCartStore from '@/store/cart';
import { useEffect } from 'react';

const CheckoutPage: NextPage = () => {
  const { items, totalPrice, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = totalPrice();
  const taxes = subtotal * 0.08; // Example tax rate
  const total = subtotal + taxes;
  const userCredits = 5000; // Placeholder
  const hasSufficientCredits = userCredits >= total;

  return (
      <div className="bg-background-dark text-white min-h-screen font-display">
        {/* ... (header remains the same) ... */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-wrap justify-between gap-4 mb-8">
            <p data-testid="page-title" className="text-white text-4xl font-black tracking-tighter">
              Confirm Your Purchase
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Order Summary (Right Column on Desktop) */}
            <div className="lg:col-span-1 lg:order-last">
              <div className="sticky top-28">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-white text-[22px] font-bold pb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 py-2">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-12"
                          style={{ backgroundImage: `url(${item.image})` }}
                        ></div>
                        <p className="text-slate-200 text-base font-medium flex-1 truncate">
                          {item.name}
                        </p>
                        <div className="shrink-0">
                          <p className="text-white text-base font-medium">
                            {(item.price * item.quantity).toFixed(2)} Credits
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-700 mt-4 pt-4">
                    <div className="flex justify-between gap-x-6 py-2">
                      <p className="text-slate-400 text-sm">Subtotal</p>
                      <p className="text-slate-200 text-sm font-medium text-right">
                        {subtotal.toFixed(2)} Credits
                      </p>
                    </div>
                    <div className="flex justify-between gap-x-6 py-2">
                      <p className="text-slate-400 text-sm">Taxes & Fees</p>
                      <p className="text-slate-200 text-sm font-medium text-right">
                        {taxes.toFixed(2)} Credits
                      </p>
                    </div>
                    <div className="flex justify-between gap-x-6 py-3 border-t border-slate-700 mt-2">
                      <p className="text-slate-300 text-base font-bold">Total</p>
                      <p className="text-white text-base font-bold text-right">
                        {total.toFixed(2)} Credits
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method (Left Column on Desktop) */}
            <div className="lg:col-span-2">
              {/* ... (payment method and conditional rendering) ... */}
            </div>
          </div>
        </main>
      </div>
  );
};

export default CheckoutPage;
