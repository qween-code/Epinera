import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import OrderItemActions from '@/components/seller/OrderItemActions';

export default async function SellerOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/seller/orders');

  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`id, quantity, unit_price, total_price, delivery_status, created_at, orders!inner (id, buyer_id, delivery_info), products (title), product_variants (name)`)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  const pendingOrders = orderItems?.filter(item => item.delivery_status === 'pending') || [];
  const processingOrders = orderItems?.filter(item => item.delivery_status === 'processing') || [];
  const completedOrders = orderItems?.filter(item => item.delivery_status === 'completed') || [];

  const stats = [
    { label: 'BEKLEYEN', value: pendingOrders.length, color: 'var(--neon-amber)' },
    { label: 'ISLENIYOR', value: processingOrders.length, color: 'var(--neon-cyan)' },
    { label: 'TAMAMLANAN', value: completedOrders.length, color: 'var(--neon-green)' },
  ];

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-heading"><span className="text-gradient">Satici Siparisleri</span></h1>
          <Link href="/seller/dashboard" className="btn btn-sm btn-ghost">Panele Don</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="neo rounded-xl p-5">
              <div className="terminal-label text-[0.6rem] mb-2" style={{ color: stat.color }}>{stat.label}</div>
              <div className="text-3xl font-bold stat-number" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {!orderItems || orderItems.length === 0 ? (
          <div className="neo rounded-2xl p-14 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neo-inset flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--text-ghost)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-heading mb-2">Henuz Siparis Yok</h2>
            <p className="text-sm text-[var(--text-tertiary)]">Siparisler geldiginde burada gorunecek</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending */}
            {pendingOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-[var(--neon-amber)] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--neon-amber)]" />
                  Bekleyen Siparisler
                </h2>
                <div className="space-y-3">
                  {pendingOrders.map((item: any) => (
                    <div key={item.id} className="neo-flat rounded-xl p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-[var(--text-primary)]">{item.products.title}</h3>
                          <p className="text-xs text-[var(--text-tertiary)]">{item.product_variants.name}</p>
                          <p className="text-[0.65rem] text-[var(--text-ghost)] font-mono-accent mt-1">
                            Siparis: #{item.orders.id.slice(0, 8)} &middot; {new Date(item.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold stat-number text-neon-cyan">{parseFloat(item.total_price).toFixed(2)} TRY</div>
                          <div className="text-xs text-[var(--text-tertiary)]">Adet: {item.quantity}</div>
                        </div>
                      </div>
                      {item.orders.delivery_info && (
                        <div className="neo-inset-sm rounded-lg p-3 mb-3 text-xs text-[var(--text-tertiary)] space-y-0.5">
                          <div className="terminal-label text-[0.55rem] mb-1">TESLIMAT BILGILERI</div>
                          {item.orders.delivery_info.email && <p>Email: {item.orders.delivery_info.email}</p>}
                          {item.orders.delivery_info.phone && <p>Tel: {item.orders.delivery_info.phone}</p>}
                          {item.orders.delivery_info.notes && <p>Not: {item.orders.delivery_info.notes}</p>}
                        </div>
                      )}
                      <OrderItemActions orderItemId={item.id} currentStatus={item.delivery_status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing */}
            {processingOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]" />
                  Isleniyor
                </h2>
                <div className="space-y-3">
                  {processingOrders.map((item: any) => (
                    <div key={item.id} className="neo-flat rounded-xl p-5 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)]">{item.products.title}</h3>
                        <p className="text-xs text-[var(--text-tertiary)]">{item.product_variants.name}</p>
                        <p className="text-[0.65rem] text-[var(--text-ghost)] font-mono-accent mt-0.5">#{item.orders.id.slice(0, 8)}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="font-bold stat-number">{parseFloat(item.total_price).toFixed(2)} TRY</div>
                        <OrderItemActions orderItemId={item.id} currentStatus={item.delivery_status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-[var(--neon-green)] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--neon-green)]" />
                  Tamamlanan Siparisler
                </h2>
                <div className="space-y-2">
                  {completedOrders.slice(0, 10).map((item: any) => (
                    <div key={item.id} className="neo-inset-sm rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-sm text-[var(--text-primary)]">{item.products.title}</h3>
                        <p className="text-xs text-[var(--text-tertiary)]">{item.product_variants.name} &middot; {item.quantity}x</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold stat-number text-sm">{parseFloat(item.total_price).toFixed(2)} TRY</div>
                        <div className="text-[0.6rem] text-[var(--neon-green)]">Teslim edildi</div>
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
