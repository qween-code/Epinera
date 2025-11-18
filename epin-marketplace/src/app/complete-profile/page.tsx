'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: true,
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Simulation']);
  const [isLoading, setIsLoading] = useState(false);

  const genres = ['RPG', 'FPS', 'Strategy', 'MOBA', 'Simulation', 'Sports', 'Indie', 'Adventure'];

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    // TODO: Save profile completion data to Supabase
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">stadia_controller</span>
          <span className="font-display text-xl font-bold text-gray-900 dark:text-white">Epin Marketplace</span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">
            Store
          </Link>
          <Link href="/community" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">
            Community
          </Link>
          <Link href="/publishers" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">
            Publishers
          </Link>
          <Link href="/brands" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">
            Brands
          </Link>
          <Link href="/cart" className="material-symbols-outlined text-gray-700 hover:text-primary dark:text-gray-300">
            shopping_cart
          </Link>
          <Link href="/dashboard" className="material-symbols-outlined text-gray-700 hover:text-primary dark:text-gray-300">
            account_circle
          </Link>
        </nav>
      </header>

      <main className="flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
        <div className="relative z-10 flex w-full max-w-4xl flex-col rounded-xl bg-white/50 p-6 shadow-2xl backdrop-blur-lg dark:bg-[#1A1C20]/50 sm:p-8">
          <div className="w-full">
            {/* Page Heading */}
            <div className="mb-6 flex flex-wrap justify-between gap-3 text-center sm:text-left">
              <div className="flex w-full flex-col gap-3 sm:w-auto">
                <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-800 dark:text-white">
                  Enhance Your Experience
                </p>
                <p className="text-base font-normal leading-normal text-slate-500 dark:text-[#90b8cb]">
                  Unlock personalized offers and build your community presence. You can always do this later from your settings.
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 flex flex-col gap-3">
              <div className="flex justify-between gap-6">
                <p className="text-base font-medium leading-normal text-black dark:text-white">Profile 60% Complete</p>
              </div>
              <div className="h-2 rounded-full bg-gray-300 dark:bg-[#315768]">
                <div className="h-2 rounded-full bg-primary transition-all" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {/* Show Who You Are */}
              <section>
                <h2 className="border-b border-gray-200 px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-black dark:border-b-[#223d49] dark:text-white">
                  Show Who You Are
                </h2>
                <div className="mt-4 flex p-4">
                  <div className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="flex items-center gap-4">
                      <div className="flex h-24 w-24 min-h-24 items-center justify-center rounded-full bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                        <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                          person
                        </span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-black dark:text-white">
                          Upload a Profile Photo
                        </p>
                        <p className="text-base font-normal leading-normal text-gray-500 dark:text-[#90b8cb]">
                          Let others recognize you.
                        </p>
                      </div>
                    </div>
                    <button className="flex h-10 min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200 px-4 text-sm font-bold leading-normal tracking-[0.015em] text-black transition-colors hover:bg-gray-300 dark:bg-[#223d49] dark:text-white dark:hover:bg-primary/20 sm:w-auto">
                      <span className="truncate">Upload</span>
                    </button>
                  </div>
                </div>
                <div className="mt-2 p-4">
                  <p className="mb-4 font-bold text-black dark:text-white">Connect your accounts</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-[#5865F2] p-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                      <svg className="h-5 w-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6667 1.2882-2.058-.2977-4.2262-.2977-6.2842 0-.2203-.4637-.4557-.9129-.6667-1.2882a.077.077 0 00-.0785-.0371A19.8186 19.8186 0 003.6831 4.3698a.077.077 0 00-.0371.0785v11.5833a16.4913 16.4913 0 005.0615 2.511.077.077 0 00.0864-.0215c.4217-.4217.8184-.871 1.189-1.3425a.077.077 0 00-.0128-.1025c-.2436-.1455-.4745-.3033-.6925-.4745a.077.077 0 00-.0864-.0043c-.9328.5328-1.8344.97-2.6953 1.272-.2542.0864-.5127.151-.767.2076v-1.1848a.077.077 0 00.0043-.017c.0128-.0215.0215-.043.0343-.0645.0128-.017.0256-.0343.043-.0512.0043-.0043.0043-.0043.0043-.0043l.0043-.0043a.077.077 0 00.0128-.017c.0043-.0043.0086-.0128.0128-.017.0128-.0128.0215-.0215.0343-.0343a.077.077 0 00.0256-.0215c.0128-.0128.0256-.0215.0343-.0343.017-.0128.0343-.0256.0512-.0343.0043-.0043.0086-.0086.0128-.0128.017-.0128.03-.0215.0472-.03.017-.0086.0343-.017.0512-.0215l.0043-.0043a.077.077 0 00.0215-.0086c.017-.0086.0343-.0128.0512-.017.0215-.0086.043-.017.0645-.0215.017-.0043.0343-.0086.0512-.0128.0215-.0043.043-.0086.0645-.0128.0215-.0043.043-.0043.0645-.0086.017-.0043.0343-.0043.0512-.0086.0215-.0043.043-.0043.0645-.0086.0215-.0043.043-.0043.0645-.0043.0215-.0043.043-.0043.0645-.0043.0215 0 .043.0043.0645.0043s.043.0043.0645.0043c.0215.0043.043.0043.0645.0043.0215.0043.043.0043.0645.0086.017.0043.0343.0043.0512.0086.0215.0043.043.0043.0645.0086.0215.0043.043.0086.0645.0128.017.0043.0343.0086.0512.0128.0215.0043.043.0086.0645.0128.017.0043.0343.0128.0512.017.0215.0086.043.0128.0645.0215.017.0043.0343.0128.0512.017.0128.0086.03.017.0472.03.017.0086.0343.017.0512.0256.0043.0043.0086.0086.0128.0128.017.0128.0343.0215.0512.0343.0128.0128.0256.0215.0343.0343a.077.077 0 00.0256.0215c.0128.0128.0215.0215.0343.0343.0086.0086.017.0215.0256.03.0086.0128.017.0256.0215.0386l.0043.0043a.077.077 0 00.0128.017c.0043.0043.0086.0086.0128.0128.0086.0128.017.0215.0256.0343.0086.0128.0128.0256.017.0386v.0043a.077.077 0 00.0043.0128c-.218.1709-.4488.3286-.6925.4745a.077.077 0 00-.0864.0043c.3707.4715.7674.9207 1.189 1.3425a.077.077 0 00.0864.0215 16.4913 16.4913 0 005.0615-2.511V4.4483a.077.077 0 00-.0371-.0785zM8.021 15.3312c-.9414 0-1.7042-1.0125-1.7042-2.2625s.7628-2.2625 1.7042-2.2625c.9499 0 1.7127 1.0125 1.7042 2.2625.0086 1.25-.7628 2.2625-1.7042 2.2625zm7.958 0c-.9414 0-1.7042-1.0125-1.7042-2.2625s.7628-2.2625 1.7042-2.2625c.9499 0 1.7127 1.0125 1.7042 2.2625.0086 1.25-.7543 2.2625-1.7042 2.2625z" fill="currentColor"></path>
                      </svg>
                      <span>Discord</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-black p-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                      </svg>
                      <span>X</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-[#171a21] p-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
                      </svg>
                      <span>Steam</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-[#9146FF] p-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"></path>
                      </svg>
                      <span>Twitch</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Referral Code */}
              <section>
                <h2 className="border-b border-gray-200 px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-black dark:border-b-[#223d49] dark:text-white">
                  Have a Referral Code?
                </h2>
                <div className="mt-4 flex gap-3 p-4">
                  <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900/50">
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">info</span>
                    <input
                      type="text"
                      placeholder="Enter referral code"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white dark:placeholder:text-gray-500"
                    />
                  </div>
                  <button className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200 px-4 text-sm font-bold leading-normal tracking-[0.015em] text-black transition-colors hover:bg-gray-300 dark:bg-[#223d49] dark:text-white dark:hover:bg-primary/20">
                    <span className="truncate">Apply Code</span>
                  </button>
                </div>
              </section>

              {/* Notification Preferences */}
              <section>
                <h2 className="border-b border-gray-200 px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-black dark:border-b-[#223d49] dark:text-white">
                  Notification Preferences
                </h2>
                <div className="mt-4 space-y-4 p-4">
                  {[
                    { key: 'email', label: 'Email Notifications' },
                    { key: 'push', label: 'Push Notifications' },
                    { key: 'sms', label: 'SMS Alerts' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-base font-medium text-black dark:text-white">{label}</span>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))
                        }
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          notifications[key as keyof typeof notifications] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            notifications[key as keyof typeof notifications] ? 'translate-x-5' : ''
                          }`}
                        ></span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Game Preferences */}
              <section>
                <h2 className="border-b border-gray-200 px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-black dark:border-b-[#223d49] dark:text-white">
                  What Games Do You Love?
                </h2>
                <p className="mt-2 px-4 text-sm text-gray-500 dark:text-[#90b8cb]">
                  Select your favorite genres to get personalized recommendations.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 p-4">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selectedGenres.includes(genre)
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#223d49] dark:text-gray-300 dark:hover:bg-[#2a4554]'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400"
              >
                Skip for Now
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex h-12 min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-base font-bold leading-normal tracking-[0.015em] text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
