import { createClient } from '@/lib/supabase'

export async function getCart() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: cart, error } = await supabase
    .from('carts')
    .select('*, cart_items(*)')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching cart:', error)
    return null
  }

  return cart
}

export async function addToCart(productId: string, quantity: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!cart) {
    const { data: newCart, error } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating cart:', error)
      return null
    }
    cart = newCart
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ cart_id: cart.id, product_id: productId, quantity })

  if (error) {
    console.error('Error adding to cart:', error)
    return null
  }

  return data
}

export async function checkout() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('*, cart_items(*)')
    .eq('user_id', user.id)
    .single()

  if (cartError || !cart || !cart.cart_items) {
    console.error('Error fetching cart for checkout:', cartError)
    return null
  }

  // In a real application, you would create an order and order items here.
  // For now, we'll just clear the cart.
  const { error: deleteError } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id)

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
