'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  totalEarnings: number;
  currentLevel: number;
}

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0,
    currentLevel: 1,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchReferralData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/referral');
          return;
        }

        // Fetch or create referral code
        let { data: existingReferral } = await supabase
          .from('referrals')
          .select('referral_code')
          .eq('referrer_id', user.id)
          .limit(1)
          .single();

        let code: string;
        if (existingReferral?.referral_code) {
          code = existingReferral.referral_code;
        } else {
          // Generate new referral code
          code = `USER${user.id.substring(0, 8).toUpperCase()}`;
          // Create referral record if it doesn't exist
          await supabase
            .from('referrals')
            .insert({
              referrer_id: user.id,
              referral_code: code,
              status: 'pending',
            });
        }

        setReferralCode(code);
        setReferralLink(`${window.location.origin}/?ref=${code}`);

        // Fetch referral stats
        const { data: referrals } = await supabase
          .from('referrals')
          .select('id, status, reward_amount')
          .eq('referrer_id', user.id);

        const totalReferrals = referrals?.length || 0;
        const completedReferrals = referrals?.filter((r) => r.status === 'completed').length || 0;
        const totalEarnings = referrals?.reduce((sum, r) => sum + parseFloat(r.reward_amount?.toString() || '0'), 0) || 0;
        const currentLevel = Math.floor(completedReferrals / 3) + 1;

        setStats({
          totalReferrals,
          completedReferrals,
          totalEarnings,
          currentLevel: Math.min(currentLevel, 4),
        });
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [supabase, router]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = `Join Epin Marketplace using my referral link and get a discount! ${referralLink}`;
    const shareUrls: Record<string, string> = {
      discord: `https://discord.com/channels/@me`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(text)}`,
    };

    if (shareUrls[platform]) {
      if (platform === 'discord') {
        // Discord doesn't have a direct share URL, just copy to clipboard
        navigator.clipboard.writeText(text);
        alert('Referral link copied to clipboard!');
      } else {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      }
    }
  };

  const referralLadder = [
    {
      level: 1,
      referrals: 1,
      reward: '5% discount',
      bonus: null,
      icon: 'star',
      color: 'bg-primary/10 border-primary',
    },
    {
      level: 2,
      referrals: 3,
      reward: '10% discount',
      bonus: '$5 bonus',
      icon: 'star',
      color: 'bg-primary/20 border-primary',
    },
    {
      level: 3,
      referrals: 5,
      reward: '15% discount',
      bonus: '$15 bonus',
      icon: 'star',
      color: 'bg-primary/30 border-primary',
    },
    {
      level: 4,
      referrals: 10,
      reward: 'VIP status',
      bonus: '$50 bonus',
      icon: 'workspace_premium',
      color: 'bg-amber-500/20 border-amber-500',
    },
  ];

  if (loading) {
    return (
      <div className="relative flex w-full min-h-screen text-gray-800 dark:text-gray-200 bg-background-light dark:bg-background-dark font-display">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex w-full min-h-screen text-gray-800 dark:text-gray-200 bg-background-light dark:bg-background-dark font-display">
      {/* SideNavBar */}
      <aside className="flex-shrink-0 w-64 bg-background-light dark:bg-[#101d23] border-r border-gray-200 dark:border-gray-800 hidden md:block">
        <div className="flex flex-col h-full p-4 justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")',
                }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">PlayerOne</h1>
                <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">Level {stats.currentLevel}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 mt-4">
              <Link
                href="/wallet"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#223d49] rounded-lg"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#223d49] rounded-lg"
              >
                <span className="material-symbols-outlined">storefront</span>
                <p className="text-sm font-medium leading-normal">Store</p>
              </Link>
              <Link
                href="/wallet"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#223d49] rounded-lg"
              >
                <span className="material-symbols-outlined">stadia_controller</span>
                <p className="text-sm font-medium leading-normal">My Games</p>
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#223d49] rounded-lg"
              >
                <span className="material-symbols-outlined">groups</span>
                <p className="text-sm font-medium leading-normal">Community</p>
              </Link>
              <Link
                href="/referral"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 dark:bg-[#223d49] text-primary dark:text-white"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  card_giftcard
                </span>
                <p className="text-sm font-medium leading-normal">Referrals</p>
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/wallet"
              className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Go Premium</span>
            </Link>
            <div className="flex flex-col gap-1">
              <Link
                href="/wallet"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#223d49] rounded-lg"
              >
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Center Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* PageHeading */}
            <div>
              <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                Invite Friends, Earn Rewards
              </p>
              <p className="text-base font-normal leading-normal text-gray-500 dark:text-[#90b8cb]">
                Share your unique code to earn discounts, bonuses, and more.
              </p>
            </div>

            {/* Header Card */}
            <div className="rounded-xl shadow-sm bg-white dark:bg-[#182b34]">
              <div
                className="w-full bg-center bg-no-repeat aspect-[3/1] bg-cover rounded-t-xl"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBf53T8555T4rVkvlghjpxobIDY9PmLaYbtmVbBAvIc4ikRRKG40HtlP87--Z9zqRuovAGNbO8OImhemCrLacodV6IoiUO3YkvCwrZpkt6B4Hvq6OolHuEmwcDm6KDM1-IzwY6hpWYHKNb6n8GVQOtxL5_IbaIPLhuYzOMaLbUfDfU4BwP4sdFJucVjfGT5jLHUffdMOGmu1MJB0fFe2NvtiqS0mT_GLMRjCvaZJqNm8e93L7AgpI93juBUhJ1ScEcvH73LNwcQD5v7")',
                }}
              ></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
                    Your Unique Referral Link
                  </p>
                  <p className="text-base font-normal leading-normal text-gray-500 dark:text-[#90b8cb]">{referralLink}</p>
                  <p className="text-sm font-normal leading-normal text-gray-500 dark:text-[#90b8cb]">
                    Share this link. They get a discount, and you earn rewards!
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* ActionsBar */}
            <div className="p-6 rounded-xl shadow-sm bg-white dark:bg-[#182b34]">
              <p className="text-lg font-bold leading-tight tracking-[-0.015em] mb-4 text-gray-900 dark:text-white">
                Share Your Link
              </p>
              <div className="flex flex-wrap justify-start gap-4">
                {[
                  { name: 'Discord', icon: '💬' },
                  { name: 'Twitter', icon: '🐦' },
                  { name: 'Whatsapp', icon: '💬' },
                  { name: 'Facebook', icon: '📘' },
                ].map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handleSocialShare(platform.name.toLowerCase())}
                    className="flex flex-col items-center gap-2 text-center w-24 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#223d49] transition-colors"
                  >
                    <div className="rounded-full bg-gray-200 dark:bg-[#223d49] p-3.5 text-2xl">{platform.icon}</div>
                    <p className="text-sm font-medium leading-normal text-gray-600 dark:text-white">{platform.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* SectionHeader */}
            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] pt-5 text-gray-900 dark:text-white">
              Climb the Referral Ladder
            </h2>

            {/* Referral Ladder */}
            <div className="flex flex-col md:flex-row gap-4">
              {referralLadder.map((level) => {
                const isUnlocked = stats.completedReferrals >= level.referrals;
                const isCurrent = stats.currentLevel === level.level;
                return (
                  <div
                    key={level.level}
                    className={`flex-1 p-5 rounded-xl border-2 ${
                      isCurrent ? level.color : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`flex items-center justify-center size-8 rounded-full ${
                          isUnlocked ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                        }`}
                      >
                        <span className="material-symbols-outlined">{level.icon}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">Level {level.level}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{level.referrals} Referrals</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">{level.reward}</p>
                    {level.bonus && <p className="text-sm text-primary font-medium">{level.bonus}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Stats Card */}
            <div className="p-6 rounded-xl shadow-sm bg-white dark:bg-[#182b34]">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Your Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-[#90b8cb]">Total Referrals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReferrals}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-[#90b8cb]">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedReferrals}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-[#90b8cb]">Total Earnings</p>
                  <p className="text-2xl font-bold text-primary">${stats.totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="p-6 rounded-xl shadow-sm bg-white dark:bg-[#182b34]">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">How It Works</h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <p>Share your unique referral link with friends</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <p>They sign up and get a discount on their first purchase</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <p>You earn rewards when they complete their first purchase</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <p>Climb the referral ladder for bigger rewards!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

