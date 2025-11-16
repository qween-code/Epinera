'use client';

import { useCart } from '@/lib/cart/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { items, loading, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = async (itemId: string) => {
    setRemoving(itemId);
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Sepet yükleniyor...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold">Sepetiniz Boş</h1>
        <p className="text-gray-400">Alışverişe başlamak için ürünlere göz atın</p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sepetim</h1>
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Sepeti Temizle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 rounded-lg p-6 flex gap-6 items-center"
              >
                <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🎮</span>
                </div>

                <div className="flex-1">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="text-xl font-semibold hover:text-blue-400 transition-colors"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-gray-400 mt-1">{item.variant.name}</p>
                  <p className="text-2xl font-bold mt-2">
                    {item.variant.price.toFixed(2)} {item.variant.currency}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removing === item.id}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Sipariş Özeti</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Ara Toplam</span>
                  <span>{total.toFixed(2)} TRY</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>KDV (%20)</span>
                  <span>{(total * 0.2).toFixed(2)} TRY</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Toplam</span>
                    <span>{(total * 1.2).toFixed(2)} TRY</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center px-6 py-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg transition-colors"
              >
                Ödemeye Geç
              </Link>

              <Link
                href="/"
                className="w-full block text-center mt-4 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
