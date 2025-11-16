'use client';

import { useState } from 'react';
import { markAsProcessing, markAsDelivered } from '@/app/seller/orders/actions';

interface OrderItemActionsProps {
  orderItemId: string;
  currentStatus: string;
}

export default function OrderItemActions({ orderItemId, currentStatus }: OrderItemActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleProcessing = async () => {
    setLoading(true);
    try {
      const result = await markAsProcessing(orderItemId);
      if (result.error) {
        alert(result.error);
      } else {
        // Page will automatically refresh due to revalidatePath
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelivered = async () => {
    setLoading(true);
    try {
      const result = await markAsDelivered(orderItemId);
      if (result.error) {
        alert(result.error);
      } else {
        // Page will automatically refresh due to revalidatePath
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 'pending') {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleProcessing}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'İşleniyor...' : 'Teslimat Başlat'}
        </button>
        <button
          onClick={handleDelivered}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'İşleniyor...' : 'Teslim Edildi İşaretle'}
        </button>
      </div>
    );
  }

  if (currentStatus === 'processing') {
    return (
      <button
        onClick={handleDelivered}
        disabled={loading}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? 'İşleniyor...' : 'Teslim Edildi İşaretle'}
      </button>
    );
  }

  return null;
}
