'use client';

import { CartProvider } from '@/lib/cart/CartContext';
import { WishlistProvider } from '@/lib/wishlist/WishlistContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}
