'use client';

import { useCart } from '@/lib/cart/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  variantId: string;
  variantName: string;
  stockQuantity: number;
}

export default function AddToCartButton({
  variantId,
  variantName,
  stockQuantity
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (stockQuantity <= 0) {
      alert('Bu urun su anda stokta yok');
      return;
    }

    setAdding(true);
    try {
      await addToCart(variantId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error: any) {
      if (error.message?.includes('giris yap')) {
        if (confirm('Sepete eklemek icin giris yapmalisiniz. Giris sayfasina gitmek ister misiniz?')) {
          router.push('/login');
        }
      } else {
        alert('Sepete eklenirken bir hata olustu');
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={adding || stockQuantity <= 0}
      className={`btn btn-sm ${
        added
          ? 'btn-success'
          : stockQuantity <= 0
          ? 'btn-ghost opacity-50'
          : 'btn-primary'
      }`}
    >
      {adding ? (
        <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Ekleniyor...</>
      ) : added ? (
        'Sepete Eklendi'
      ) : stockQuantity <= 0 ? (
        'Stokta Yok'
      ) : (
        'Sepete Ekle'
      )}
    </button>
  );
}
