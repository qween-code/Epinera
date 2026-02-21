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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[var(--text-tertiary)]">Sepet yukleniyor...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-6">
        <div className="w-20 h-20 rounded-2xl neo flex items-center justify-center">
          <svg className="w-10 h-10 text-[var(--text-ghost)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-heading text-[var(--text-primary)]">Sepetiniz Bos</h1>
        <p className="text-sm text-[var(--text-tertiary)]">Alisverise baslamak icin urunlere goz atin</p>
        <Link href="/" className="btn btn-primary">Alisverise Basla</Link>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-heading">
            <span className="text-gradient">Sepetim</span>
          </h1>
          <button onClick={clearCart} className="btn btn-sm btn-danger">Sepeti Temizle</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="neo-flat rounded-xl p-5 flex gap-5 items-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-lg neo-inset-sm flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-[var(--neon-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.slug}`} className="font-semibold text-[var(--text-primary)] hover:text-[var(--neon-cyan)] transition-colors truncate block">
                    {item.product.title}
                  </Link>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.variant.name}</p>
                  <p className="text-lg font-bold text-neon-cyan stat-number mt-1">
                    {item.variant.price.toFixed(2)} <span className="text-xs text-[var(--text-tertiary)] font-normal">{item.variant.currency}</span>
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg neo-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--border-medium)] transition-all text-sm"
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span className="w-10 text-center font-mono-accent text-sm">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg neo-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--border-medium)] transition-all text-sm"
                  >+</button>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removing === item.id}
                  className="btn btn-icon btn-danger"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="neo rounded-2xl p-6 sticky top-20">
              <h2 className="terminal-label mb-5">// SIPARIS OZETI</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-[var(--text-tertiary)]">
                  <span>Ara Toplam</span>
                  <span className="stat-number">{total.toFixed(2)} TRY</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--text-tertiary)]">
                  <span>KDV (%20)</span>
                  <span className="stat-number">{(total * 0.2).toFixed(2)} TRY</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[var(--text-primary)]">Toplam</span>
                  <span className="text-neon-cyan stat-number">{(total * 1.2).toFixed(2)} TRY</span>
                </div>
              </div>

              <Link href="/checkout" className="w-full btn btn-filled justify-center py-3.5 text-base mb-3">
                Odemeye Gec
              </Link>
              <Link href="/" className="w-full btn btn-ghost justify-center py-3">
                Alisverise Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
