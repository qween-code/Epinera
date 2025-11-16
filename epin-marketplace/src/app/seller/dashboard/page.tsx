import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/seller/dashboard');
  }

  // Fetch seller stats
  const { data: products } = await supabase
    .from('products')
    .select('id, title, status, product_variants(stock_quantity)')
    .eq('seller_id', user.id);

  const { data: orders } = await supabase
    .from('order_items')
    .select('id, total_price, delivery_status, created_at')
    .eq('seller_id', user.id);

  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter(p => p.status === 'active').length || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.delivery_status === 'pending').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_price), 0) || 0;

  // Recent orders
  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Satıcı Paneli</h1>
          <Link
            href="/seller/products/new"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            + Yeni Ürün Ekle
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Toplam Ürün</div>
            <div className="text-3xl font-bold">{totalProducts}</div>
            <div className="text-green-400 text-sm mt-2">{activeProducts} aktif</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Toplam Sipariş</div>
            <div className="text-3xl font-bold">{totalOrders}</div>
            <div className="text-yellow-400 text-sm mt-2">{pendingOrders} beklemede</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Toplam Gelir</div>
            <div className="text-3xl font-bold">{totalRevenue.toFixed(2)} TRY</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">KYC Durumu</div>
            <div className="text-lg font-semibold text-yellow-400">Beklemede</div>
            <Link href="/seller/kyc" className="text-blue-400 text-sm mt-2 inline-block hover:underline">
              Doğrulama Yap
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/seller/products"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2">Ürünlerim</h3>
            <p className="text-gray-400 text-sm">Ürünlerinizi yönetin ve düzenleyin</p>
          </Link>

          <Link
            href="/seller/orders"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Siparişler</h3>
            <p className="text-gray-400 text-sm">Bekleyen siparişleri teslim edin</p>
          </Link>

          <Link
            href="/seller/analytics"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Analizler</h3>
            <p className="text-gray-400 text-sm">Satış istatistiklerinizi görüntüleyin</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Son Siparişler</h2>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Henüz sipariş yok
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                >
                  <div>
                    <div className="font-semibold">Sipariş #{order.id.slice(0, 8)}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{parseFloat(order.total_price).toFixed(2)} TRY</div>
                    <div className={`text-sm ${
                      order.delivery_status === 'pending' ? 'text-yellow-400' :
                      order.delivery_status === 'processing' ? 'text-blue-400' :
                      order.delivery_status === 'completed' ? 'text-green-400' :
                      'text-gray-400'
                    }`}>
                      {order.delivery_status === 'pending' && 'Beklemede'}
                      {order.delivery_status === 'processing' && 'İşleniyor'}
                      {order.delivery_status === 'completed' && 'Tamamlandı'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recentOrders.length > 0 && (
            <Link
              href="/seller/orders"
              className="block mt-6 text-center text-blue-400 hover:underline"
            >
              Tüm Siparişleri Gör
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
