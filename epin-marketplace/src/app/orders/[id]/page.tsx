import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type OrderPageProps = {
  params: { id: string };
  searchParams: { success?: string };
};

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`*, order_items (*, product_variants (name, price, currency), products (title, slug))`)
    .eq('id', id)
    .single();

  if (error || !order) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || order.buyer_id !== user.id) notFound();

  const isSuccess = searchParams.success === 'true';

  const statusMap: Record<string, { label: string; badge: string }> = {
    pending: { label: 'Beklemede', badge: 'badge-amber' },
    processing: { label: 'Isleniyor', badge: 'badge-cyan' },
    completed: { label: 'Tamamlandi', badge: 'badge-green' },
    cancelled: { label: 'Iptal Edildi', badge: 'badge-red' },
    refunded: { label: 'Iade Edildi', badge: 'badge-purple' },
  };

  const status = statusMap[order.status] || statusMap.pending;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {isSuccess && (
          <div className="neo rounded-xl p-5 mb-8 border border-[rgba(57,255,20,0.2)] bg-[rgba(57,255,20,0.03)]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(57,255,20,0.1)]">
                <svg className="w-6 h-6 text-[var(--neon-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--neon-green)]">Siparisiniz Alindi!</h2>
                <p className="text-xs font-mono-accent text-[var(--text-tertiary)] mt-0.5">Siparis No: {order.id}</p>
              </div>
            </div>
          </div>
        )}

        <div className="neo rounded-2xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-heading mb-2">Siparis Detaylari</h1>
              <p className="text-xs font-mono-accent text-[var(--text-ghost)]">ID: {order.id}</p>
              <p className="text-xs text-[var(--text-ghost)] mt-0.5">
                {new Date(order.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span className={`badge ${status.badge}`}>{status.label}</span>
          </div>

          {/* Items */}
          <div className="mb-8">
            <h2 className="terminal-label mb-4">// URUNLER</h2>
            <div className="space-y-2">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="neo-inset-sm rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <Link href={`/product/${item.products.slug}`} className="font-semibold text-[var(--text-primary)] hover:text-[var(--neon-cyan)] transition-colors">
                      {item.products.title}
                    </Link>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.product_variants.name} &middot; {item.quantity}x</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold stat-number text-neon-cyan">{parseFloat(item.total_price).toFixed(2)} {item.product_variants.currency}</p>
                    <p className="text-[0.65rem] text-[var(--text-ghost)]">{parseFloat(item.unit_price).toFixed(2)} / adet</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="divider" />
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Toplam Tutar</span>
            <span className="text-neon-cyan stat-number">{parseFloat(order.total_amount).toFixed(2)} {order.currency}</span>
          </div>
          <div className="text-sm text-[var(--text-tertiary)] space-y-1">
            <p>Odeme Yontemi: {order.payment_method === 'credit_card' ? 'Kredi/Banka Karti' : order.payment_method === 'paypal' ? 'PayPal' : 'Banka Havalesi'}</p>
            <p>Odeme Durumu: {order.payment_status === 'pending' ? 'Beklemede' : order.payment_status === 'paid' ? 'Odendi' : order.payment_status}</p>
          </div>

          {/* Delivery Info */}
          {order.delivery_info && (
            <>
              <div className="divider" />
              <h3 className="terminal-label mb-3">// TESLIMAT BILGILERI</h3>
              <div className="text-sm text-[var(--text-tertiary)] space-y-1">
                {order.delivery_info.email && <p>E-posta: {order.delivery_info.email}</p>}
                {order.delivery_info.phone && <p>Telefon: {order.delivery_info.phone}</p>}
                {order.delivery_info.notes && <p className="text-[var(--text-ghost)]">Not: {order.delivery_info.notes}</p>}
              </div>
            </>
          )}

          <div className="mt-8 flex gap-3">
            <Link href="/orders" className="btn btn-secondary">Tum Siparislerim</Link>
            <Link href="/" className="btn btn-primary">Alisverise Devam Et</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
