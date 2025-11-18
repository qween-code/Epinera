'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  points: number;
  badge_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  joined_year: number;
}

export default function GamificationPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'leaderboards' | 'achievements' | 'badges'>('leaderboards');
  const [timeFilter, setTimeFilter] = useState<'all-time' | 'monthly' | 'weekly' | 'top-buyers' | 'top-sellers'>('all-time');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch leaderboard data from profiles with points calculation
        // Points can be calculated from orders, reviews, referrals, etc.
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, created_at, metadata')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        // Calculate points for each user based on orders, reviews, referrals
        const leaderboardEntries: LeaderboardEntry[] = await Promise.all(
          (profilesData || []).map(async (profile: any) => {
            // Count orders
            const { count: ordersCount } = await supabase
              .from('orders')
              .select('id', { count: 'exact', head: true })
              .eq('buyer_id', profile.id)
              .eq('status', 'delivered');

            // Count reviews given
            const { count: reviewsCount } = await supabase
              .from('reviews')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', profile.id);

            // Count referrals
            const { count: referralsCount } = await supabase
              .from('referrals')
              .select('id', { count: 'exact', head: true })
              .eq('referrer_id', profile.id);

            // Calculate points (orders * 10 + reviews * 5 + referrals * 20)
            const points = (ordersCount || 0) * 10 + (reviewsCount || 0) * 5 + (referralsCount || 0) * 20;

            // Determine badge tier based on points
            let badgeTier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' = 'bronze';
            if (points >= 100000) badgeTier = 'diamond';
            else if (points >= 50000) badgeTier = 'platinum';
            else if (points >= 20000) badgeTier = 'gold';
            else if (points >= 5000) badgeTier = 'silver';

            return {
              id: profile.id,
              user_id: profile.id,
              full_name: profile.full_name || 'Unknown',
              avatar_url: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
              points,
              badge_tier: badgeTier,
              joined_year: new Date(profile.created_at).getFullYear(),
            };
          })
        );

        // Sort by points descending
        leaderboardEntries.sort((a, b) => b.points - a.points);

        setLeaderboard(leaderboardEntries);
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, timeFilter]);

  const getBadgeIcon = (tier: string) => {
    const iconMap: Record<string, string> = {
      diamond: 'diamond',
      platinum: 'workspace_premium',
      gold: 'military_tech',
      silver: 'workspace_premium',
      bronze: 'military_tech',
    };
    return iconMap[tier] || 'military_tech';
  };

  const getBadgeColor = (tier: string) => {
    const colorMap: Record<string, string> = {
      diamond: 'diamond',
      platinum: 'platinum',
      gold: 'gold',
      silver: 'silver',
      bronze: 'bronze',
    };
    return colorMap[tier] || 'bronze';
  };

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('en-US').format(points);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid dark:border-b-[#223d49] px-4 sm:px-10 py-3">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-4 text-black dark:text-white">
              <div className="size-6">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
            </div>
          </div>
          <div className="hidden md:flex flex-1 justify-center gap-8">
            <div className="flex items-center gap-9">
              <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal" href="/products">
                Store
              </Link>
              <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal" href="/publishers">
                Publishers
              </Link>
              <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal" href="/brands">
                Brands
              </Link>
              <Link className="text-primary text-sm font-bold leading-normal" href="/gamification">
                Gamification
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Login</span>
            </Link>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User avatar placeholder"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXasGGZQZNdTdhVYtRyMQTsjbCKAd3AO-mMTReo-WRRGn0cF9t_-SW9Zcgtjp4rJf8DrYV-f1lFzZ74tmbAkbmmh-wQ81BCsLEw700DwkoGXIGP2ZHjR3lxwGHeMCCXZf75q3Vz6kzx0gaNO7ARONqKqKxnAGibpaCGF5h2tZZ4Ep4Zr0_BlGYfhAbIhLrqMKhRa-5-6dmrhtmLEeY3Z9gADVPZxf_C1ll1o5g2lWfj9URGIYdyQokWx4GMAfF_AnZuyj4P7rK-nEU")',
              }}
            />
          </div>
        </header>
        <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Gamification & Community Achievements
                </p>
                <p className="text-gray-500 dark:text-[#90b8cb] text-base font-normal leading-normal">
                  Climb the ranks, unlock exclusive badges, and earn rewards for your engagement.
                </p>
              </div>
            </div>
            <div className="pb-3">
              <div className="flex border-b border-gray-200 dark:border-[#315768] px-4 gap-8">
                <button
                  onClick={() => setActiveTab('leaderboards')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'leaderboards'
                      ? 'border-b-primary text-black dark:text-white'
                      : 'border-b-transparent text-gray-500 dark:text-[#90b8cb]'
                  }`}
                >
                  <p className="text-black dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">Leaderboards</p>
                </button>
                <Link
                  href="/achievements"
                  className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-[#90b8cb] pb-[13px] pt-4 hover:text-black dark:hover:text-white"
                >
                  <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-bold leading-normal tracking-[0.015em]">All Achievements</p>
                </Link>
                <button
                  onClick={() => setActiveTab('badges')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'badges'
                      ? 'border-b-primary text-black dark:text-white'
                      : 'border-b-transparent text-gray-500 dark:text-[#90b8cb]'
                  }`}
                >
                  <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-bold leading-normal tracking-[0.015em]">Badge & Privilege Tiers</p>
                </button>
              </div>
            </div>
            <section className="flex flex-col gap-4 p-4">
              <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pt-5">Community Champions</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setTimeFilter('all-time')}
                  className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 cursor-pointer ${
                    timeFilter === 'all-time'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-[#223d49] text-gray-800 dark:text-white'
                  }`}
                >
                  <p className="text-sm font-medium leading-normal">All-Time</p>
                </button>
                <button
                  onClick={() => setTimeFilter('monthly')}
                  className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 cursor-pointer ${
                    timeFilter === 'monthly'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-[#223d49] text-gray-800 dark:text-white'
                  }`}
                >
                  <p className="text-gray-800 dark:text-white text-sm font-medium leading-normal">Monthly</p>
                </button>
                <button
                  onClick={() => setTimeFilter('weekly')}
                  className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 cursor-pointer ${
                    timeFilter === 'weekly'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-[#223d49] text-gray-800 dark:text-white'
                  }`}
                >
                  <p className="text-gray-800 dark:text-white text-sm font-medium leading-normal">Weekly</p>
                </button>
                <button
                  onClick={() => setTimeFilter('top-buyers')}
                  className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 cursor-pointer ${
                    timeFilter === 'top-buyers'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-[#223d49] text-gray-800 dark:text-white'
                  }`}
                >
                  <p className="text-gray-800 dark:text-white text-sm font-medium leading-normal">Top Buyers</p>
                </button>
                <button
                  onClick={() => setTimeFilter('top-sellers')}
                  className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 cursor-pointer ${
                    timeFilter === 'top-sellers'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-[#223d49] text-gray-800 dark:text-white'
                  }`}
                >
                  <p className="text-gray-800 dark:text-white text-sm font-medium leading-normal">Top Sellers</p>
                </button>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-[#223d49]">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 dark:bg-[#1a2c36]">
                    <tr>
                      <th className="p-4 text-sm font-semibold text-gray-600 dark:text-[#90b8cb]">Rank</th>
                      <th className="p-4 text-sm font-semibold text-gray-600 dark:text-[#90b8cb]">User</th>
                      <th className="p-4 text-sm font-semibold text-gray-600 dark:text-[#90b8cb] text-right">Points</th>
                      <th className="p-4 text-sm font-semibold text-gray-600 dark:text-[#90b8cb] text-center">Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-[#223d49]">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-[#90b8cb]">
                          Loading leaderboard...
                        </td>
                      </tr>
                    ) : leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-[#90b8cb]">
                          No leaderboard data available.
                        </td>
                      </tr>
                    ) : (
                      leaderboard.slice(0, 10).map((entry, index) => (
                        <tr
                          key={entry.id}
                          className={index === 0 ? 'bg-primary/10 dark:bg-primary/20' : ''}
                        >
                          <td className={`p-4 font-bold text-lg ${index === 0 ? 'text-primary' : 'text-gray-600 dark:text-[#90b8cb]'}`}>
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                className="size-10 rounded-full"
                                data-alt={`User avatar of ${entry.full_name}`}
                                src={entry.avatar_url}
                                alt={entry.full_name}
                              />
                              <div>
                                <p className="font-bold text-black dark:text-white">{entry.full_name}</p>
                                <p className="text-xs text-gray-500 dark:text-[#90b8cb]">Joined {entry.joined_year}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-bold text-black dark:text-white text-right">{formatPoints(entry.points)}</td>
                          <td className="p-4">
                            <div className="flex justify-center">
                              <div
                                className={`flex items-center gap-2 rounded-full px-3 py-1 ${
                                  entry.badge_tier === 'diamond'
                                    ? 'bg-diamond/20'
                                    : entry.badge_tier === 'platinum'
                                    ? 'bg-platinum/20'
                                    : entry.badge_tier === 'gold'
                                    ? 'bg-gold/20'
                                    : entry.badge_tier === 'silver'
                                    ? 'bg-silver/20'
                                    : 'bg-bronze/20'
                                }`}
                              >
                                <span
                                  className={`material-symbols-outlined text-lg ${
                                    entry.badge_tier === 'diamond'
                                      ? 'text-diamond'
                                      : entry.badge_tier === 'platinum'
                                      ? 'text-platinum'
                                      : entry.badge_tier === 'gold'
                                      ? 'text-gold'
                                      : entry.badge_tier === 'silver'
                                      ? 'text-silver'
                                      : 'text-bronze'
                                  }`}
                                >
                                  {getBadgeIcon(entry.badge_tier)}
                                </span>
                                <p
                                  className={`text-sm font-bold capitalize ${
                                    entry.badge_tier === 'diamond'
                                      ? 'text-diamond'
                                      : entry.badge_tier === 'platinum'
                                      ? 'text-platinum'
                                      : entry.badge_tier === 'gold'
                                      ? 'text-gold'
                                      : entry.badge_tier === 'silver'
                                      ? 'text-silver'
                                      : 'text-bronze'
                                  }`}
                                >
                                  {entry.badge_tier}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

