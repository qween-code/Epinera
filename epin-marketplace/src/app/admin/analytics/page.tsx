import { createClient } from '@/lib/supabase/server';

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: activeProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active');
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { count: completedOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed');

  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('payment_status', 'paid');

  const totalRevenue = (revenueData || []).reduce((sum, o) => sum + parseFloat(o.total_amount || '0'), 0);

  const { data: topProducts } = await supabase
    .from('order_items')
    .select('variant_id, quantity, product_variants(name, products(title))')
    .order('quantity', { ascending: false })
    .limit(5);

  const stats = [
    { label: 'TOPLAM GELİR', value: `${totalRevenue.toFixed(2)} TRY`, color: 'var(--neon-green)' },
    { label: 'TOPLAM KULLANICI', value: totalUsers || 0, color: 'var(--neon-cyan)' },
    { label: 'TOPLAM ÜRÜN', value: totalProducts || 0, color: 'var(--neon-purple)' },
    { label: 'AKTİF ÜRÜN', value: activeProducts || 0, color: 'var(--neon-amber)' },
    { label: 'TOPLAM SİPARİŞ', value: totalOrders || 0, color: 'var(--neon-magenta)' },
    { label: 'TAMAMLANAN SİPARİŞ', value: completedOrders || 0, color: 'var(--neon-green)' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading mb-8"><span className="text-gradient">Platform Analitiği</span></h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="neo rounded-xl p-6">
            <div className="terminal-label text-[0.6rem] mb-2" style={{ color: stat.color }}>{stat.label}</div>
            <div className="text-3xl font-bold stat-number text-[var(--text-primary)]">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="neo rounded-xl p-6">
        <h2 className="terminal-label mb-4">// EN ÇOK SATILAN ÜRÜNLER</h2>
        {topProducts && topProducts.length > 0 ? (
          <div className="space-y-3">
            {topProducts.map((item: any, idx: number) => (
              <div key={idx} className="neo-inset-sm rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg neo-sm flex items-center justify-center text-sm font-bold stat-number" style={{ color: 'var(--neon-cyan)' }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      {item.product_variants?.products?.title || 'Bilinmeyen Ürün'}
                    </div>
                    <div className="text-xs text-[var(--text-ghost)]">{item.product_variants?.name}</div>
                  </div>
                </div>
                <div className="stat-number text-[var(--neon-green)]">{item.quantity} adet</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-sm text-[var(--text-ghost)]">Henüz satış verisi yok</p>
        )}
      </div>
    </div>
  );
}
