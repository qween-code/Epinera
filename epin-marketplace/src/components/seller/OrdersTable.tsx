'use client';

import { useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  order_id: string;
  buyer_name?: string;
  buyer_id?: string;
  product_title: string;
  variant_name: string;
  quantity: number;
  total_price: number;
  currency: string;
  delivery_status: string;
  created_at: string;
  is_vip?: boolean;
}

interface OrdersTableProps {
  orders: OrderItem[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onOrderClick: (orderId: string) => void;
}

export default function OrdersTable({
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onOrderClick,
}: OrdersTableProps) {
  const allSelected = orders.length > 0 && selectedOrders.length === orders.length;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'New', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      processing: { label: 'Processing', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' },
      completed: { label: 'Delivered', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      disputed: { label: 'Disputed', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };

    return (
      <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatOrderId = (id: string) => {
    return `#${id.substring(0, 6).toUpperCase()}`;
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-[#1A2831] rounded border border-gray-200 dark:border-[#2D3748]">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 dark:text-[#A0AEC0] uppercase bg-gray-50 dark:bg-[#101d23]/50">
          <tr>
            <th className="p-4" scope="col">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="form-checkbox rounded border-gray-200 dark:border-[#2D3748] bg-transparent dark:checked:bg-primary dark:focus:ring-offset-background-dark"
              />
            </th>
            <th className="px-6 py-3" scope="col">Order ID</th>
            <th className="px-6 py-3" scope="col">Buyer</th>
            <th className="px-6 py-3" scope="col">Date</th>
            <th className="px-6 py-3" scope="col">Product</th>
            <th className="px-6 py-3" scope="col">Total</th>
            <th className="px-6 py-3" scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isSelected = selectedOrders.includes(order.id);
            const isRowSelected = isSelected || selectedOrders.includes(order.order_id);

            return (
              <tr
                key={order.id}
                onClick={() => onOrderClick(order.order_id)}
                className={`border-b border-gray-200 dark:border-[#2D3748] hover:bg-primary/5 cursor-pointer ${
                  isRowSelected ? 'bg-primary/10' : ''
                }`}
              >
                <td className="w-4 p-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectOrder(order.id)}
                    className="form-checkbox rounded border-gray-200 dark:border-[#2D3748] bg-transparent dark:checked:bg-primary dark:focus:ring-offset-background-dark"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-[#EDF2F7] whitespace-nowrap">
                  {formatOrderId(order.order_id)}
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  {order.is_vip && (
                    <span className="material-symbols-outlined text-[#D69E2E] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  )}
                  {order.buyer_name || 'Unknown Buyer'}
                </td>
                <td className="px-6 py-4">{formatDate(order.created_at)}</td>
                <td className="px-6 py-4">{order.product_title} - {order.variant_name}</td>
                <td className="px-6 py-4">
                  {parseFloat(order.total_price.toString()).toFixed(2)} {order.currency}
                </td>
                <td className="px-6 py-4">{getStatusBadge(order.delivery_status)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

