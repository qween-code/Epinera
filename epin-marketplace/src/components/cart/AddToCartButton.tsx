'use client';

import { useCart } from '@/lib/cart/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  variantId: string;
  variantName: string;
  stockQuantity: number;
  className?: string;
}

export default function AddToCartButton({
  variantId,
  variantName,
  stockQuantity,
  className
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (stockQuantity <= 0) {
      alert('Bu ürün şu anda stokta yok');
      return;
    }

    setAdding(true);
    try {
      await addToCart(variantId, 1);
      setAdded(true);

      // Show success state for 2 seconds
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error: any) {
      if (error.message?.includes('giriş yap')) {
        // Redirect to login if not authenticated
        if (confirm('Sepete eklemek için giriş yapmalısınız. Giriş sayfasına gitmek ister misiniz?')) {
          router.push('/login');
        }
      } else {
        alert('Sepete eklenirken bir hata oluştu');
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={adding || stockQuantity <= 0}
      className={className || `mt-1 px-6 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        added
          ? 'bg-green-600 hover:bg-green-700'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {adding ? (
        'Ekleniyor...'
      ) : added ? (
        '✓ Sepete Eklendi'
      ) : stockQuantity <= 0 ? (
        'Stokta Yok'
      ) : (
        'Sepete Ekle'
      )}
    </button>
  );
}
