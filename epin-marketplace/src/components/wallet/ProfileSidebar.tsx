'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProfileSidebarProps {
  userName?: string;
  userEmail?: string;
  isVerified?: boolean;
  avatarUrl?: string;
}

export default function ProfileSidebar({ userName = 'User', userEmail, isVerified = false, avatarUrl }: ProfileSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/wallet', label: 'Dashboard & Wallet', icon: 'account_balance_wallet', active: pathname === '/wallet' },
    { href: '/wallet/history', label: 'Transaction History', icon: 'history', active: pathname === '/wallet/history' },
    { href: '/profile/settings', label: 'Profile Settings', icon: 'settings', active: pathname === '/profile/settings' },
    { href: '/profile/security', label: 'Security', icon: 'shield', active: pathname === '/profile/security' },
    { href: '/support', label: 'Support', icon: 'support_agent', active: pathname === '/support' },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#101d23] p-4 sticky top-0">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            data-alt={`${userName}'s profile picture`}
            style={{
              backgroundImage: avatarUrl || 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + userName + '")',
            }}
          />
          <div className="flex flex-col">
            <h1 className="text-white text-base font-medium leading-normal">{userName}</h1>
            {isVerified && <p className="text-green-400 text-sm font-normal leading-normal">Verified User</p>}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? 'bg-primary/20 text-primary'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span
                className={`material-symbols-outlined ${item.active ? 'text-primary' : 'icon-regular'}`}
                style={{ fontSize: '24px' }}
              >
                {item.icon}
              </span>
              <p className="text-sm font-medium leading-normal">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined icon-regular" style={{ fontSize: '24px' }}>
            logout
          </span>
          <p className="text-sm font-medium leading-normal">Logout</p>
        </Link>
      </div>
    </aside>
  );
}

