'use client';

import { useState } from 'react';
import Link from 'next/link';

interface OrderDetails {
  id: string;
  buyer_name: string;
  buyer_id: string;
  product_title: string;
  variant_name: string;
  quantity: number;
  total_price: number;
  currency: string;
  delivery_status: string;
  created_at: string;
  is_vip?: boolean;
  delivery_info?: any;
}

interface OrderDetailsSidebarProps {
  order: OrderDetails | null;
  onClose: () => void;
  onFulfill?: () => void;
  onSendMessage?: () => void;
  onInitiateDispute?: () => void;
}

export default function OrderDetailsSidebar({
  order,
  onClose,
  onFulfill,
  onSendMessage,
  onInitiateDispute,
}: OrderDetailsSidebarProps) {
  const [notes, setNotes] = useState('');

  if (!order) return null;

  return (
    <aside className="w-[420px] h-screen sticky top-0 flex-shrink-0 bg-white dark:bg-[#1A2831] border-l border-gray-200 dark:border-[#2D3748] p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-[#EDF2F7]">Order #{order.id.substring(0, 6).toUpperCase()}</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 dark:text-[#A0AEC0] hover:bg-primary/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-800 dark:text-[#EDF2F7]">Buyer Details</h3>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full bg-center bg-cover"
            data-alt={`Avatar of ${order.buyer_name}`}
            style={{ backgroundImage: `url("https://api.dicebear.com/7.x/avataaars/svg?seed=${order.buyer_id}")` }}
          />
          <div>
            <p className="font-semibold text-gray-800 dark:text-[#EDF2F7]">{order.buyer_name}</p>
            <Link className="text-sm text-primary hover:underline" href={`/seller/orders?buyer=${order.buyer_id}`}>
              View order history
            </Link>
          </div>
          {order.is_vip && (
            <span className="material-symbols-outlined text-[#D69E2E] text-2xl ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-800 dark:text-[#EDF2F7]">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-[#A0AEC0]">
              {order.product_title} - {order.variant_name} (x{order.quantity})
            </span>
            <span className="text-gray-800 dark:text-[#EDF2F7]">
              {parseFloat(order.total_price.toString()).toFixed(2)} {order.currency}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-[#2D3748]">
            <span className="font-bold text-gray-800 dark:text-[#EDF2F7]">Total</span>
            <span className="font-bold text-gray-800 dark:text-[#EDF2F7]">
              {parseFloat(order.total_price.toString()).toFixed(2)} {order.currency}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-800 dark:text-[#EDF2F7]">Action History</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
              <span className="material-symbols-outlined text-white text-sm">receipt_long</span>
            </div>
            <div>
              <p className="text-gray-800 dark:text-[#EDF2F7]">Order placed by buyer</p>
              <p className="text-xs text-gray-500 dark:text-[#A0AEC0]">
                {new Date(order.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-bold text-gray-800 dark:text-[#EDF2F7]">Private Notes</h3>
        <textarea
          className="form-textarea w-full rounded border-gray-200 dark:border-[#2D3748] bg-gray-50 dark:bg-[#101d23] text-gray-800 dark:text-[#EDF2F7] placeholder:text-gray-500 dark:placeholder:text-[#A0AEC0] focus:ring-primary focus:border-primary"
          placeholder="Add a note for your reference..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={onFulfill}
          className="w-full flex items-center justify-center h-10 px-4 rounded bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          Fulfill Order
        </button>
        <button
          onClick={onSendMessage}
          className="w-full flex items-center justify-center h-10 px-4 rounded bg-white dark:bg-[#1A2831] text-gray-800 dark:text-[#EDF2F7] border border-gray-200 dark:border-[#2D3748] text-sm font-bold hover:bg-primary/10 transition-colors"
        >
          Send Message
        </button>
        <button
          onClick={onInitiateDispute}
          className="w-full flex items-center justify-center h-10 px-4 rounded text-red-500 text-sm font-bold hover:bg-red-500/10 transition-colors"
        >
          Initiate Dispute
        </button>
      </div>
    </aside>
  );
}

