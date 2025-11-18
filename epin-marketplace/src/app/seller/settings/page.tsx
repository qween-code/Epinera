'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StoreSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState({
    name: 'GameDen',
    description: 'Your one-stop shop for the best digital game keys and epins. Instant delivery and 24/7 support.',
    logoUrl: '',
  });
  const [notifications, setNotifications] = useState({
    newSales: true,
    customerMessages: true,
    productReviews: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push('/login?redirect=/seller/settings');
          return;
        }

        setUser(currentUser);

        // Fetch store/profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, bio')
          .eq('id', currentUser.id)
          .single();

        if (profile) {
          setStoreData({
            name: profile.full_name || 'GameDen',
            description: profile.bio || storeData.description,
            logoUrl: profile.avatar_url || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Save settings', { storeData, notifications });
    alert('Settings saved!');
  };

  const handleLogoUpload = () => {
    // TODO: Implement logo upload
    console.log('Upload logo');
  };

  const handleLogoRemove = () => {
    setStoreData({ ...storeData, logoUrl: '' });
  };

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-black dark:text-white/50">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-6 sm:px-10 py-3 sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 text-black dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
          </Link>
          <Link href="/search" className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-slate-500 dark:text-slate-400 flex border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800/50 items-center justify-center pl-4 rounded-l-lg">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-l-0 border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800/50 h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-2 text-sm"
                placeholder="Search for products..."
                readOnly
              />
            </div>
          </Link>
        </div>
        <div className="flex flex-1 justify-end gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-6">
            <Link
              className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
              href="/seller/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
              href="/store"
            >
              My Store
            </Link>
            <Link
              className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
              href="/seller/products"
            >
              Listings
            </Link>
            <Link
              className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
              href="/seller/orders"
            >
              Orders
            </Link>
          </div>
          <div className="flex gap-2">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 gap-2 text-sm font-bold min-w-0 px-2.5 transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 gap-2 text-sm font-bold min-w-0 px-2.5 transition-colors">
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
            </button>
          </div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            data-alt="User avatar image"
            style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")' }}
          />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 shrink-0 p-4 sm:p-6 hidden lg:block sticky top-[68px] h-[calc(100vh-68px)]">
          <div className="flex h-full min-h-[700px] flex-col justify-between p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  data-alt="GameDen store logo"
                  style={{
                    backgroundImage: storeData.logoUrl || 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=store")',
                  }}
                />
                <div className="flex flex-col">
                  <h1 className="text-black dark:text-white text-base font-medium leading-normal">{storeData.name}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Seller Dashboard</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary transition-colors"
                  href="/seller/settings"
                >
                  <span className="material-symbols-outlined text-xl">storefront</span>
                  <p className="text-sm font-medium leading-normal">Profile</p>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  href="/seller/settings#notifications"
                >
                  <span className="material-symbols-outlined text-xl">notifications</span>
                  <p className="text-sm font-medium leading-normal">Notifications</p>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  href="/seller/policies"
                >
                  <span className="material-symbols-outlined text-xl">policy</span>
                  <p className="text-sm font-medium leading-normal">Policies</p>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  href="/seller/settings#security"
                >
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                  <p className="text-sm font-medium leading-normal">Security</p>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  href="/seller/settings#theme"
                >
                  <span className="material-symbols-outlined text-xl">palette</span>
                  <p className="text-sm font-medium leading-normal">Store Theme</p>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                href="/support"
              >
                <span className="material-symbols-outlined text-xl">help_outline</span>
                <p className="text-sm font-medium leading-normal">Support</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                href="/logout"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                <p className="text-sm font-medium leading-normal">Logout</p>
              </Link>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-black dark:text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Store Settings
            </h1>
            <button
              onClick={handleSave}
              className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-colors"
            >
          <span className="truncate">Save All Changes</span>
        </button>
      </div>
          <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Store Profile Section */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                Store Profile
              </h2>
        <div className="p-6 space-y-6">
                <div className="flex flex-col @container gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-4 items-center">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg min-h-24 w-24"
                      data-alt={`${storeData.name} store logo`}
                      style={{
                        backgroundImage: storeData.logoUrl || 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=store")',
                      }}
                    />
                    <div className="flex flex-col">
                      <p className="text-black dark:text-white text-lg font-bold">Store Logo</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">PNG, JPG, GIF. Max 5MB.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleLogoUpload}
                      className="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-black dark:text-white text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="truncate">Upload Image</span>
                    </button>
                    <button
                      onClick={handleLogoRemove}
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent text-red-500 text-sm font-bold hover:bg-red-500/10 transition-colors"
                    >
                      <span className="truncate">Remove</span>
                    </button>
                  </div>
                </div>
            <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="store-name">
                    Store Name
                  </label>
                  <input
                    className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent text-black dark:text-white focus:ring-primary focus:border-primary"
                    id="store-name"
                    type="text"
                    value={storeData.name}
                    onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  />
            </div>
            <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="store-description">
                    Store Description
                  </label>
                  <textarea
                    className="form-textarea w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent text-black dark:text-white focus:ring-primary focus:border-primary"
                    id="store-description"
                    rows={4}
                    value={storeData.description}
                    onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                Security
              </h2>
              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div>
                    <p className="text-primary font-bold">Verification Status: Tier 2 Verified</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      You can list up to 50 products. Upgrade for unlimited listings.
                    </p>
                  </div>
                  <button className="flex mt-3 md:mt-0 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-colors">
                    <span className="truncate">Upgrade to Tier 3</span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black dark:text-white font-medium">Two-Factor Authentication (2FA)</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Add an extra layer of security to your account.</p>
                  </div>
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-black dark:text-white text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                    <span className="truncate">Enable 2FA</span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black dark:text-white font-medium">Connected Wallet</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your Web3 wallet for blockchain-secured transactions.</p>
                  </div>
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-black dark:text-white text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                    <span className="truncate">Connect Wallet</span>
                  </button>
            </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                Notifications
              </h2>
        <div className="p-6 divide-y divide-slate-200 dark:divide-slate-800">
            <div className="flex items-center justify-between py-4">
                <div>
                    <p className="text-black dark:text-white font-medium">New Sales</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Get notified when you make a new sale.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.newSales}
                      onChange={(e) => setNotifications({ ...notifications, newSales: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-black dark:text-white font-medium">Customer Messages</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Receive alerts for new messages from customers.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.customerMessages}
                      onChange={(e) => setNotifications({ ...notifications, customerMessages: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-black dark:text-white font-medium">Product Reviews</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Get notified when a customer leaves a review.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.productReviews}
                      onChange={(e) => setNotifications({ ...notifications, productReviews: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                </label>
            </div>
        </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
