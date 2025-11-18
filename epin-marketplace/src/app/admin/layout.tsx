'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=' + pathname);
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role')
        .eq('id', user.id)
        .single();

      if (profileData && profileData.role !== 'admin') {
        router.push('/');
        return;
      }

      setProfile(profileData);
    };

    fetchProfile();
  }, [supabase, router, pathname]);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/users', label: 'User Management', icon: 'group' },
    { href: '/admin/transactions', label: 'Transactions', icon: 'receipt_long' },
    { href: '/admin/financial', label: 'Financial Reporting', icon: 'monitoring' },
    { href: '/admin/content', label: 'Content Moderation', icon: 'folder' },
    { href: '/admin/system', label: 'System Health', icon: 'cardiology' },
    { href: '/admin/security', label: 'Security Center', icon: 'security' },
    { href: '/admin/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="flex h-screen w-full">
      <aside className="flex w-64 flex-col bg-white/5 dark:bg-black/20 p-4 font-display">
        <div className="flex shrink-0 items-center gap-4 px-3 py-3 text-white">
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-black dark:text-white">
            Marketplace Admin
          </h2>
        </div>
        <div className="flex h-full flex-col justify-between">
          <div className="mt-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-primary dark:bg-primary/30'
                      : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <p className="text-sm font-medium leading-normal">{item.label}</p>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col">
            {profile && (
              <div className="flex items-center gap-3 p-3">
                <div
                  className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat"
                  data-alt="Admin avatar"
                  style={{
                    backgroundImage: profile.avatar_url
                      ? `url('${profile.avatar_url}')`
                      : 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=admin")',
                  }}
                ></div>
                <div className="flex flex-col">
                  <h1 className="text-base font-medium leading-normal text-black dark:text-white">
                    {profile.full_name || 'Admin'}
                  </h1>
                  <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">Super Admin</p>
                </div>
              </div>
            )}
            <Link
              href="/auth/signout"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10"
            >
              <span className="material-symbols-outlined">logout</span>
              <p className="text-sm font-medium leading-normal">Logout</p>
            </Link>
          </div>
        </div>
      </aside>
      {children}
    </div>
  );
}
