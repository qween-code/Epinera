'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCart() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: cart, error } = await supabase
    .from('carts')
    .select(`
      id,
      user_id,
      created_at,
      cart_items (
        id,
        quantity,
        product_variants (
          id,
          name,
          price,
          currency,
          products (
            title,
            description
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching cart:', error);
    return null;
  }

  return cart;
}

export async function addToCart(variantId: string, quantity: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    // Get or create a cart for the user
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (cartError && cartError.code !== 'PGRST116') { // PGRST116: row not found
      throw cartError;
    }

    if (!cart) {
      const { data: newCart, error: newCartError } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select('id')
        .single();
      if (newCartError) throw newCartError;
      cart = newCart;
    }

    if (!cart) {
        throw new Error("Could not retrieve or create a cart.");
    }


    // Check if the item is already in the cart
    const { data: existingItem, error: existingItemError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart.id)
        .eq('product_variant_id', variantId)
        .single();

    if (existingItemError && existingItemError.code !== 'PGRST116') {
        throw existingItemError;
    }

    if (existingItem) {
        // Update quantity if item exists
        const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);
        if (updateError) throw updateError;
    } else {
        // Insert new item if it doesn't exist
        const { error: insertError } = await supabase
            .from('cart_items')
            .insert({ cart_id: cart.id, product_variant_id: variantId, quantity });
        if (insertError) throw insertError;
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/cart');
}

export async function removeFromCart(itemId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error removing from cart:', error);
  }

  revalidatePath('/cart');
}

export async function updateCartItem(itemId: string, quantity: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId);

  if (error) {
    console.error('Error updating cart item:', error);
  }

  revalidatePath('/cart');
}

export async function checkout() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select(`
      id,
      user_id,
      created_at,
      cart_items (
        id,
        quantity,
        product_variants (
          id,
          name,
          price,
          currency,
          products (
            title,
            description
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (cartError || !cart || !cart.cart_items) {
    console.error('Error fetching cart for checkout:', cartError);
    return;
  }

  const total = cart.cart_items.reduce((acc: number, item: any) => acc + (item.product_variants.price * item.quantity), 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: user.id, total_amount: total, currency: cart.cart_items[0].product_variants.currency, status: 'pending' })
    .select('id')
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return;
  }

  const orderItems = cart.cart_items.map((item: any) => ({
    order_id: order.id,
    product_variant_id: item.product_variants.id,
    quantity: item.quantity,
    price: item.product_variants.price,
  }));

  const { error: orderItemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (orderItemsError) {
    console.error('Error creating order items:', orderItemsError);
    return;
  }

  const { error: deleteError } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id);

  if (deleteError) {
    console.error('Error clearing cart:', deleteError);
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
}
