'use client';

import { getProductImage } from '@/lib/constants/images';

interface OrderItem {
  id: string;
  quantity: number;
  product_variants: {
    name: string;
    price: number;
    currency: string;
  };
  products: {
    title: string;
    slug: string;
    image_url?: string | null;
  };
}

interface OrderSummaryCardProps {
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
}

export default function OrderSummaryCard({ items, subtotal, taxes, total, currency }: OrderSummaryCardProps) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
      <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Order Summary</h2>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0"
              data-alt={`${item.products.title} thumbnail`}
              style={{
                backgroundImage: item.products.image_url
                  ? `url("${item.products.image_url}")`
                  : `url("${getProductImage(item.products.slug)}")`,
              }}
            />
            <div className="flex-grow">
              <p className="text-white font-semibold">{item.products.title} - {item.product_variants.name}</p>
              <p className="text-white/60 text-sm">Quantity: {item.quantity}</p>
            </div>
            <p className="text-white font-semibold">
              {(parseFloat(item.product_variants.price.toString()) * item.quantity).toLocaleString()} {currency}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 mt-6 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <p className="text-white/70">Subtotal</p>
          <p className="text-white">{subtotal.toLocaleString()} {currency}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="text-white/70">Taxes & Fees</p>
          <p className="text-white">{taxes.toLocaleString()} {currency}</p>
        </div>
        <div className="flex justify-between text-base font-bold">
          <p className="text-white">Total Paid</p>
          <p className="text-primary">{total.toLocaleString()} {currency}</p>
        </div>
      </div>
    </div>
  );
}

