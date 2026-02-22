import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { updateUserRole, updateKycStatus } from '../actions';

type UserDetailPageProps = {
  params: { id: string };
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const { data: admin } = await supabase.from('profiles').select('role').eq('id', authUser.id).single();
  if (!admin || admin.role !== 'admin') redirect('/');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!profile) notFound();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, total_amount, currency, status, created_at')
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: products } = await supabase
    .from('products')
    .select('id, title, status, created_at')
    .eq('seller_id', params.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const roleMap: Record<string, { label: string; badge: string }> = {
    admin: { label: 'Admin', badge: 'badge-red' },
    seller: { label: 'Satici', badge: 'badge-green' },
    creator: { label: 'Icerik Uretici', badge: 'badge-purple' },
    buyer: { label: 'Alici', badge: 'badge-cyan' },
  };

  const role = roleMap[profile.role] || roleMap.buyer;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="btn btn-ghost btn-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-heading"><span className="text-gradient">Kullanici Detayi</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="neo rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || 'User'} className="w-16 h-16 rounded-xl neo-inset-sm object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-xl neo-inset flex items-center justify-center text-2xl font-bold text-[var(--neon-cyan)]">
                {(profile.full_name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{profile.full_name || 'Isimsiz Kullanici'}</h2>
              <p className="text-xs font-mono-accent text-[var(--text-ghost)]">{profile.id.slice(0, 12)}...</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="terminal-label text-[0.6rem]">ROL</span>
              <div className="mt-1">
                <span className={`badge ${role.badge}`}>{role.label}</span>
              </div>
              <form action={async (formData: FormData) => {
                'use server';
                const newRole = formData.get('role') as string;
                await updateUserRole(profile.id, newRole);
              }} className="mt-2 flex gap-2">
                <select name="role" defaultValue={profile.role} className="input text-xs py-1.5 px-2">
                  <option value="buyer">Alici</option>
                  <option value="seller">Satici</option>
                  <option value="creator">Icerik Uretici</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="btn btn-sm btn-primary">Degistir</button>
              </form>
            </div>

            <div>
              <span className="terminal-label text-[0.6rem]">KYC DURUMU</span>
              <form action={async (formData: FormData) => {
                'use server';
                const status = formData.get('kyc_status') as string;
                await updateKycStatus(profile.id, status);
              }} className="mt-2 flex gap-2">
                <select name="kyc_status" defaultValue={profile.kyc_status || 'pending'} className="input text-xs py-1.5 px-2">
                  <option value="pending">Bekliyor</option>
                  <option value="verified">Dogrulandi</option>
                  <option value="rejected">Reddedildi</option>
                </select>
                <button type="submit" className="btn btn-sm btn-primary">Guncelle</button>
              </form>
            </div>

            <div>
              <span className="terminal-label text-[0.6rem]">KAYIT TARIHI</span>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {new Date(profile.created_at || profile.updated_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="neo rounded-xl p-6">
          <h3 className="terminal-label mb-4">// SON SIPARISLER</h3>
          {orders && orders.length > 0 ? (
            <div className="space-y-2">
              {orders.map((order: any) => (
                <div key={order.id} className="neo-flat rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono-accent text-[var(--text-ghost)]">{order.id.slice(0, 8)}</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold stat-number text-[var(--text-primary)]">
                      {parseFloat(order.total_amount).toFixed(2)} {order.currency}
                    </div>
                    <div className={`badge mt-1 ${order.status === 'completed' ? 'badge-green' : order.status === 'cancelled' ? 'badge-red' : 'badge-amber'}`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-ghost)]">Siparis bulunamadi</p>
          )}
        </div>

        {/* Products */}
        <div className="neo rounded-xl p-6">
          <h3 className="terminal-label mb-4">// URUNLER</h3>
          {products && products.length > 0 ? (
            <div className="space-y-2">
              {products.map((product: any) => (
                <div key={product.id} className="neo-flat rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{product.title}</div>
                    <div className="text-xs text-[var(--text-ghost)] mt-0.5">
                      {new Date(product.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div className={`badge ${product.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                    {product.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-ghost)]">Urun bulunamadi</p>
          )}
        </div>
      </div>
    </div>
  );
}
