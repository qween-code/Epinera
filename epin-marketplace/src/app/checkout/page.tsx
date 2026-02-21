'use client';

import { useCart } from '@/lib/cart/CartContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    deliveryNotes: '',
    paymentMethod: 'credit_card' as 'credit_card' | 'paypal' | 'bank_transfer',
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/checkout');
        return;
      }
      setUser(user);
      setFormData(prev => ({ ...prev, email: user.email || '' }));
      setLoading(false);
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { alert('Sepetinizde urun yok'); return; }
    setProcessing(true);

    try {
      const total = getTotal();
      const totalWithTax = total * 1.2;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          total_amount: totalWithTax,
          currency: 'TRY',
          status: 'pending',
          payment_status: 'pending',
          payment_method: formData.paymentMethod,
          delivery_info: { email: formData.email, phone: formData.phone, notes: formData.deliveryNotes },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsPromises = items.map(async (item) => {
        const { data: variant } = await supabase
          .from('product_variants')
          .select('product_id, products!inner(seller_id)')
          .eq('id', item.variant_id)
          .single();
        if (!variant) throw new Error('Variant not found');
        const products = variant.products as any;
        const sellerId = Array.isArray(products) ? products[0]?.seller_id : products?.seller_id;
        return {
          order_id: order.id, variant_id: item.variant_id, product_id: variant.product_id,
          seller_id: sellerId, quantity: item.quantity, unit_price: item.variant.price,
          total_price: item.variant.price * item.quantity,
        };
      });

      const orderItems = await Promise.all(orderItemsPromises);
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      for (const item of items) {
        await supabase.rpc('decrement_stock', { p_variant_id: item.variant_id, p_quantity: item.quantity }).then(({ error }) => {
          if (error) console.error('Stock decrement error:', error);
        });
      }

      await clearCart();
      router.push(`/orders/${order.id}?success=true`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Siparis olusturulurken bir hata olustu: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-2xl font-heading">Sepetiniz Bos</h1>
        <p className="text-sm text-[var(--text-tertiary)]">Odeme yapabilmek icin sepetinize urun eklemelisiniz</p>
        <Link href="/" className="btn btn-primary">Alisverise Basla</Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-heading mb-8"><span className="text-gradient">Odeme</span></h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              {/* Contact */}
              <div className="neo rounded-xl p-6">
                <h2 className="terminal-label mb-4">// ILETISIM BILGILERI</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">E-posta <span className="text-[var(--neon-red)]">*</span></label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input" placeholder="ornek@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Telefon</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input" placeholder="+90 555 123 4567" />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="neo rounded-xl p-6">
                <h2 className="terminal-label mb-4">// TESLIMAT BILGILERI</h2>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Ozel Notlar</label>
                  <textarea value={formData.deliveryNotes} onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })} className="input" placeholder="Teslimat icin ozel talepleriniz..." />
                </div>
              </div>

              {/* Payment */}
              <div className="neo rounded-xl p-6">
                <h2 className="terminal-label mb-4">// ODEME YONTEMI</h2>
                <div className="space-y-2">
                  {[
                    { value: 'credit_card', label: 'Kredi/Banka Karti', desc: 'Visa, Mastercard, American Express' },
                    { value: 'paypal', label: 'PayPal', desc: 'Guvenli PayPal ile odeme' },
                    { value: 'bank_transfer', label: 'Banka Havalesi', desc: 'Havale/EFT ile odeme' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                        formData.paymentMethod === method.value
                          ? 'neo-flat border-[rgba(0,240,255,0.2)] bg-[rgba(0,240,255,0.03)]'
                          : 'neo-inset-sm hover:border-[var(--border-subtle)]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        formData.paymentMethod === method.value ? 'border-[var(--neon-cyan)]' : 'border-[var(--text-ghost)]'
                      }`}>
                        {formData.paymentMethod === method.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[var(--neon-cyan)]" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[var(--text-primary)]">{method.label}</div>
                        <div className="text-xs text-[var(--text-tertiary)]">{method.desc}</div>
                      </div>
                      <input type="radio" name="paymentMethod" value={method.value} checked={formData.paymentMethod === method.value} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })} className="hidden" />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="neo rounded-2xl p-6 sticky top-20">
                <h2 className="terminal-label mb-5">// SIPARIS OZETI</h2>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[var(--text-primary)] truncate">{item.product.title}</div>
                        <div className="text-xs text-[var(--text-ghost)]">{item.variant.name} x {item.quantity}</div>
                      </div>
                      <div className="font-semibold stat-number text-[var(--text-secondary)] ml-3">{(item.variant.price * item.quantity).toFixed(2)} TRY</div>
                    </div>
                  ))}
                </div>
                <div className="divider" />
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm text-[var(--text-tertiary)]">
                    <span>Ara Toplam</span><span className="stat-number">{subtotal.toFixed(2)} TRY</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--text-tertiary)]">
                    <span>KDV (%20)</span><span className="stat-number">{tax.toFixed(2)} TRY</span>
                  </div>
                  <div className="divider" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span><span className="text-neon-cyan stat-number">{total.toFixed(2)} TRY</span>
                  </div>
                </div>
                <button type="submit" disabled={processing} className="w-full btn btn-filled justify-center py-3.5 text-base">
                  {processing ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Isleniyor...</>
                  ) : `${total.toFixed(2)} TRY Ode`}
                </button>
                <p className="text-[0.65rem] text-[var(--text-ghost)] mt-3 text-center">
                  Siparisizi tamamlayarak <Link href="/terms" className="underline hover:text-[var(--neon-cyan)]">Kullanim Kosullarini</Link> kabul etmis olursunuz.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
