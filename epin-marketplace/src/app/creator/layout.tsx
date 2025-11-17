'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=' + pathname);
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
    };

    fetchUser();
  }, [supabase, router, pathname]);

  const navItems = [
    { href: '/creator', label: 'Dashboard', icon: 'dashboard' },
    { href: '/creator/campaigns', label: 'Campaigns', icon: 'campaign' },
    { href: '/creator/audience', label: 'Audience', icon: 'groups' },
    { href: '/creator/revenue', label: 'Revenue', icon: 'payments' },
    { href: '/creator/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <div className="flex h-full flex-1">
        {/* SideNavBar */}
        <aside className="flex w-64 flex-col gap-8 bg-background-light dark:bg-background-dark p-4 border-r border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <h1 className="text-black dark:text-white text-xl font-bold leading-normal">EpinMarket</h1>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: profile?.avatar_url
                    ? `url(${profile.avatar_url})`
                    : 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.id || 'user') + '")',
                }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-black dark:text-white text-base font-medium leading-normal">
                  {profile?.full_name || 'Creator'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">Content Creator</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href === '/creator' && pathname.startsWith('/creator') && pathname === '/creator');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'text-black dark:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <p className="text-sm font-medium leading-normal">{item.label}</p>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

