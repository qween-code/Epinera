'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  updateProfilePhoto,
  connectSocialAccount,
  applyReferralCode,
  updateNotificationPreferences,
  updateGameGenres,
  getProfileCompletion,
} from '@/app/actions/profile';
import { motion } from 'framer-motion';

export default function CompleteProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [referralCode, setReferralCode] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(60);
  const [message, setMessage] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);

  const genres = ['RPG', 'FPS', 'Strategy', 'MOBA', 'Simulation', 'Sports', 'Indie', 'Adventure'];

  useEffect(() => {
    const loadProfileData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const completion = await getProfileCompletion();
      if (completion.completion) {
        setProfileCompletion(completion.completion);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        const metadata = (profile.metadata as any) || {};
        if (metadata.notification_preferences) {
          setNotifications(metadata.notification_preferences);
        }
        if (metadata.favorite_genres) {
          setSelectedGenres(metadata.favorite_genres);
        }
        if (metadata.referral_code_used) {
          setReferralCode(metadata.referral_code_used);
        }
      }
      setIsPageLoading(false);
    };

    loadProfileData();
  }, [router, supabase]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const result = await updateProfilePhoto(publicUrl);
      if (result.success) {
        setMessage('Profile photo updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSocialConnect = async (provider: 'discord' | 'x' | 'steam' | 'twitch') => {
    setMessage(`${provider} connection coming soon!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleApplyReferral = async () => {
    if (!referralCode.trim()) {
      setMessage('Please enter a referral code');
      return;
    }

    setIsLoading(true);
    const result = await applyReferralCode(referralCode);
    setIsLoading(false);

    if (result.success) {
      setMessage(result.message || 'Referral code applied successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      await updateNotificationPreferences(notifications);
      await updateGameGenres(selectedGenres);
      const completion = await getProfileCompletion();
      if (completion.completion) {
        setProfileCompletion(completion.completion);
      }

      setMessage('Profile updated successfully!');
      setTimeout(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.push('/profile');
        } else {
          router.push('/login');
        }
      }, 1500);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0B0E14]">
        <div
          className="absolute inset-0 z-0 h-full w-full bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop')",
          }}
        ></div>
        <div className="z-10 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00A3FF] border-t-transparent"></div>
          <p className="text-white font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0B0E14] text-white font-display overflow-x-hidden">
      {/* Background Image */}
      {/* Background Image with Blur and Transparency */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop')",
            filter: 'blur(8px)',
            transform: 'scale(1.1)', // Prevent blur edges from showing
          }}
        />
        <div className="absolute inset-0 bg-[#0B0E14]/70"></div>
      </div>

      {/* Navbar Placeholder */}
      <header className="relative z-10 flex h-20 items-center justify-between border-b border-white/5 bg-[#0B0E14]/50 px-6 backdrop-blur-xl lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00A3FF] to-[#0066FF] shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined text-white">stadia_controller</span>
          </div>
          <span className="font-bold text-xl tracking-tight">EpinMarket</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#00A3FF] to-purple-500 ring-2 ring-white/10"></div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-4">Enhance Your Experience</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">Unlock personalized offers and build your community presence. Skip for now and complete this later from your settings.</p>

          {/* Progress Bar */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex justify-between text-sm font-bold mb-3 uppercase tracking-wider">
              <span className="text-gray-400">Profile Completion</span>
              <span className="text-[#00A3FF]">{profileCompletion}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-800/50 overflow-hidden backdrop-blur-sm border border-white/5 p-[2px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00A3FF] to-[#00E0FF] shadow-[0_0_15px_rgba(0,163,255,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8">
          {/* Section 1: Avatar */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[2rem] border border-white/5 bg-[#13161C]/80 p-8 backdrop-blur-xl shadow-2xl hover:border-white/10 transition-colors"
          >
            <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00A3FF]/10 text-[#00A3FF]">
                <span className="material-symbols-outlined">face</span>
              </div>
              Show Who You Are
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1A1D24] text-gray-500 border-2 border-dashed border-gray-700 group-hover:border-[#00A3FF] group-hover:text-[#00A3FF] transition-all">
                    <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-[#00A3FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Upload a Profile Photo</p>
                  <p className="text-sm text-gray-400 mt-1">Supported formats: JPG, PNG, GIF</p>
                </div>
              </div>
              <label className="cursor-pointer rounded-xl bg-[#1A1D24] px-8 py-4 text-sm font-bold text-white hover:bg-[#22252B] hover:scale-105 transition-all border border-white/5 shadow-lg">
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </motion.section>

          {/* Section 2: Connect Accounts */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[2rem] border border-white/5 bg-[#13161C]/80 p-8 backdrop-blur-xl shadow-2xl hover:border-white/10 transition-colors"
          >
            <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00A3FF]/10 text-[#00A3FF]">
                <span className="material-symbols-outlined">link</span>
              </div>
              Connect Your Accounts
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { id: 'discord', name: 'Discord', color: '#5865F2', icon: 'discord' },
                { id: 'x', name: 'X', color: '#1DA1F2', icon: 'close' },
                { id: 'steam', name: 'Steam', color: '#1B2838', icon: 'sports_esports' },
                { id: 'twitch', name: 'Twitch', color: '#9146FF', icon: 'videocam' },
              ].map((social) => (
                <button
                  key={social.id}
                  onClick={() => handleSocialConnect(social.id as any)}
                  className="group flex h-16 items-center justify-center gap-3 rounded-2xl border border-white/5 bg-[#1A1D24] text-sm font-bold text-white hover:bg-[#22252B] transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <span className="material-symbols-outlined opacity-50 group-hover:opacity-100 transition-opacity">{social.icon}</span>
                  {social.name}
                </button>
              ))}
            </div>
          </motion.section>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Section 3: Referral */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-[2rem] border border-white/5 bg-[#13161C]/80 p-8 backdrop-blur-xl shadow-2xl hover:border-white/10 transition-colors"
            >
              <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00A3FF]/10 text-[#00A3FF]">
                  <span className="material-symbols-outlined">loyalty</span>
                </div>
                Referral Code
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-[#0B0E14] px-6 py-4 text-sm text-white placeholder:text-gray-600 focus:border-[#00A3FF] focus:outline-none transition-all shadow-inner"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
                <button
                  onClick={handleApplyReferral}
                  className="w-full rounded-2xl bg-[#1A1D24] py-4 text-sm font-bold text-white hover:bg-[#22252B] transition-all border border-white/5 hover:scale-[1.02]"
                >
                  Apply Code
                </button>
              </div>
            </motion.section>

            {/* Section 4: Notifications */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-[2rem] border border-white/5 bg-[#13161C]/80 p-8 backdrop-blur-xl shadow-2xl hover:border-white/10 transition-colors"
            >
              <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00A3FF]/10 text-[#00A3FF]">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                Notifications
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { id: 'email', label: 'Email Updates', checked: notifications.email },
                  { id: 'push', label: 'Push Notifications', checked: notifications.push },
                  { id: 'sms', label: 'SMS Alerts', checked: notifications.sms },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[#0B0E14]/50 p-4 hover:bg-[#0B0E14] transition-colors border border-white/5 cursor-pointer" onClick={() => setNotifications((prev) => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}>
                    <span className="text-sm font-medium text-white">{item.label}</span>
                    <div className={`relative h-6 w-11 rounded-full transition-colors ${item.checked ? 'bg-[#00A3FF]' : 'bg-gray-700'}`}>
                      <div className={`absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white transition-transform ${item.checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Section 5: Genres */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-[2rem] border border-white/5 bg-[#13161C]/80 p-8 backdrop-blur-xl shadow-2xl hover:border-white/10 transition-colors"
          >
            <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00A3FF]/10 text-[#00A3FF]">
                <span className="material-symbols-outlined">sports_esports</span>
              </div>
              What Games Do You Love?
            </h2>
            <div className="flex flex-wrap gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`rounded-full border px-6 py-3 text-sm font-bold transition-all hover:scale-105 ${selectedGenres.includes(genre)
                    ? 'border-[#00A3FF] bg-[#00A3FF] text-white shadow-[0_0_20px_rgba(0,163,255,0.4)]'
                    : 'border-white/10 bg-[#0B0E14] text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex items-center justify-end gap-6 pt-4"
          >
            <button
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  router.push('/');
                } else {
                  router.push('/login');
                }
              }}
              className="text-sm font-bold text-gray-500 hover:text-white transition-colors px-4 py-2"
            >
              Skip for Now
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-2xl bg-gradient-to-r from-[#00A3FF] to-[#0066FF] px-12 py-5 text-base font-bold text-white hover:shadow-[0_0_30px_rgba(0,163,255,0.5)] transition-all disabled:opacity-50 hover:scale-[1.02]"
            >
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </button>
          </motion.div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 rounded-2xl p-4 text-center text-sm font-medium flex items-center justify-center gap-2 ${message.includes('Error') || message.includes('error')
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-green-500/10 text-green-500 border border-green-500/20'
                }`}>
              <span className="material-symbols-outlined text-lg">
                {message.includes('Error') || message.includes('error') ? 'error' : 'check_circle'}
              </span>
              {message}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
