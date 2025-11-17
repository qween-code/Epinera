'use client';

import { NextPage } from 'next';
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  LogOutIcon,
  WalletIcon,
  SettingsIcon,
  HelpCircleIcon,
  Trash2Icon,
} from 'lucide-react';
import type { Metadata } from 'next';
import useCartStore from '@/store/cart';
import { useEffect } from 'react';

const ShoppingCartPage: NextPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = totalPrice();
  const taxes = subtotal * 0.08; // Example tax rate
  const total = subtotal + taxes;

  return (
      <div className="bg-background-dark text-white min-h-screen flex font-display">
        <aside className="w-64 bg-gray-900 p-4 flex flex-col">
          {/* ... (aside content remains the same) ... */}
        </aside>
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-8">
            <h1 data-testid="page-title" className="text-4xl font-bold tracking-tighter">
              Your Shopping Cart
            </h1>
            <a href="#" className="text-primary hover:underline">
              Continue Shopping
            </a>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            <div className="lg:col-span-2 flex flex-col gap-px overflow-hidden rounded-lg border border-gray-200/20 bg-gray-200/20">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-background-dark p-4 sm:p-6 justify-between items-start sm:items-center">
                    <div className="flex items-start gap-4 w-full">
                      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20 shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                      <div className="flex flex-1 flex-col justify-center gap-1">
                        <p className="text-white text-lg font-semibold leading-tight">{item.name}</p>
                        <p className="text-gray-400 text-sm font-normal">Unit Price: {item.price} Credits</p>
                        <p className="text-gray-400 text-sm font-normal">Platform: {item.platform}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <div className="shrink-0">
                        <div className="flex items-center gap-2 text-white bg-gray-200/10 rounded-full px-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-xl font-medium flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200/20 transition-colors cursor-pointer">-</button>
                          <input className="text-base font-medium w-8 p-0 text-center bg-transparent focus:outline-none border-none [appearance:textfield] [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none" type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} />
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-xl font-medium flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200/20 transition-colors cursor-pointer">+</button>
                        </div>
                      </div>
                      <p className="text-white text-lg font-semibold w-24 text-right">{(item.price * item.quantity).toFixed(2)} Cr</p>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2Icon />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-background-dark p-6 text-center text-gray-400">
                  Your cart is empty.
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 flex flex-col gap-6 rounded-xl border border-gray-200/20 bg-background-dark p-6">
                <h2 className="text-white text-2xl font-bold">Order Summary</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{subtotal.toFixed(2)} Credits</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Taxes (if applicable)</span>
                    <span className="text-white font-medium">{taxes.toFixed(2)} Credits</span>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-200/20"></div>
                <div className="flex justify-between items-center">
                  <span className="text-white text-xl font-bold">
                    Total Cost
                  </span>
                  <span className="text-white text-2xl font-bold">
                    {total.toFixed(2)} Credits
                  </span>
                </div>
                {/* ... (discount code and payment button) ... */}
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default ShoppingCartPage;
