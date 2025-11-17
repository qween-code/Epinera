'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface CartItem {
  id: string;
  variant_id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
  };
  variant: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getTotal: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const refreshCart = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setItems([]);
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          variant_id,
          quantity,
          product_variants!inner (
            id,
            name,
            price,
            currency,
            products!inner (
              id,
              title,
              slug
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        product: {
          id: item.product_variants.products.id,
          title: item.product_variants.products.title,
          slug: item.product_variants.products.slug,
        },
        variant: {
          id: item.product_variants.id,
          name: item.product_variants.name,
          price: parseFloat(item.product_variants.price),
          currency: item.product_variants.currency,
        },
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Sepete eklemek için giriş yapmalısınız');
      }

      // Check if item already exists in cart
      const existingItem = items.find(item => item.variant_id === variantId);

      if (existingItem) {
        // Update quantity
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            variant_id: variantId,
            quantity,
          });

        if (error) throw error;
        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await refreshCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      await refreshCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotal,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
