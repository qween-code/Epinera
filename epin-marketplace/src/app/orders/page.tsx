import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/orders');

  const { data: orders } = await supabase
    .from('orders')
    .select(`*, order_items (quantity, product_variants (name), products (title))`)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });

  const statusMap: Record<string, { label: string; badge: string }> = {
    pending: { label: 'Beklemede', badge: 'badge-amber' },
    processing: { label: 'Isleniyor', badge: 'badge-cyan' },
    completed: { label: 'Tamamlandi', badge: 'badge-green' },
    cancelled: { label: 'Iptal Edildi', badge: 'badge-red' },
    refunded: { label: 'Iade Edildi', badge: 'badge-purple' },
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-heading mb-8"><span className="text-gradient">Siparislerim</span></h1>

        {!orders || orders.length === 0 ? (
          <div className="neo rounded-2xl p-14 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neo-inset flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--text-ghost)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-heading mb-2">Henuz Siparisiniz Yok</h2>
            <p className="text-sm text-[var(--text-tertiary)] mb-6">Ilk siparisizi olusturmak icin alisverise baslayin</p>
            <Link href="/" className="btn btn-primary">Alisverise Basla</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const itemCount = order.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0);
              const firstItems = order.order_items.slice(0, 2);
              const remainingCount = order.order_items.length - 2;
              const status = statusMap[order.status] || statusMap.pending;

              return (
                <Link key={order.id} href={`/orders/${order.id}`} className="block neo-flat rounded-xl p-5 hover:border-[var(--border-medium)] transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs font-mono-accent text-[var(--text-ghost)]">
                        Siparis No: {order.id.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-[var(--text-ghost)] mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`badge ${status.badge}`}>{status.label}</span>
                      <span className="text-xl font-bold stat-number text-neon-cyan">
                        {parseFloat(order.total_amount).toFixed(2)} <span className="text-xs text-[var(--text-tertiary)] font-normal">{order.currency}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-[var(--text-tertiary)]">
                    <p className="font-medium mb-1 text-[var(--text-secondary)]">{itemCount} urun:</p>
                    <ul className="text-xs space-y-0.5">
                      {firstItems.map((item: any, idx: number) => (
                        <li key={idx}>{item.products.title} - {item.product_variants.name} ({item.quantity}x)</li>
                      ))}
                      {remainingCount > 0 && <li className="italic">ve {remainingCount} urun daha...</li>}
                    </ul>
                  </div>
                  <div className="mt-3 text-xs font-semibold text-[var(--neon-cyan)] flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    Detaylari Gor
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
