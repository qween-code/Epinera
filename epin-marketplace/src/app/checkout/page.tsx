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

    if (items.length === 0) {
      alert('Sepetinizde ürün yok');
      return;
    }

    setProcessing(true);

    try {
      const total = getTotal();
      const totalWithTax = total * 1.2;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          total_amount: totalWithTax,
          currency: 'TRY',
          status: 'pending',
          payment_status: 'pending',
          payment_method: formData.paymentMethod,
          delivery_info: {
            email: formData.email,
            phone: formData.phone,
            notes: formData.deliveryNotes,
          },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsPromises = items.map(async (item) => {
        // Fetch seller_id and product_id for this variant
        const { data: variant } = await supabase
          .from('product_variants')
          .select('product_id, products!inner(seller_id)')
          .eq('id', item.variant_id)
          .single();

        if (!variant) throw new Error('Variant not found');

        const products = variant.products as any;
        const sellerId = Array.isArray(products) ? products[0]?.seller_id : products?.seller_id;

        return {
          order_id: order.id,
          variant_id: item.variant_id,
          product_id: variant.product_id,
          seller_id: sellerId,
          quantity: item.quantity,
          unit_price: item.variant.price,
          total_price: item.variant.price * item.quantity,
        };
      });

      const orderItems = await Promise.all(orderItemsPromises);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Redirect to success page
      router.push(`/orders/${order.id}?success=true`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Sipariş oluşturulurken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Sepetiniz Boş</h1>
        <p className="text-gray-400">Ödeme yapabilmek için sepetinize ürün eklemelisiniz</p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">İletişim Bilgileri</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      E-posta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+90 555 123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Teslimat Bilgileri</h2>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Özel Notlar
                  </label>
                  <textarea
                    value={formData.deliveryNotes}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Teslimat için özel talepleriniz varsa buraya yazabilirsiniz..."
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Ödeme Yöntemi</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-medium">Kredi/Banka Kartı</div>
                      <div className="text-sm text-gray-400">Visa, Mastercard, American Express</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-400">Güvenli PayPal ile ödeme</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-medium">Banka Havalesi</div>
                      <div className="text-sm text-gray-400">Havale/EFT ile ödeme</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-6">Sipariş Özeti</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium">{item.product.title}</div>
                        <div className="text-gray-400 text-xs">{item.variant.name} x {item.quantity}</div>
                      </div>
                      <div className="font-semibold">
                        {(item.variant.price * item.quantity).toFixed(2)} TRY
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Ara Toplam</span>
                    <span>{subtotal.toFixed(2)} TRY</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>KDV (%20)</span>
                    <span>{tax.toFixed(2)} TRY</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Toplam</span>
                      <span>{total.toFixed(2)} TRY</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'İşleniyor...' : `${total.toFixed(2)} TRY Öde`}
                </button>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  Siparişinizi tamamlayarak <Link href="/terms" className="underline">Kullanım Koşullarını</Link> kabul etmiş olursunuz.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
