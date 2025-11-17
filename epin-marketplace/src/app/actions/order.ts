'use server';

import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product_variants (
            name,
            price,
            currency
          ),
          products (
            title,
            slug,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .eq('buyer_id', user.id)
      .single();

    if (error || !order) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, order };
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return { success: false, error: error.message };
  }
}

export async function getOrderDeliveryStatus(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('status, payment_status, order_items(delivery_status, digital_content_delivered)')
      .eq('id', orderId)
      .eq('buyer_id', user.id)
      .single();

    if (error || !order) {
      return { success: false, error: 'Order not found' };
    }

    // Determine delivery status
    let deliveryStatus: 'placed' | 'verified' | 'securing' | 'delivered' = 'placed';
    let code: string | null = null;

    if (order.payment_status === 'paid') {
      deliveryStatus = 'verified';
    }

    const orderItems = order.order_items as any[];
    if (orderItems && orderItems.length > 0) {
      const firstItem = orderItems[0];
      if (firstItem.delivery_status === 'completed' && firstItem.digital_content_delivered) {
        deliveryStatus = 'delivered';
        code = firstItem.digital_content_delivered.code || null;
      } else if (firstItem.delivery_status === 'processing') {
        deliveryStatus = 'securing';
      }
    }

    return { success: true, status: deliveryStatus, code };
  } catch (error: any) {
    console.error('Error fetching delivery status:', error);
    return { success: false, error: error.message };
  }
}

