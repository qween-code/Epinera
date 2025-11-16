import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import OrderItemActions from '@/components/seller/OrderItemActions';

export default async function SellerOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/seller/orders');
  }

  // Fetch seller's order items
  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select(`
      id,
      quantity,
      unit_price,
      total_price,
      delivery_status,
      created_at,
      orders!inner (
        id,
        buyer_id,
        delivery_info
      ),
      products (
        title
      ),
      product_variants (
        name
      )
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  const pendingOrders = orderItems?.filter(item => item.delivery_status === 'pending') || [];
  const processingOrders = orderItems?.filter(item => item.delivery_status === 'processing') || [];
  const completedOrders = orderItems?.filter(item => item.delivery_status === 'completed') || [];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Satıcı Siparişleri</h1>
          <Link
            href="/seller/dashboard"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Panele Dön
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Bekleyen</div>
            <div className="text-3xl font-bold text-yellow-400">{pendingOrders.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">İşleniyor</div>
            <div className="text-3xl font-bold text-blue-400">{processingOrders.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Tamamlanan</div>
            <div className="text-3xl font-bold text-green-400">{completedOrders.length}</div>
          </div>
        </div>

        {!orderItems || orderItems.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">Henüz Sipariş Yok</h2>
            <p className="text-gray-400">Siparişler geldiğinde burada görünecek</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Orders */}
            {pendingOrders.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Bekleyen Siparişler</h2>
                <div className="space-y-4">
                  {pendingOrders.map((item: any) => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{item.products.title}</h3>
                          <p className="text-gray-400">{item.product_variants.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Sipariş: #{item.orders.id.slice(0, 8)} • {new Date(item.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{parseFloat(item.total_price).toFixed(2)} TRY</div>
                          <div className="text-sm text-gray-400">Adet: {item.quantity}</div>
                        </div>
                      </div>

                      {item.orders.delivery_info && (
                        <div className="bg-gray-700 rounded p-4 mb-4">
                          <div className="text-sm font-semibold mb-2">Teslimat Bilgileri:</div>
                          <div className="text-sm text-gray-300 space-y-1">
                            {item.orders.delivery_info.email && (
                              <p>Email: {item.orders.delivery_info.email}</p>
                            )}
                            {item.orders.delivery_info.phone && (
                              <p>Telefon: {item.orders.delivery_info.phone}</p>
                            )}
                            {item.orders.delivery_info.notes && (
                              <p>Not: {item.orders.delivery_info.notes}</p>
                            )}
                          </div>
                        </div>
                      )}

                      <OrderItemActions
                        orderItemId={item.id}
                        currentStatus={item.delivery_status}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Orders */}
            {processingOrders.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">İşleniyor</h2>
                <div className="space-y-4">
                  {processingOrders.map((item: any) => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">{item.products.title}</h3>
                          <p className="text-gray-400">{item.product_variants.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Sipariş: #{item.orders.id.slice(0, 8)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold mb-2">{parseFloat(item.total_price).toFixed(2)} TRY</div>
                          <OrderItemActions
                            orderItemId={item.id}
                            currentStatus={item.delivery_status}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Orders */}
            {completedOrders.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-green-400">Tamamlanan Siparişler</h2>
                <div className="space-y-4">
                  {completedOrders.slice(0, 10).map((item: any) => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{item.products.title}</h3>
                          <p className="text-sm text-gray-400">{item.product_variants.name} • {item.quantity}x</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{parseFloat(item.total_price).toFixed(2)} TRY</div>
                          <div className="text-xs text-green-400">✓ Teslim edildi</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
