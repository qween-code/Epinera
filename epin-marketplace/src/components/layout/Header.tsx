'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CartButton from '@/components/cart/CartButton';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
          Epin Marketplace
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/search" className="hover:text-blue-400 transition-colors">Ara</Link>
          <Link href="/categories" className="hover:text-blue-400 transition-colors">Kategoriler</Link>
          {user && (
            <>
              <Link href="/seller/dashboard" className="hover:text-blue-400 transition-colors">
                Satıcı Paneli
              </Link>
              <Link href="/orders" className="hover:text-blue-400 transition-colors">
                Siparişlerim
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <CartButton />
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Çıkış
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
