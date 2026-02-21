import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/admin/users');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') redirect('/');

  const { data: users } = await supabase.from('profiles').select('*').order('updated_at', { ascending: false });

  const buyers = users?.filter(u => u.role === 'buyer') || [];
  const sellers = users?.filter(u => u.role === 'seller') || [];
  const creators = users?.filter(u => u.role === 'creator') || [];
  const admins = users?.filter(u => u.role === 'admin') || [];

  const roleMap: Record<string, { label: string; badge: string }> = {
    admin: { label: 'Admin', badge: 'badge-red' },
    seller: { label: 'Satici', badge: 'badge-green' },
    creator: { label: 'Icerik Uretici', badge: 'badge-purple' },
    buyer: { label: 'Alici', badge: 'badge-cyan' },
  };

  const kycMap: Record<string, { label: string; badge: string }> = {
    verified: { label: 'Dogrulandi', badge: 'badge-green' },
    rejected: { label: 'Reddedildi', badge: 'badge-red' },
    pending: { label: 'Bekliyor', badge: 'badge-amber' },
  };

  const stats = [
    { label: 'ALICILAR', value: buyers.length, color: 'var(--neon-cyan)' },
    { label: 'SATICILAR', value: sellers.length, color: 'var(--neon-green)' },
    { label: 'ICERIK URETICILER', value: creators.length, color: 'var(--neon-purple)' },
    { label: 'ADMINLER', value: admins.length, color: 'var(--neon-red)' },
  ];

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-heading"><span className="text-gradient">Kullanici Yonetimi</span></h1>
          <Link href="/admin" className="btn btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Admin Paneli
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="neo rounded-xl p-5">
              <div className="terminal-label text-[0.6rem] mb-2" style={{ color: stat.color }}>{stat.label}</div>
              <div className="text-3xl font-bold stat-number text-[var(--text-primary)]">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* User Table */}
        <div className="neo rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="px-5 py-4 text-left terminal-label text-[0.6rem]">// KULLANICI</th>
                  <th className="px-5 py-4 text-left terminal-label text-[0.6rem]">// ROL</th>
                  <th className="px-5 py-4 text-left terminal-label text-[0.6rem]">// KYC DURUMU</th>
                  <th className="px-5 py-4 text-left terminal-label text-[0.6rem]">// TARIH</th>
                  <th className="px-5 py-4 text-left terminal-label text-[0.6rem]">// ISLEM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {users?.map((u: any) => {
                  const role = roleMap[u.role] || roleMap.buyer;
                  const kyc = kycMap[u.kyc_status] || kycMap.pending;
                  return (
                    <tr key={u.id} className="hover:bg-[var(--surface)] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.full_name || 'User'} className="w-9 h-9 rounded-lg neo-inset-sm object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg neo-inset-sm flex items-center justify-center text-sm font-bold text-[var(--neon-cyan)]">
                              {(u.full_name || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-[var(--text-primary)]">{u.full_name || 'Isimsiz Kullanici'}</div>
                            <div className="text-[0.65rem] font-mono-accent text-[var(--text-ghost)]">{u.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${role.badge}`}>{role.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${kyc.badge}`}>{kyc.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-[var(--text-ghost)]">
                          {new Date(u.updated_at).toLocaleDateString('tr-TR')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="btn btn-sm btn-primary">Detaylar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {(!users || users.length === 0) && (
            <div className="p-10 text-center">
              <p className="text-sm text-[var(--text-ghost)]">Henuz kullanici bulunamadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
