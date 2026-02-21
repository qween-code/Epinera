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
      if (result.error) alert(result.error);
    } catch { alert('Bir hata olustu'); }
    finally { setLoading(false); }
  };

  const handleDelivered = async () => {
    setLoading(true);
    try {
      const result = await markAsDelivered(orderItemId);
      if (result.error) alert(result.error);
    } catch { alert('Bir hata olustu'); }
    finally { setLoading(false); }
  };

  if (currentStatus === 'pending') {
    return (
      <div className="flex gap-2">
        <button onClick={handleProcessing} disabled={loading} className="btn btn-sm btn-primary">
          {loading ? 'Isleniyor...' : 'Teslimat Baslat'}
        </button>
        <button onClick={handleDelivered} disabled={loading} className="btn btn-sm btn-success">
          {loading ? 'Isleniyor...' : 'Teslim Edildi'}
        </button>
      </div>
    );
  }

  if (currentStatus === 'processing') {
    return (
      <button onClick={handleDelivered} disabled={loading} className="btn btn-sm btn-success">
        {loading ? 'Isleniyor...' : 'Teslim Edildi'}
      </button>
    );
  }

  return null;
}
