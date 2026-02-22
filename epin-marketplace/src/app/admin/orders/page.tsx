import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function updateOrderStatus(formData: FormData) {
  'use server';
  const supabase = await createClient();
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  await supabase.from('orders').update({ status }).eq('id', id);
  revalidatePath('/admin/orders');
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  const statusBadge: Record<string, string> = {
    pending: 'badge-amber', processing: 'badge-cyan', completed: 'badge-green',
    cancelled: 'badge-red', refunded: 'badge-purple',
  };

  const statusOptions = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];

  return (
    <div>
      <h1 className="text-2xl font-heading mb-8"><span className="text-gradient">Sipariş Yönetimi</span></h1>

      <div className="space-y-3">
        {(orders || []).map((order: any) => (
          <div key={order.id} className="neo-flat rounded-xl p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold font-mono-accent text-[var(--text-primary)]">#{order.id.slice(0, 8)}</span>
                  <span className={`badge ${statusBadge[order.status] || 'badge-ghost'}`}>{order.status}</span>
                </div>
                <p className="text-sm text-[var(--neon-cyan)] stat-number">{parseFloat(order.total_amount).toFixed(2)} {order.currency}</p>
                <p className="text-[0.65rem] text-[var(--text-ghost)] font-mono-accent mt-0.5">
                  Ödeme: <span className={order.payment_status === 'paid' ? 'text-[var(--neon-green)]' : 'text-[var(--neon-amber)]'}>
                    {order.payment_status}
                  </span>
                  {' '}&middot; {new Date(order.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <form action={updateOrderStatus} className="flex gap-2 items-center">
                <input type="hidden" name="id" value={order.id} />
                <select name="status" defaultValue={order.status} className="input text-sm py-1.5 px-3">
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" className="btn btn-sm btn-primary">Güncelle</button>
              </form>
            </div>
          </div>
        ))}
        {(!orders || orders.length === 0) && (
          <div className="neo rounded-2xl p-14 text-center">
            <h2 className="text-xl font-heading mb-2">Henüz Sipariş Yok</h2>
          </div>
        )}
      </div>
    </div>
  );
}
