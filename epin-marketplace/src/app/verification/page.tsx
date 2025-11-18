'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerificationPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(60);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set(['RPG', 'Simulation', 'Adventure']));
  const [referralCode, setReferralCode] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push('/login?redirect=/verification');
          return;
        }

        setUser(currentUser);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        setProfile(profileData);

        // Calculate profile completion
        let complete = 0;
        if (profileData?.full_name) complete += 20;
        if (profileData?.avatar_url) complete += 20;
        if (profileData?.phone) complete += 20;
        if (profileData?.metadata?.social_connections) complete += 20;
        if (profileData?.metadata?.preferred_genres?.length > 0) complete += 20;
        setProfileComplete(complete);
      } catch (error) {
        console.error('Error fetching verification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleSocialConnect = async (platform: string) => {
    // Social media connection logic
    console.log(`Connecting ${platform}...`);
  };

  const handleApplyReferralCode = async () => {
    if (!referralCode || !user) return;

    try {
      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referralCode, // This would need to be a user ID lookup
          referred_id: user.id,
        });

      if (error) throw error;
      alert('Referral code applied successfully!');
    } catch (error) {
      console.error('Error applying referral code:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          metadata: {
            notification_preferences: {
              email: emailNotifications,
              push: pushNotifications,
              sms: smsAlerts,
            },
            preferred_genres: Array.from(selectedGenres),
          },
        })
        .eq('id', user.id);

      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Error saving verification data:', error);
    }
  };

  const genres = ['RPG', 'FPS', 'Strategy', 'MOBA', 'Simulation', 'Sports', 'Indie', 'Adventure'];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* TopNavBar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 dark:border-b-[#223d49] px-4 sm:px-10 py-3 fixed top-0 left-0 right-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 text-black dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fillOpacity="0.7"
                />
                <path
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="/products">
                Store
              </Link>
              <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="/community">
                Community
              </Link>
              <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="/publishers">
                Publishers
              </Link>
              <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="/brands">
                Brands
              </Link>
            </div>
            <div className="flex gap-2">
              <Link
                href="/notifications"
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-200 dark:bg-[#223d49] text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-primary/20 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
              >
                <span className="material-symbols-outlined">notifications</span>
              </Link>
              <Link
                href="/cart"
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-200 dark:bg-[#223d49] text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-primary/20 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
              </Link>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User avatar placeholder"
              style={{
                backgroundImage: profile?.avatar_url
                  ? `url('${profile.avatar_url}')`
                  : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDa5ob4HKUk25Vo4YR04eFZFWHUhN1v5o8q3N6o7KFnEAuqoR9mr3oMVipCbMXGjN8hHTS5qVSO2VMyVVkTxy_MGinyCpdZqbKm3BvP6qy9NNAA8vmYq4ix7SOrWwKp0JNKAaIt0WGdNr20NWpwwU0lpLWWi11rZ5CG2uTEF4DIgfcYAWWJub9uSL7sKY7yTWZQfBMIHfjn03buBgZV-8T_KtnOuDcd6C4mc1gbCLxb0RUmlFzKOYZR4crtuoCxXSoknnY7-AIvcig")',
              }}
            />
          </div>
          <button className="md:hidden flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-200 dark:bg-[#223d49] text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-primary/20 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>
        <main className="flex flex-1 justify-center py-5 px-4 sm:px-10 lg:px-40 mt-16">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="bg-gray-100 dark:bg-[#101d23] rounded-xl shadow-lg p-6 sm:p-10 my-8 w-full">
              {/* PageHeading */}
              <div className="flex flex-wrap justify-between gap-3 mb-6">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                    Enhance Your Experience
                  </p>
                  <p className="text-gray-500 dark:text-[#90b8cb] text-base font-normal leading-normal">
                    Unlock personalized offers and build your community presence. You can always do this later from your settings.
                  </p>
                </div>
              </div>
              {/* ProgressBar */}
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex gap-6 justify-between">
                  <p className="text-black dark:text-white text-base font-medium leading-normal">Profile {profileComplete}% Complete</p>
                </div>
                <div className="rounded-full bg-gray-300 dark:bg-[#315768]">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${profileComplete}%` }}></div>
                </div>
              </div>
              {/* Section 1: Profile Identity */}
              <section className="mb-10">
                {/* SectionHeader */}
                <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-b border-gray-200 dark:border-b-[#223d49]">
                  Show Who You Are
                </h2>
                {/* ProfileHeader */}
                <div className="flex p-4 @container mt-4">
                  <div className="flex w-full flex-col gap-6 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                    <div className="flex gap-4 items-center">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-24 w-24 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400"
                        data-alt="User avatar placeholder icon"
                        style={{
                          backgroundImage: profile?.avatar_url ? `url('${profile.avatar_url}')` : undefined,
                        }}
                      >
                        {!profile?.avatar_url && <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>person</span>}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Upload a Profile Photo</p>
                        <p className="text-gray-500 dark:text-[#90b8cb] text-base font-normal leading-normal">Let others recognize you.</p>
                      </div>
                    </div>
                    <label className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#223d49] text-black dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-primary/20 w-full max-w-[480px] @[480px]:w-auto">
                      <span className="truncate">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} />
                    </label>
                  </div>
                </div>
                {/* Social Media Connection */}
                <div className="p-4 mt-2">
                  <p className="text-black dark:text-white font-bold mb-4">Connect your accounts</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <button
                      onClick={() => handleSocialConnect('discord')}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#5865F2] text-white font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      <svg className="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <title>Discord</title>
                        <path
                          d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6667 1.2882-2.058-.2977-4.2262-.2977-6.2842 0-.2203-.4637-.4557-.9129-.6667-1.2882a.077.077 0 00-.0785-.0371A19.8186 19.8186 0 003.6831 4.3698a.077.077 0 00-.0371.0785v11.5833a16.4913 16.4913 0 005.0615 2.511.077.077 0 00.0864-.0215c.4217-.4217.8184-.871 1.189-1.3425a.077.077 0 00-.0128-.1025c-.2436-.1455-.4745-.3033-.6925-.4745a.077.077 0 00-.0864-.0043c-.9328.5328-1.8344.97-2.6953 1.272-.2542.0864-.5127.151-.767.2076v-1.1848a.077.077 0 00.0043-.017c.0128-.0215.0215-.043.0343-.0645.0128-.017.0256-.0343.043-.0512.0043-.0043.0043-.0043.0043-.0043l.0043-.0043a.077.077 0 00.0128-.017c.0043-.0043.0086-.0128.0128-.017.0128-.0128.0215-.0215.0343-.0343a.077.077 0 00.0256-.0215c.0128-.0128.0256-.0215.0343-.0343.017-.0128.0343-.0256.0512-.0343.0043-.0043.0086-.0086.0128-.0128.017-.0128.03-.0215.0472-.03.017-.0086.0343-.017.0512-.0215l.0043-.0043a.077.077 0 00.0215-.0086c.017-.0086.0343-.0128.0512-.017.0215-.0086.043-.017.0645-.0215.017-.0043.0343-.0086.0512-.0128.0215-.0043.043-.0086.0645-.0128.0215-.0043.043-.0043.0645-.0086.017-.0043.0343-.0043.0512-.0086.0215-.0043.043-.0043.0645-.0086.0215-.0043.043-.0043.0645-.0043.0215-.0043.043-.0043.0645-.0043.0215 0 .043.0043.0645.0043s.043.0043.0645.0043c.0215.0043.043.0043.0645.0043.0215.0043.043.0043.0645.0086.017.0043.0343.0043.0512.0086.0215.0043.043.0043.0645.0086.0215.0043.043.0086.0645.0128.017.0043.0343.0086.0512.0128.0215.0043.043.0086.0645.0128.017.0043.0343.0128.0512.017.0215.0086.043.0128.0645.0215.017.0043.0343.0128.0512.017.0128.0086.03.017.0472.03.017.0086.0343.017.0512.0256.0043.0043.0086.0086.0128.0128.017.0128.0343.0215.0512.0343.0128.0128.0256.0215.0343.0343a.077.077 0 00.0256.0215c.0128.0128.0215.0215.0343.0343.0086.0086.017.0215.0256.03.0086.0128.017.0256.0215.0386l.0043.0043a.077.077 0 00.0128.017c.0043.0043.0086.0086.0128.0128.0086.0128.017.0215.0256.0343.0086.0128.0128.0256.017.0386v.0043a.077.077 0 00.0043.0128c-.218.1709-.4488.3286-.6925.4745a.077.077 0 00-.0864.0043c.3707.4715.7674.9207 1.189 1.3425a.077.077 0 00.0864.0215 16.4913 16.4913 0 005.0615-2.511V4.4483a.077.077 0 00-.0371-.0785zM8.021 15.3312c-.9414 0-1.7042-1.0125-1.7042-2.2625s.7628-2.2625 1.7042-2.2625c.9499 0 1.7127 1.0125 1.7042 2.2625.0086 1.25-.7628 2.2625-1.7042 2.2625zm7.958 0c-.9414 0-1.7042-1.0125-1.7042-2.2625s.7628-2.2625 1.7042-2.2625c.9499 0 1.7127 1.0125 1.7042 2.2625.0086 1.25-.7543 2.2625-1.7042 2.2625z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>Discord</span>
                    </button>
                    <button
                      onClick={() => handleSocialConnect('x')}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1DA1F2] text-white font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      <svg className="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <title>X</title>
                        <path
                          d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>X</span>
                    </button>
                    <button
                      onClick={() => handleSocialConnect('steam')}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1B2838] text-white font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      <svg className="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <title>Steam</title>
                        <path
                          d="M12.143.001a11.857 11.857 0 00-4.085 23.018l.002.001a11.857 11.857 0 004.083-23.018zm.052 2.4a9.428 9.428 0 11-3.267 18.25L9 20.648a9.428 9.428 0 013.195-18.248zM7.18 10.635l5.244 3.018 2.097-3.642-5.244-3.02-2.097 3.644zm11.161 7.428a5.286 5.286 0 11-10.572 0 5.286 5.286 0 0110.572 0zm-1.89-1.071a3.429 3.429 0 10-6.79.025l.024.032a3.429 3.429 0 006.766-.057zM17.485 5.5l-3.35 5.8-2.67-1.536 3.35-5.8 2.67 1.536z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>Steam</span>
                    </button>
                    <button
                      onClick={() => handleSocialConnect('twitch')}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#9146FF] text-white font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      <svg className="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <title>Twitch</title>
                        <path
                          d="M11.571 4.714h1.715v5.143H11.57zm4.714 0h1.715v5.143h-1.715zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>Twitch</span>
                    </button>
                  </div>
                </div>
              </section>
              {/* Section 2: Grow Your Network */}
              <section className="mb-10">
                <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-b border-gray-200 dark:border-b-[#223d49]">
                  Have a Referral Code?
                </h2>
                <div className="p-4 mt-4 flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="relative flex-grow">
                    <input
                      className="w-full h-12 px-4 rounded-lg bg-gray-200 dark:bg-[#223d49] text-black dark:text-white border-transparent focus:border-primary focus:ring-primary placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="Enter referral code"
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                    />
                    <span
                      className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 cursor-pointer"
                      title="A referral code gives you and your friend a bonus!"
                    >
                      help
                    </span>
                  </div>
                  <button
                    onClick={handleApplyReferralCode}
                    className="flex items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gray-200 dark:bg-[#223d49] text-black dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-primary/20"
                  >
                    Apply Code
                  </button>
                </div>
              </section>
              {/* Section 3: Notification Preferences */}
              <section className="mb-10">
                <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-b border-gray-200 dark:border-b-[#223d49]">
                  Notification Preferences
                </h2>
                <div className="p-4 mt-4 space-y-4">
                  <div className="flex items-center justify-between bg-gray-200 dark:bg-slate-800 p-4 rounded-lg">
                    <span className="font-medium text-black dark:text-white">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between bg-gray-200 dark:bg-slate-800 p-4 rounded-lg">
                    <span className="font-medium text-black dark:text-white">Push Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between bg-gray-200 dark:bg-slate-800 p-4 rounded-lg">
                    <span className="font-medium text-black dark:text-white">SMS Alerts</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        checked={smsAlerts}
                        onChange={(e) => setSmsAlerts(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>
              {/* Section 4: Personalize Your Feed */}
              <section className="mb-12">
                <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-b border-gray-200 dark:border-b-[#223d49]">
                  What Games Do You Love?
                </h2>
                <p className="px-4 pt-4 text-gray-500 dark:text-gray-400">Select your favorite genres to get personalized recommendations.</p>
                <div className="p-4 mt-2 flex flex-wrap gap-3">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        const newSelected = new Set(selectedGenres);
                        if (newSelected.has(genre)) {
                          newSelected.delete(genre);
                        } else {
                          newSelected.add(genre);
                        }
                        setSelectedGenres(newSelected);
                      }}
                      className={`px-4 py-2 rounded-full border-2 font-bold ${
                        selectedGenres.has(genre)
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </section>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6">
                <button
                  onClick={() => router.push('/')}
                  className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-primary/10 text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Skip for Now</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
                >
                  <span className="truncate">Save & Continue</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

