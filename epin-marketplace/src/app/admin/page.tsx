import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  // Fetch platform stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: pendingKYC } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('kyc_status', 'pending');

  // Fetch recent activity
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, total_amount, currency, status, created_at, profiles!inner(id)')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Toplam Kullanıcı</div>
            <div className="text-3xl font-bold">{totalUsers || 0}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Toplam Ürün</div>
            <div className="text-3xl font-bold">{totalProducts || 0}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Toplam Sipariş</div>
            <div className="text-3xl font-bold">{totalOrders || 0}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Bekleyen KYC</div>
            <div className="text-3xl font-bold text-yellow-400">{pendingKYC || 0}</div>
            {pendingKYC && pendingKYC > 0 && (
              <Link href="/admin/kyc" className="text-blue-400 text-sm mt-2 inline-block hover:underline">
                Onay Bekleyenler
              </Link>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/users"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Kullanıcı Yönetimi</h3>
            <p className="text-gray-400 text-sm">Kullanıcıları görüntüle ve yönet</p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2">Ürün Yönetimi</h3>
            <p className="text-gray-400 text-sm">Tüm ürünleri görüntüle ve düzenle</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Sipariş Yönetimi</h3>
            <p className="text-gray-400 text-sm">Tüm siparişleri görüntüle</p>
          </Link>

          <Link
            href="/admin/kyc"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">KYC Onayları</h3>
            <p className="text-gray-400 text-sm">Kimlik doğrulamalarını onayla</p>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="text-xl font-bold mb-2">Kategori Yönetimi</h3>
            <p className="text-gray-400 text-sm">Kategorileri düzenle</p>
          </Link>

          <Link
            href="/admin/analytics"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2">Platform Analitiği</h3>
            <p className="text-gray-400 text-sm">Detaylı istatistikler</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Son Siparişler</h2>
            {!recentOrders || recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Henüz sipariş yok</div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">#{order.id.slice(0, 8)}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {parseFloat(order.total_amount).toFixed(2)} {order.currency}
                      </div>
                      <div className={`text-sm ${
                        order.status === 'completed' ? 'text-green-400' :
                        order.status === 'pending' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Son Eklenen Ürünler</h2>
            {!recentProducts || recentProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Henüz ürün yok</div>
            ) : (
              <div className="space-y-4">
                {recentProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{product.title}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(product.created_at).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.status === 'active' ? 'bg-green-900 text-green-300' :
                        product.status === 'draft' ? 'bg-gray-600 text-gray-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
