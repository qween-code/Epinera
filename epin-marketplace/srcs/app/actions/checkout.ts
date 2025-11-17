'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

// NOTE: We need a `products` table that `product_variant_id` can reference.
// For now, this action assumes the cart items have necessary info.
// This is a simplified version and needs proper error handling and transaction management.

export async function createOrder() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    // 1. Fetch the user's current cart
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select(`
        *,
        cart_items (
          id,
          product_variant_id,
          quantity
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (cartError || !cart || cart.cart_items.length === 0) {
      return { success: false, error: 'Cart not found or is empty.' };
    }

    // This is a placeholder. In a real app, you'd fetch product details
    // to get the real price, rather than trusting the cart.
    // For now, we'll simulate fetching prices.
    const itemDetails = await Promise.all(cart.cart_items.map(async (item) => {
        const {data: variant, error} = await supabase
            .from('product_variants')
            .select('price, currency')
            .eq('id', item.product_variant_id)
            .single();

        if (error || !variant) {
            throw new Error(`Could not find price for variant ${item.product_variant_id}`);
        }

        return {
            ...item,
            price: variant.price,
            currency: variant.currency,
        };
    }));


    // 2. Calculate the total order value
    const total_amount = itemDetails.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const currency = itemDetails[0]?.currency || 'USD';


    // 3. Check user's wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (walletError || !wallet) {
      return { success: false, error: 'Wallet not found.' };
    }

    if (wallet.balance < total_amount) {
      return { success: false, error: 'Insufficient funds.' };
    }

    // 4. Create the order and order items
    const orderId = uuidv4();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: user.id,
        total_amount: total_amount,
        currency: currency,
        status: 'completed', // Assuming immediate processing
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return { success: false, error: 'Could not create order.' };
    }

    const orderItems = itemDetails.map(item => ({
      order_id: order.id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Order items creation error:', orderItemsError);
      // Here you should ideally roll back the order creation
      return { success: false, error: 'Could not add items to order.' };
    }

    // 5. Deduct from wallet and create transaction record
    const newBalance = wallet.balance - total_amount;
    const { error: walletUpdateError } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', user.id);

    if (walletUpdateError) {
      // Rollback logic needed
      return { success: false, error: 'Failed to update wallet balance.' };
    }

    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
          user_id: user.id,
          type: 'purchase',
          amount: -total_amount,
          currency: currency,
          description: `Purchase of order ${order.id}`
      });

    if (transactionError) {
        // Rollback logic needed
        return { success: false, error: 'Failed to record transaction.' };
    }


    // 6. Clear the user's cart
    const { error: deleteItemsError } = await supabase
        .from('cart_items')
        .delete()
        .in('id', cart.cart_items.map(i => i.id));

    if (deleteItemsError) {
        // This is not ideal, the order is placed but cart isn't cleared.
        // Needs robust transactional handling.
        console.error('Failed to clear cart items:', deleteItemsError);
    }

    // 7. Revalidate paths to update UI
    revalidatePath('/cart');
    revalidatePath('/wallet');
    revalidatePath('/checkout');


    return { success: true, orderId: order.id };

  } catch (err: any) {
    console.error('Checkout failed:', err);
    return { success: false, error: err.message };
  }
}
