'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorMethods, setTwoFactorMethods] = useState({
    authenticator: false,
    sms: false,
    biometric: false,
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push('/login?redirect=/2fa');
          return;
        }

        setUser(currentUser);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        setProfile(profileData);

        // Check existing 2FA methods
        if (profileData?.metadata?.two_factor) {
          setTwoFactorMethods(profileData.metadata.two_factor);
        }
      } catch (error) {
        console.error('Error fetching 2FA data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  const handleEnable2FA = async (method: 'authenticator' | 'sms' | 'biometric') => {
    if (!user) return;

    try {
      const updatedMethods = { ...twoFactorMethods, [method]: true };

      const { error } = await supabase
        .from('profiles')
        .update({
          metadata: {
            ...profile?.metadata,
            two_factor: updatedMethods,
          },
        })
        .eq('id', user.id);

      if (error) throw error;

      setTwoFactorMethods(updatedMethods);
      setProfile((prev: any) => ({
        ...prev,
        metadata: { ...prev?.metadata, two_factor: updatedMethods },
      }));
    } catch (error) {
      console.error('Error enabling 2FA:', error);
    }
  };

  const hasAny2FAEnabled = twoFactorMethods.authenticator || twoFactorMethods.sms || twoFactorMethods.biometric;

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* TopNavBar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-4 sm:px-10 lg:px-20 py-3 bg-background-light dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4 text-slate-800 dark:text-white">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
            </div>
            <div className="hidden md:flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <Link className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium leading-normal" href="/">
                  Dashboard
                </Link>
                <Link className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium leading-normal" href="/products">
                  Marketplace
                </Link>
                <Link className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium leading-normal" href="/wallet">
                  My Wallet
                </Link>
                <Link className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium leading-normal" href="/community">
                  Community
                </Link>
              </div>
              <div className="flex gap-2">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Upload</span>
                </button>
                <Link
                  href="/notifications"
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-200 dark:bg-slate-800/60 text-slate-800 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                >
                  <span className="material-symbols-outlined text-xl">notifications</span>
                </Link>
              </div>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt="User profile picture"
                style={{
                  backgroundImage: profile?.avatar_url
                    ? `url('${profile.avatar_url}')`
                    : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAXbRWQ_jDvYnqjMtzGTk9rLSUxaF_Ezi2aQ7ZTv0MpgSKPb95friaOHKdPi_CGBb46gIfehaNPvQ0wBZ5U8v6NVD9pPe6yDkizmftDJZQzylAuatGeVPS5PT3K6JrJXPQ7sxW5wK7YlcPUy_XOSjxkRAYSj6obgrKe_ciz6DL59GfaRWBN5htQpfvkXb4D7uU8-x2y_XlSiktNvYA5DROo9sXqVCXiMFMutqLyw2E30qLYDRppRRcOB-bsXrNIDxq1aXwbJffqUa7_")',
                }}
              />
            </div>
            <button className="md:hidden flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-200 dark:bg-slate-800/60 text-slate-800 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
          </header>
          <main className="px-4 sm:px-10 lg:px-20 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap gap-2 p-4">
                <Link className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm sm:text-base font-medium leading-normal" href="/wallet">
                  Settings
                </Link>
                <span className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium leading-normal">/</span>
                <Link className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm sm:text-base font-medium leading-normal" href="/wallet">
                  Security
                </Link>
                <span className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium leading-normal">/</span>
                <span className="text-slate-800 dark:text-white text-sm sm:text-base font-medium leading-normal">2FA / Biometric Authentication</span>
              </div>
              {/* PageHeading */}
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
                    Two-Factor Authentication (2FA)
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
                    Add an extra layer of security to your account. Once configured, you'll be required to enter both your password and an authentication code from your device.
                  </p>
                </div>
              </div>
              {/* ActionPanel / Status Banner */}
              <div className="p-4 @container">
                <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-lg border border-orange-500/30 dark:border-orange-400/30 bg-orange-500/10 dark:bg-orange-400/10 p-5 @[480px]:flex-row @[480px]:items-center">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-3xl text-orange-500 dark:text-orange-400">warning</span>
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">Your Account is Not Protected</p>
                      <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
                        Enable Two-Factor Authentication to secure your account from unauthorized access.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEnable2FA('authenticator')}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary text-white text-sm font-medium leading-normal"
                  >
                    <span className="truncate">Enable 2FA</span>
                  </button>
                </div>
              </div>
              {/* List of Methods */}
              <div className="p-4 flex flex-col gap-4">
                {/* Authenticator App */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-transparent dark:bg-transparent px-4 min-h-[72px] py-4 justify-between border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-900 dark:text-white flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 size-12">
                      <span className="material-symbols-outlined">qr_code_scanner</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">Authenticator App</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2">
                        Use an app like Google Authenticator or Authy for the most secure verification.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                      {twoFactorMethods.authenticator ? 'Configured' : 'Not Configured'}
                    </span>
                    <button
                      onClick={() => handleEnable2FA('authenticator')}
                      className="flex w-full sm:w-fit min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-slate-300 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium leading-normal"
                    >
                      <span className="truncate">{twoFactorMethods.authenticator ? 'Disable' : 'Enable'}</span>
                    </button>
                  </div>
                </div>
                {/* SMS Verification */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-transparent dark:bg-transparent px-4 min-h-[72px] py-4 justify-between border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-900 dark:text-white flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 size-12">
                      <span className="material-symbols-outlined">sms</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">SMS Verification</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2">
                        Receive a unique security code via text message to your phone.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                      {twoFactorMethods.sms ? 'Configured' : 'Not Configured'}
                    </span>
                    <button
                      onClick={() => handleEnable2FA('sms')}
                      className="flex w-full sm:w-fit min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-slate-300 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium leading-normal"
                    >
                      <span className="truncate">{twoFactorMethods.sms ? 'Disable' : 'Enable'}</span>
                    </button>
                  </div>
                </div>
                {/* Biometric / Security Key */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-transparent dark:bg-transparent px-4 min-h-[72px] py-4 justify-between border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-900 dark:text-white flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 size-12">
                      <span className="material-symbols-outlined">fingerprint</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1">Biometric or Security Key</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2">
                        Use your device's fingerprint, face ID, or a physical security key (WebAuthn).
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                      {twoFactorMethods.biometric ? 'Configured' : 'Not Configured'}
                    </span>
                    <button
                      onClick={() => handleEnable2FA('biometric')}
                      className="flex w-full sm:w-fit min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-slate-300 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium leading-normal"
                    >
                      <span className="truncate">{twoFactorMethods.biometric ? 'Disable' : 'Enable'}</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Recovery Codes Section */}
              <div className="p-4 mt-8">
                <div className="flex flex-col gap-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-background-dark p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-slate-900 dark:text-white flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 size-12">
                      <span className="material-symbols-outlined">key</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Recovery Codes</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
                        Save these codes in a safe place. They can be used to access your account if you lose access to your 2FA device.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 dark:text-slate-500 text-sm">
                      You must enable at least one 2FA method to generate recovery codes.
                    </p>
                    <button
                      disabled={!hasAny2FAEnabled}
                      className="flex w-full sm:w-fit min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal bg-slate-200 dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="truncate">Generate Codes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

