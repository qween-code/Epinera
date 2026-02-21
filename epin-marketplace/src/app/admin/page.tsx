import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/admin');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') redirect('/');

  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { count: pendingKYC } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('kyc_status', 'pending');

  const { data: recentOrders } = await supabase.from('orders').select('id, total_amount, currency, status, created_at, profiles!inner(id)').order('created_at', { ascending: false }).limit(5);
  const { data: recentProducts } = await supabase.from('products').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5);

  const stats = [
    { label: 'KULLANICI', value: totalUsers || 0, color: 'var(--neon-cyan)' },
    { label: 'URUN', value: totalProducts || 0, color: 'var(--neon-purple)' },
    { label: 'SIPARIS', value: totalOrders || 0, color: 'var(--neon-green)' },
    { label: 'BEKLEYEN KYC', value: pendingKYC || 0, color: 'var(--neon-amber)', link: '/admin/kyc' },
  ];

  const actions = [
    { href: '/admin/users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'Kullanici Yonetimi', desc: 'Kullanicilari goruntule' },
    { href: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', title: 'Urun Yonetimi', desc: 'Urunleri duzenle' },
    { href: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'Siparis Yonetimi', desc: 'Siparisleri goruntule' },
    { href: '/admin/kyc', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'KYC Onaylari', desc: 'Kimlik dogrulamalari' },
    { href: '/admin/categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', title: 'Kategori Yonetimi', desc: 'Kategorileri duzenle' },
    { href: '/admin/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Platform Analitigi', desc: 'Detayli istatistikler' },
  ];

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-heading mb-8"><span className="text-gradient">Admin Paneli</span></h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="neo rounded-xl p-5">
              <div className="terminal-label text-[0.6rem] mb-2" style={{ color: stat.color }}>{stat.label}</div>
              <div className="text-3xl font-bold stat-number text-[var(--text-primary)]">{stat.value}</div>
              {stat.link && Number(stat.value) > 0 && (
                <Link href={stat.link} className="text-xs text-[var(--neon-cyan)] mt-1 inline-block hover:underline">Onay Bekleyenler</Link>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="neo-flat rounded-xl p-5 hover:border-[var(--border-medium)] transition-all group">
              <div className="w-10 h-10 rounded-lg neo-inset-sm flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[var(--neon-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-1">{action.title}</h3>
              <p className="text-xs text-[var(--text-tertiary)]">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="neo rounded-xl p-6">
            <h2 className="terminal-label mb-4">// SON SIPARISLER</h2>
            {!recentOrders || recentOrders.length === 0 ? (
              <p className="text-center py-8 text-sm text-[var(--text-ghost)]">Henuz siparis yok</p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="neo-inset-sm rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold font-mono-accent text-[var(--text-primary)]">#{order.id.slice(0, 8)}</div>
                      <div className="text-[0.65rem] text-[var(--text-ghost)]">{new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold stat-number">{parseFloat(order.total_amount).toFixed(2)} {order.currency}</div>
                      <div className={`text-[0.65rem] ${order.status === 'completed' ? 'text-[var(--neon-green)]' : order.status === 'pending' ? 'text-[var(--neon-amber)]' : 'text-[var(--neon-cyan)]'}`}>{order.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="neo rounded-xl p-6">
            <h2 className="terminal-label mb-4">// SON URUNLER</h2>
            {!recentProducts || recentProducts.length === 0 ? (
              <p className="text-center py-8 text-sm text-[var(--text-ghost)]">Henuz urun yok</p>
            ) : (
              <div className="space-y-2">
                {recentProducts.map((product: any) => (
                  <div key={product.id} className="neo-inset-sm rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{product.title}</div>
                      <div className="text-[0.65rem] text-[var(--text-ghost)]">{new Date(product.created_at).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <span className={`badge ${product.status === 'active' ? 'badge-green' : product.status === 'draft' ? 'badge-ghost' : 'badge-red'}`}>
                      {product.status}
                    </span>
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
