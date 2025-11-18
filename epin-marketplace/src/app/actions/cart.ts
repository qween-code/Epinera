'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCart() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      variant_id,
      product_variants (
        id,
        name,
        price,
        currency,
        products (
          id,
          title,
          description,
          slug,
          image_url
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cart:', error);
    return null;
  }

  return {
    id: user.id, // Use user_id as cart identifier
    user_id: user.id,
    created_at: cartItems?.[0]?.created_at || new Date().toISOString(),
    cart_items: cartItems || [],
  };
}

export async function addToCart(variantId: string, quantity: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    // Check if the item is already in the cart
    const { data: existingItem, error: existingItemError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('variant_id', variantId)
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
        .insert({ 
          user_id: user.id, 
          variant_id: variantId, 
          quantity 
        });
      if (insertError) throw insertError;
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message };
  }
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

  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      variant_id,
      product_variants (
        id,
        name,
        price,
        currency,
        products (
          id,
          title,
          description,
          seller_id
        )
      )
    `)
    .eq('user_id', user.id);

  if (cartError || !cartItems || cartItems.length === 0) {
    console.error('Error fetching cart for checkout:', cartError);
    return;
  }

  const currency = cartItems[0].product_variants.currency;
  const total = cartItems.reduce((acc: number, item: any) => {
    const price = parseFloat(item.product_variants.price.toString());
    return acc + (price * item.quantity);
  }, 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ 
      buyer_id: user.id, 
      total_amount: total, 
      currency, 
      status: 'pending',
      payment_status: 'pending'
    })
    .select('id')
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return;
  }

  const orderItems = cartItems.map((item: any) => ({
    order_id: order.id,
    variant_id: item.variant_id,
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
    return;
  }

  const { error: deleteError } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('Error clearing cart:', deleteError);
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
}
