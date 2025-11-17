import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/orders');
  }

  // Fetch user's orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        product_variants (
          name
        ),
        products (
          title
        )
      )
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Siparişlerim</h1>

        {!orders || orders.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">Henüz Siparişiniz Yok</h2>
            <p className="text-gray-400 mb-6">İlk siparişinizi oluşturmak için alışverişe başlayın</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const itemCount = order.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0);
              const firstItems = order.order_items.slice(0, 2);
              const remainingCount = order.order_items.length - 2;

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-400">
                        Sipariş No: <span className="font-mono">{order.id.slice(0, 8)}...</span>
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'completed' ? 'bg-green-900 text-green-300' :
                        order.status === 'processing' ? 'bg-blue-900 text-blue-300' :
                        order.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                        order.status === 'refunded' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {order.status === 'pending' && 'Beklemede'}
                        {order.status === 'processing' && 'İşleniyor'}
                        {order.status === 'completed' && 'Tamamlandı'}
                        {order.status === 'cancelled' && 'İptal Edildi'}
                        {order.status === 'refunded' && 'İade Edildi'}
                      </span>
                      <span className="text-2xl font-bold">
                        {parseFloat(order.total_amount).toFixed(2)} {order.currency}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-300">
                    <p className="font-medium mb-1">{itemCount} ürün:</p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {firstItems.map((item: any, idx: number) => (
                        <li key={idx}>
                          {item.products.title} - {item.product_variants.name} ({item.quantity}x)
                        </li>
                      ))}
                      {remainingCount > 0 && (
                        <li className="italic">ve {remainingCount} ürün daha...</li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4 text-blue-400 text-sm font-semibold flex items-center gap-2">
                    Detayları Gör
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
