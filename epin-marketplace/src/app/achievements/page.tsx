'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlocked_at?: string;
  category: 'buyer' | 'seller';
}

export default function AchievementsPage() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<'buyer' | 'seller'>('seller');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/achievements');
          return;
        }

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserProfile(profile);

        // Fetch achievements from database
        const { data: achievementsData } = await supabase
          .from('achievements')
          .select('*')
          .order('created_at', { ascending: true });

        // Fetch user's unlocked achievements
        const { data: userAchievementsData } = await supabase
          .from('user_achievements')
          .select('achievement_id, unlocked_at, progress')
          .eq('user_id', user.id);

        const unlockedAchievementIds = new Set(userAchievementsData?.map((ua) => ua.achievement_id) || []);
        const userAchievementMap = new Map(
          userAchievementsData?.map((ua) => [ua.achievement_id, { unlocked_at: ua.unlocked_at, progress: ua.progress }]) || []
        );

        // Calculate current progress for each achievement
        const userAchievements: Achievement[] = await Promise.all(
          (achievementsData || []).map(async (achievement: any) => {
            const userAchievement = userAchievementMap.get(achievement.id);
            const isUnlocked = unlockedAchievementIds.has(achievement.id);

            // Calculate progress based on achievement type
            let progress = userAchievement?.progress || 0;
            let target = achievement.target || 1;

            // If not unlocked, calculate current progress
            if (!isUnlocked) {
              if (achievement.type === 'first_sale' && profile?.role === 'seller') {
                const { count } = await supabase
                  .from('orders')
                  .select('id', { count: 'exact', head: true })
                  .eq('seller_id', user.id)
                  .eq('status', 'delivered');
                progress = count || 0;
              } else if (achievement.type === 'speed_demon' && profile?.role === 'seller') {
                // Count fast deliveries (would need delivery_time tracking)
                progress = 7; // Placeholder
              } else if (achievement.type === 'customer_champion' && profile?.role === 'seller') {
                const { count } = await supabase
                  .from('reviews')
                  .select('id', { count: 'exact', head: true })
                  .eq('seller_id', user.id)
                  .eq('rating', 5);
                progress = count || 0;
              } else if (achievement.type === 'sales_veteran' && profile?.role === 'seller') {
                const { count } = await supabase
                  .from('orders')
                  .select('id', { count: 'exact', head: true })
                  .eq('seller_id', user.id)
                  .eq('status', 'delivered');
                progress = count || 0;
              } else if (achievement.type === 'top_earner' && profile?.role === 'seller') {
                const { data: ordersData } = await supabase
                  .from('orders')
                  .select('total_amount')
                  .eq('seller_id', user.id)
                  .eq('status', 'delivered');
                progress = ordersData?.reduce((sum, order) => sum + parseFloat(order.total_amount?.toString() || '0'), 0) || 0;
              } else if (achievement.type === 'platform_ambassador' && profile?.role === 'seller') {
                const { count } = await supabase
                  .from('referrals')
                  .select('id', { count: 'exact', head: true })
                  .eq('referrer_id', user.id);
                progress = count || 0;
              }
            }

            return {
              id: achievement.id,
              title: achievement.name || achievement.code || 'Achievement',
              description: achievement.description || '',
              icon: achievement.icon_url ? 'military_tech' : 'military_tech', // Use icon_url if available
              progress,
              target: achievement.requirements?.target || target || 1,
              unlocked: isUnlocked,
              unlocked_at: userAchievement?.unlocked_at || userAchievement?.completed_at,
              category: achievement.requirements?.category || 'seller',
            };
          })
        );

        setAchievements(userAchievements);
      } catch (error) {
        console.error('Error fetching achievements data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router, activeFilter]);

  const filteredAchievements = achievements.filter((achievement) => achievement.category === activeFilter);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  const getBadgeTier = () => {
    // Determine tier based on unlocked achievements
    if (unlockedCount >= 20) return 'Diamond';
    if (unlockedCount >= 15) return 'Platinum';
    if (unlockedCount >= 10) return 'Gold';
    if (unlockedCount >= 5) return 'Silver';
    return 'Bronze';
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5 sm:px-4 md:px-10 lg:px-20 xl:px-40">
            <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
              {/* TopNavBar */}
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-4 md:px-10 py-3">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4 text-white">
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
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
                  </div>
                  <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                    <div className="flex w-full flex-1 items-stretch rounded-full h-full">
                      <div className="text-white/50 flex border-none bg-white/5 items-center justify-center pl-4 rounded-l-full border-r-0">
                        <span className="material-symbols-outlined text-base">search</span>
                      </div>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-white focus:outline-0 focus:ring-0 border-none bg-white/5 focus:border-none h-full placeholder:text-white/50 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                        placeholder="Search"
                        type="text"
                      />
                    </div>
                  </label>
                </div>
                <div className="hidden lg:flex flex-1 justify-end gap-8">
                  <div className="flex items-center gap-9">
                    <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal" href="/">
                      Dashboard
                    </Link>
                    <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal" href="/products">
                      Marketplace
                    </Link>
                    <Link className="text-white/80 hover:text-white text-sm font-medium leading-normal" href="/wallet">
                      My Wallet
                    </Link>
                    <Link className="text-white text-sm font-bold leading-normal border-b-2 border-primary pb-1" href="/achievements">
                      Achievements
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/notifications"
                      className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 text-sm font-bold leading-normal tracking-[0.015em] min-w-0"
                    >
                      <span className="material-symbols-outlined text-xl">notifications</span>
                    </Link>
                    <Link
                      href="/messages"
                      className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 text-sm font-bold leading-normal tracking-[0.015em] min-w-0"
                    >
                      <span className="material-symbols-outlined text-xl">chat_bubble</span>
                    </Link>
                    <Link
                      href="/wallet"
                      className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 text-sm font-bold leading-normal tracking-[0.015em] min-w-0"
                    >
                      <span className="material-symbols-outlined text-xl">settings</span>
                    </Link>
                  </div>
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    data-alt="User avatar"
                    style={{
                      backgroundImage: userProfile?.avatar_url
                        ? `url('${userProfile.avatar_url}')`
                        : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9mbhZAd63pwAI4ydRkLAruyygwk3XdSI07_pdFYKLEvY8uHFXWS5AOYns9jGYX-mxAk_P1RwpXb4yWcjvmTvarDZPVQ0lpjwr6SP_XlyApqYoGKMEIY0Nz-5un6XcmNbjnSlK4L49pqdpW5Wa-ePqceRWgGyRaXB5Lw05nO6uQGQIwLNxLtyMCsAih00hGcRt5SFvkdr6KWF2Jyhou7nngpO9xd2YbO9Q3zhrBTNPtr-8YKplQKWdMiQytOS8wqK6113w0iyp_Emd")',
                    }}
                  />
                </div>
              </header>
              <main className="flex flex-col gap-6 pt-8">
                {/* PageHeading */}
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Achievements & Badges</p>
                </div>
                {/* ProfileHeader */}
                <div className="flex p-4 @container">
                  <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                    <div className="flex gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-24 w-24"
                        data-alt="User avatar"
                        style={{
                          backgroundImage: userProfile?.avatar_url
                            ? `url('${userProfile.avatar_url}')`
                            : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQilh2hvBxs7WIRYsztM5l0tdV8WkdGXRMkh2sxJZQ3INX8z_y0ZdCS7QrwyuG9Q2qZ9Bqte5BfsiHOoUNYFFgWjeEghP_5kmAQGH6v12wXfvbz8b9JergbAoOUFUy4rXVHlA0s7nMYwHxgXFE4qt0dlYt9KpQ2Q7mUl7Jzykn52sRmlBnyh8jHDrgd3ErYm_vvp4tTfqC4ttXCtLQqAer1bqoElCp34lm0LrTMwCG8JNQa9ChBm1C0_TRmCyoI9ZN9w1OFi4HnX93")',
                        }}
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                          {userProfile?.full_name || 'User'}
                        </p>
                        <p className="text-white/60 text-base font-normal leading-normal">
                          {getBadgeTier()} Tier {userProfile?.role === 'seller' ? 'Seller' : 'Buyer'}
                        </p>
                        <p className="text-white/60 text-base font-normal leading-normal">
                          {unlockedCount}/{totalCount} Achievements Unlocked
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start @[520px]:items-end gap-2">
                      <p className="text-white/80 text-sm font-medium">Special Badges</p>
                      <div className="flex gap-2">
                        {userProfile?.role === 'seller' && (
                          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
                            <span className="material-symbols-outlined text-primary text-base">verified</span>
                            <span>Verified Seller</span>
                          </div>
                        )}
                        {unlockedCount >= 10 && (
                          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
                            <span className="material-symbols-outlined text-primary text-base">military_tech</span>
                            <span>Top Rated</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* SectionHeader */}
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Badge & Privilege Tiers
                </h2>
                {/* Badge & Privilege System */}
                <div className="px-4">
                  <div className="flex flex-col gap-4 rounded-lg bg-white/5 p-6">
                    <div className="relative flex items-center w-full">
                      <div className="absolute h-1 w-full bg-white/10 rounded-full"></div>
                      <div className="absolute h-1 w-1/2 bg-primary rounded-full"></div>
                      <div className="relative flex justify-between w-full">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center justify-center rounded-full size-8 bg-primary border-2 border-background-dark">
                            <span className="material-symbols-outlined text-white text-lg">done</span>
                          </div>
                          <span className="text-xs font-bold text-primary">Bronze</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center justify-center rounded-full size-8 bg-primary border-2 border-background-dark">
                            <span className="material-symbols-outlined text-white text-lg">done</span>
                          </div>
                          <span className="text-xs font-bold text-primary">Silver</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center justify-center rounded-full size-8 bg-primary border-2 border-background-dark ring-4 ring-primary">
                            <span className="material-symbols-outlined text-white text-lg">military_tech</span>
                          </div>
                          <span className="text-xs font-bold text-primary">Gold</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center justify-center rounded-full size-8 bg-white/10 border-2 border-background-dark"></div>
                          <span className="text-xs font-medium text-white/50">Platinum</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center justify-center rounded-full size-8 bg-white/10 border-2 border-background-dark"></div>
                          <span className="text-xs font-medium text-white/50">Diamond</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 pt-6">
                      <div className="flex-1">
                        <p className="text-white font-bold mb-2">Current Tier Perks (Gold)</p>
                        <ul className="space-y-1 text-sm text-white/80 list-disc list-inside">
                          <li>5% Commission Rate</li>
                          <li>Priority Customer Support</li>
                          <li>Gold Profile Badge</li>
                          <li>Early access to new features</li>
                        </ul>
                      </div>
                      <div className="flex-1">
                        <p className="text-white/50 font-bold mb-2">Next Tier Perks (Platinum)</p>
                        <ul className="space-y-1 text-sm text-white/50 list-disc list-inside">
                          <li>3% Commission Rate</li>
                          <li>Dedicated Account Manager</li>
                          <li>Platinum Profile Badge</li>
                          <li>Featured Seller opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {/* SegmentedButtons */}
                <div className="flex px-4 py-3">
                  <div className="flex h-10 flex-1 items-center justify-center rounded-full bg-white/5 p-1">
                    <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 has-[:checked]:bg-background-dark has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-white text-white/60 text-sm font-medium leading-normal">
                      <span className="truncate">Buyer Achievements</span>
                      <input
                        className="invisible w-0"
                        name="achievements_filter"
                        type="radio"
                        value="Buyer Achievements"
                        checked={activeFilter === 'buyer'}
                        onChange={() => setActiveFilter('buyer')}
                      />
                    </label>
                    <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 has-[:checked]:bg-background-dark has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-white text-white/60 text-sm font-medium leading-normal">
                      <span className="truncate">Seller Achievements</span>
                      <input
                        className="invisible w-0"
                        name="achievements_filter"
                        type="radio"
                        value="Seller Achievements"
                        checked={activeFilter === 'seller'}
                        onChange={() => setActiveFilter('seller')}
                      />
                    </label>
                  </div>
                </div>
                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                  {loading ? (
                    <div className="col-span-3 text-center text-white/60 py-8">Loading achievements...</div>
                  ) : filteredAchievements.length === 0 ? (
                    <div className="col-span-3 text-center text-white/60 py-8">No achievements found.</div>
                  ) : (
                    filteredAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`flex flex-col items-center gap-4 rounded-lg bg-white/5 p-6 text-center ${
                          !achievement.unlocked ? 'opacity-50' : ''
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center size-16 rounded-full ${
                            achievement.unlocked ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'
                          }`}
                        >
                          <span className="material-symbols-outlined !text-4xl">
                            {achievement.unlocked ? achievement.icon : 'lock'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-white/80'}`}>
                            {achievement.title}
                          </p>
                          <p className="text-sm text-white/60">{achievement.description}</p>
                        </div>
                        <div className="w-full">
                          <div className={`h-2 w-full rounded-full ${achievement.unlocked ? 'bg-primary/20' : 'bg-white/10'}`}>
                            <div
                              className={`h-2 rounded-full ${achievement.unlocked ? 'bg-primary' : 'bg-white/40'}`}
                              style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                            />
                          </div>
                          <p className={`text-xs mt-1.5 ${achievement.unlocked ? 'text-white/80' : 'text-white/60'}`}>
                            {achievement.progress} / {achievement.target}{' '}
                            {achievement.id === 'top-earner' ? 'Earned' : 'Completed'}
                          </p>
                        </div>
                        {achievement.unlocked && achievement.unlocked_at && (
                          <p className="text-xs text-primary font-medium">
                            Unlocked on: {format(new Date(achievement.unlocked_at), 'dd/MM/yyyy')}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

