'use client';

import { CartItem } from '@/lib/cart/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
}

export default function OrderSummary({ items, subtotal, taxes, total, currency }: OrderSummaryProps) {
  const displayCurrency = currency === 'USD' ? 'Credits' : currency;

  return (
    <div className="sticky top-28">
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
          Order Summary
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-12 shrink-0"
                data-alt={`${item.product.title} Product Image`}
                style={{
                  backgroundImage: item.product.image
                    ? `url("${item.product.image}")`
                    : 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80")',
                }}
              />
              <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal flex-1 truncate">
                {item.product.title} - {item.variant.name}
              </p>
              <div className="shrink-0">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                  {(item.variant.price * item.quantity).toLocaleString()} {displayCurrency}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4">
          <div className="flex justify-between gap-x-6 py-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Subtotal</p>
            <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal text-right">
              {subtotal.toLocaleString()} {displayCurrency}
            </p>
          </div>
          <div className="flex justify-between gap-x-6 py-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Taxes & Fees</p>
            <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal text-right">
              {taxes.toLocaleString()} {displayCurrency}
            </p>
          </div>
          <div className="flex justify-between gap-x-6 py-3 border-t border-slate-200 dark:border-slate-700 mt-2">
            <p className="text-slate-600 dark:text-slate-300 text-base font-bold leading-normal">Total</p>
            <p className="text-slate-900 dark:text-white text-base font-bold leading-normal text-right">
              {total.toLocaleString()} {displayCurrency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

