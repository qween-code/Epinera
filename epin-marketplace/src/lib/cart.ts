import { createClient } from '@/lib/supabase'

export async function getCart() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product_variants (
        *,
        products (*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cart:', error)
    return null
  }

  return {
    id: user.id,
    user_id: user.id,
    cart_items: cartItems || [],
  }
}

export async function addToCart(variantId: string, quantity: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Check if item already exists
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('variant_id', variantId)
    .single()

  if (existingItem) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()

    if (error) {
      console.error('Error updating cart:', error)
      return null
    }
    return data
  } else {
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, variant_id: variantId, quantity })
      .select()

    if (error) {
      console.error('Error adding to cart:', error)
      return null
    }
    return data
  }
}

export async function checkout() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)

  if (cartError || !cartItems || cartItems.length === 0) {
    console.error('Error fetching cart for checkout:', cartError)
    return null
  }

  // In a real application, you would create an order and order items here.
  // For now, we'll just clear the cart.
  const { error: deleteError } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  if (deleteError) {
    console.error('Error clearing cart:', deleteError)
    return null
  }

  return { success: true }
}

export async function removeFromCart(itemId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    console.error('Error removing from cart:', error)
    return null
  }

  return data
}

export async function updateCartItem(itemId: string, quantity: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)

  if (error) {
    console.error('Error updating cart item:', error)
    return null
  }

  return data
}
