import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/seller/dashboard');

  const { data: products } = await supabase.from('products').select('id, title, status, product_variants(stock_quantity)').eq('seller_id', user.id);
  const { data: orders } = await supabase.from('order_items').select('id, total_price, delivery_status, created_at').eq('seller_id', user.id);

  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter(p => p.status === 'active').length || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.delivery_status === 'pending').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_price), 0) || 0;
  const recentOrders = orders?.slice(0, 5) || [];

  const stats = [
    { label: 'TOPLAM URUN', value: totalProducts, sub: `${activeProducts} aktif`, color: 'cyan' },
    { label: 'TOPLAM SIPARIS', value: totalOrders, sub: `${pendingOrders} beklemede`, color: 'amber' },
    { label: 'TOPLAM GELIR', value: `${totalRevenue.toFixed(2)} TRY`, sub: null, color: 'green' },
    { label: 'KYC DURUMU', value: 'Beklemede', sub: null, color: 'purple', isKyc: true },
  ];

  const colorVars: Record<string, string> = {
    cyan: 'var(--neon-cyan)', amber: 'var(--neon-amber)', green: 'var(--neon-green)', purple: 'var(--neon-purple)',
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-heading"><span className="text-gradient">Satici Paneli</span></h1>
          <Link href="/seller/products/new" className="btn btn-success">+ Yeni Urun Ekle</Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="neo rounded-xl p-5">
              <div className="terminal-label text-[0.6rem] mb-2" style={{ color: colorVars[stat.color] }}>{stat.label}</div>
              <div className="text-2xl font-bold stat-number text-[var(--text-primary)]">{stat.value}</div>
              {stat.sub && <div className="text-xs mt-1" style={{ color: colorVars[stat.color] }}>{stat.sub}</div>}
              {stat.isKyc && <Link href="/seller/kyc" className="text-xs text-[var(--neon-cyan)] mt-1 inline-block hover:underline">Dogrulama Yap</Link>}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { href: '/seller/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', title: 'Urunlerim', desc: 'Urunlerinizi yonetin' },
            { href: '/seller/orders', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10', title: 'Siparisler', desc: 'Bekleyen siparisleri teslim edin' },
            { href: '/seller/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Analizler', desc: 'Satis istatistikleriniz' },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="neo-flat rounded-xl p-5 hover:border-[var(--border-medium)] transition-all group">
              <div className="w-10 h-10 rounded-lg neo-inset-sm flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[var(--neon-cyan)] group-hover:text-[var(--neon-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-1">{action.title}</h3>
              <p className="text-xs text-[var(--text-tertiary)]">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="neo rounded-xl p-6">
          <h2 className="terminal-label mb-5">// SON SIPARISLER</h2>
          {recentOrders.length === 0 ? (
            <p className="text-center py-8 text-sm text-[var(--text-ghost)]">Henuz siparis yok</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="neo-inset-sm rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm text-[var(--text-primary)]">Siparis #{order.id.slice(0, 8)}</div>
                    <div className="text-xs text-[var(--text-ghost)]">{new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold stat-number text-[var(--text-primary)]">{parseFloat(order.total_price).toFixed(2)} TRY</div>
                    <div className={`text-xs ${order.delivery_status === 'pending' ? 'text-[var(--neon-amber)]' : order.delivery_status === 'processing' ? 'text-[var(--neon-cyan)]' : 'text-[var(--neon-green)]'}`}>
                      {order.delivery_status === 'pending' ? 'Beklemede' : order.delivery_status === 'processing' ? 'Isleniyor' : 'Tamamlandi'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {recentOrders.length > 0 && (
            <Link href="/seller/orders" className="block mt-4 text-center text-xs text-[var(--neon-cyan)] hover:underline">Tum Siparisleri Gor</Link>
          )}
        </div>
      </div>
    </div>
  );
}
