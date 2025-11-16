import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin/users');
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

  // Fetch all users
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
  }

  const buyers = users?.filter(u => u.role === 'buyer') || [];
  const sellers = users?.filter(u => u.role === 'seller') || [];
  const creators = users?.filter(u => u.role === 'creator') || [];
  const admins = users?.filter(u => u.role === 'admin') || [];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Admin Paneline Dön
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Alıcılar</div>
            <div className="text-3xl font-bold text-blue-400">{buyers.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Satıcılar</div>
            <div className="text-3xl font-bold text-green-400">{sellers.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">İçerik Üreticiler</div>
            <div className="text-3xl font-bold text-purple-400">{creators.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Adminler</div>
            <div className="text-3xl font-bold text-red-400">{admins.length}</div>
          </div>
        </div>

        {/* User List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kullanıcı</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rol</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">KYC Durumu</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kayıt Tarihi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name || 'User'}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                            {(user.full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{user.full_name || 'İsimsiz Kullanıcı'}</div>
                          <div className="text-sm text-gray-400">{user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === 'admin' ? 'bg-red-900 text-red-300' :
                        user.role === 'seller' ? 'bg-green-900 text-green-300' :
                        user.role === 'creator' ? 'bg-purple-900 text-purple-300' :
                        'bg-blue-900 text-blue-300'
                      }`}>
                        {user.role === 'admin' && 'Admin'}
                        {user.role === 'seller' && 'Satıcı'}
                        {user.role === 'creator' && 'İçerik Üretici'}
                        {user.role === 'buyer' && 'Alıcı'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.kyc_status === 'verified' ? 'bg-green-900 text-green-300' :
                        user.kyc_status === 'rejected' ? 'bg-red-900 text-red-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {user.kyc_status === 'verified' && '✓ Doğrulandı'}
                        {user.kyc_status === 'rejected' && '✗ Reddedildi'}
                        {user.kyc_status === 'pending' && '⏳ Bekliyor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.updated_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                        Detaylar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
