'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const supabase = createClient();
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          currency,
          status,
          order_items (
            quantity,
            price,
            product_variants (
              name
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error || !data) {
        notFound();
      }

      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-green-900/50 border border-green-700 text-green-300 p-6 rounded-lg mb-8">
        <h1 className="text-4xl font-bold">Thank You For Your Order!</h1>
        <p className="mt-2">Your purchase has been successfully completed.</p>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg text-left">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <div className="space-y-4">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="font-semibold mb-2">Items Purchased:</h3>
                <ul className="space-y-2">
                    {order.order_items.map((item: any, index: number) => (
                        <li key={index} className="flex justify-between">
                            <span>{item.product_variants.name} x {item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(2)} {order.currency}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t border-gray-700 pt-4 mt-4 text-xl font-bold flex justify-between">
                <h3>Total Paid</h3>
                <span>{order.total_amount.toFixed(2)} {order.currency}</span>
            </div>
        </div>
        <div className="mt-8 text-center">
            <p className="text-gray-400">Your digital codes have been sent to your registered email address.</p>
            <Link href="/" className="inline-block mt-6 px-8 py-3 bg-sky-600 rounded-md font-semibold hover:bg-sky-700">
                Continue Shopping
            </Link>
        </div>
      </div>
    </div>
  );
}
