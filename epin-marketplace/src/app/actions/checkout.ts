'use server';

import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function processCheckout(discountCode?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product_variants!inner (
          id,
          name,
          price,
          currency,
          stock_quantity,
          products!inner (
            id,
            title,
            slug,
            seller_id
          )
        )
      `)
      .eq('user_id', user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    // Calculate totals
    let subtotal = 0;
    const currency = cartItems[0].product_variants.currency;
    
    for (const item of cartItems) {
      const price = parseFloat(item.product_variants.price.toString());
      subtotal += price * item.quantity;

      // Check stock
      if (item.product_variants.stock_quantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${item.product_variants.products.title}`,
        };
      }
    }

    // Apply discount if provided
    let discount = 0;
    if (discountCode) {
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('discount_percentage, discount_amount')
        .eq('code', discountCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (campaign) {
        if (campaign.discount_percentage) {
          discount = subtotal * (campaign.discount_percentage / 100);
        } else if (campaign.discount_amount) {
          discount = parseFloat(campaign.discount_amount.toString());
        }
      }
    }

    const taxes = subtotal * 0.08; // 8% tax
    const total = subtotal - discount + taxes;

    // Check wallet balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('id, balance')
      .eq('user_id', user.id)
      .eq('currency', currency)
      .single();

    if (!wallet || parseFloat(wallet.balance.toString()) < total) {
      return {
        success: false,
        error: 'Insufficient wallet balance',
        required: total,
        available: wallet ? parseFloat(wallet.balance.toString()) : 0,
      };
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        subtotal: subtotal,
        total_amount: total,
        currency,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'wallet', // Using wallet credits
        discount_amount: discount,
        tax_amount: taxes,
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return { success: false, error: 'Failed to create order' };
    }

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      variant_id: item.product_variants.id,
      product_id: item.product_variants.products.id,
      seller_id: item.product_variants.products.seller_id,
      quantity: item.quantity,
      unit_price: parseFloat(item.product_variants.price.toString()),
      total_price: parseFloat(item.product_variants.price.toString()) * item.quantity,
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError);
      return { success: false, error: 'Failed to create order items' };
    }

    // Deduct from wallet
    const { error: walletError } = await supabase
      .from('wallets')
      .update({
        balance: parseFloat(wallet.balance.toString()) - total,
      })
      .eq('user_id', user.id)
      .eq('currency', currency);

    if (walletError) {
      console.error('Error deducting from wallet:', walletError);
      return { success: false, error: 'Failed to process payment' };
    }

    // Create wallet transaction
    await supabase.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      user_id: user.id,
      transaction_type: 'payment',
      amount: -total,
      currency,
      status: 'completed',
      description: `Order #${order.id}`,
    });

    // Clear cart
    const { error: clearError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (clearError) {
      console.error('Error clearing cart:', clearError);
    }

    // Update product stock
    for (const item of cartItems) {
      await supabase
        .from('product_variants')
        .update({
          stock_quantity: item.product_variants.stock_quantity - item.quantity,
        })
        .eq('id', item.product_variants.id);
    }

    // Create notification for buyer
    try {
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'order',
        title: `Order #${order.id.substring(0, 8)} Confirmed`,
        message: `Your order has been confirmed and is being processed. Total: ${total.toFixed(2)} ${currency}`,
        link: `/orders/${order.id}`,
        metadata: { order_id: order.id },
      });
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Don't fail the checkout if notification fails
    }

    // Create notifications for sellers
    const sellerIds = [...new Set(orderItems.map((item) => item.seller_id))];
    for (const sellerId of sellerIds) {
      try {
        await supabase.from('notifications').insert({
          user_id: sellerId,
          type: 'order',
          title: 'New Order Received',
          message: `You have received a new order #${order.id.substring(0, 8)}`,
          link: `/seller/orders/${order.id}`,
          metadata: { order_id: order.id },
        });
      } catch (notifError) {
        console.error('Error creating seller notification:', notifError);
      }
    }

    revalidatePath('/cart');
    revalidatePath('/orders');
    revalidatePath('/wallet');

    return {
      success: true,
      orderId: order.id,
      total,
      currency,
    };
  } catch (error: any) {
    console.error('Error processing checkout:', error);
    return { success: false, error: error.message };
  }
}

