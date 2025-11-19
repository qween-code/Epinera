'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOrderItemStatus(
  orderItemId: string,
  newStatus: 'pending' | 'processing' | 'completed' | 'cancelled'
) {
  const supabase = await createClient();

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Giriş yapmalısınız' };
  }

  // Verify user is the seller of this order item
  const { data: orderItem, error: fetchError } = await supabase
    .from('order_items')
    .select('seller_id')
    .eq('id', orderItemId)
    .single();

  if (fetchError || !orderItem) {
    return { error: 'Sipariş bulunamadı' };
  }

  if (orderItem.seller_id !== user.id) {
    return { error: 'Bu siparişi güncelleme yetkiniz yok' };
  }

  // Update the order item status
  const { error: updateError } = await supabase
    .from('order_items')
    .update({
      delivery_status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderItemId);

  if (updateError) {
    return { error: 'Güncelleme sırasında hata oluştu' };
  }

  // Revalidate the page to show updated data
  revalidatePath('/seller/orders');

  return { success: true };
}

export async function markAsProcessing(orderItemId: string) {
  return updateOrderItemStatus(orderItemId, 'processing');
}

export async function markAsDelivered(orderItemId: string) {
  return updateOrderItemStatus(orderItemId, 'completed');
}
