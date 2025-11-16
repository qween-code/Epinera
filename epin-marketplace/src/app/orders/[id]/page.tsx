import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type OrderPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    success?: string;
  };
};

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = params;
  const supabase = await createClient();

  // Fetch order details
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product_variants (
          name,
          price,
          currency
        ),
        products (
          title,
          slug
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Verify user owns this order
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || order.buyer_id !== user.id) {
    notFound();
  }

  const isSuccess = searchParams.success === 'true';

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {isSuccess && (
          <div className="bg-green-900/50 border border-green-600 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-4xl">✓</div>
              <div>
                <h2 className="text-2xl font-bold text-green-400">Siparişiniz Alındı!</h2>
                <p className="text-green-200 mt-1">
                  Sipariş numaranız: <span className="font-mono">{order.id}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">Sipariş Detayları</h1>
              <p className="text-gray-400 mt-2">
                Sipariş No: <span className="font-mono">{order.id}</span>
              </p>
              <p className="text-gray-400">
                Tarih: {new Date(order.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block px-4 py-2 bg-blue-900 text-blue-300 rounded-lg font-semibold">
                {order.status === 'pending' && 'Beklemede'}
                {order.status === 'processing' && 'İşleniyor'}
                {order.status === 'completed' && 'Tamamlandı'}
                {order.status === 'cancelled' && 'İptal Edildi'}
                {order.status === 'refunded' && 'İade Edildi'}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Ürünler</h2>
            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <Link
                      href={`/product/${item.products.slug}`}
                      className="text-lg font-semibold hover:text-blue-400 transition-colors"
                    >
                      {item.products.title}
                    </Link>
                    <p className="text-gray-400 text-sm">{item.product_variants.name}</p>
                    <p className="text-gray-400 text-sm">Adet: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {parseFloat(item.total_price).toFixed(2)} {item.product_variants.currency}
                    </p>
                    <p className="text-sm text-gray-400">
                      {parseFloat(item.unit_price).toFixed(2)} {item.product_variants.currency} / adet
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Toplam Tutar</span>
              <span>{parseFloat(order.total_amount).toFixed(2)} {order.currency}</span>
            </div>
            <div className="text-gray-400">
              <p>Ödeme Yöntemi: {
                order.payment_method === 'credit_card' ? 'Kredi/Banka Kartı' :
                order.payment_method === 'paypal' ? 'PayPal' :
                order.payment_method === 'bank_transfer' ? 'Banka Havalesi' :
                order.payment_method
              }</p>
              <p>Ödeme Durumu: {
                order.payment_status === 'pending' ? 'Beklemede' :
                order.payment_status === 'paid' ? 'Ödendi' :
                order.payment_status === 'failed' ? 'Başarısız' :
                order.payment_status === 'refunded' ? 'İade Edildi' :
                order.payment_status
              }</p>
            </div>
          </div>

          {/* Delivery Information */}
          {order.delivery_info && (
            <div className="border-t border-gray-700 pt-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Teslimat Bilgileri</h3>
              <div className="text-gray-300 space-y-2">
                {order.delivery_info.email && (
                  <p>E-posta: {order.delivery_info.email}</p>
                )}
                {order.delivery_info.phone && (
                  <p>Telefon: {order.delivery_info.phone}</p>
                )}
                {order.delivery_info.notes && (
                  <div>
                    <p className="font-semibold">Notlar:</p>
                    <p className="text-gray-400">{order.delivery_info.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Link
              href="/orders"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Tüm Siparişlerim
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
