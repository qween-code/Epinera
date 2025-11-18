'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface GiveawayEntry {
  id: string;
  campaign_id: string;
  campaign: {
    id: string;
    name: string;
    description: string;
    campaign_type: string;
    image_url?: string;
    start_date: string;
    end_date: string;
    rewards: any;
    creator: {
      full_name: string;
    };
  };
  entry_method: string;
  is_winner: boolean;
  prize_claimed: boolean;
  created_at: string;
}

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  referralCode: string;
}

export default function MyCampaignsPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalEarnings: 0,
    referralCode: '',
  });
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'ended' | 'referrals'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/my-campaigns');
          return;
        }

        // Fetch giveaway entries
        const { data: entriesData, error: entriesError } = await supabase
          .from('giveaway_entries')
          .select(`
            id,
            campaign_id,
            entry_method,
            is_winner,
            prize_claimed,
            created_at,
            campaign:campaigns!giveaway_entries_campaign_id_fkey (
              id,
              name,
              description,
              campaign_type,
              image_url,
              start_date,
              end_date,
              rewards,
              creator:profiles!campaigns_creator_id_fkey (
                full_name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (entriesError) throw entriesError;
        setEntries((entriesData || []) as GiveawayEntry[]);

        // Fetch referral stats
        const { data: referralData } = await supabase
          .from('referrals')
          .select('id, reward_amount, referral_code')
          .eq('referrer_id', user.id)
          .limit(1)
          .single();

        if (referralData) {
          const { data: allReferrals } = await supabase
            .from('referrals')
            .select('reward_amount')
            .eq('referrer_id', user.id)
            .eq('status', 'completed');

          const totalEarnings = allReferrals?.reduce((sum, r) => sum + parseFloat(r.reward_amount?.toString() || '0'), 0) || 0;
          const totalReferrals = allReferrals?.length || 0;

          setReferralStats({
            totalReferrals,
            totalEarnings,
            referralCode: referralData.referral_code || `USER${user.id.substring(0, 8).toUpperCase()}`,
          });
        }
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  const getCampaignStatus = (campaign: GiveawayEntry['campaign'], entry: GiveawayEntry) => {
    const now = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = new Date(campaign.end_date);

    if (entry.is_winner) return 'winner';
    if (now < startDate) return 'scheduled';
    if (now > endDate) return 'ended';
    return 'active';
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.campaign.creator.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'active') {
      return matchesSearch && getCampaignStatus(entry.campaign, entry) === 'active';
    }
    if (activeTab === 'ended') {
      return matchesSearch && getCampaignStatus(entry.campaign, entry) === 'ended';
    }
    if (activeTab === 'referrals') {
      return false; // Referrals are shown in sidebar
    }
    return matchesSearch;
  });

  const handleCopyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralStats.referralCode);
      alert('Referral code copied!');
    } catch (error) {
      console.error('Error copying referral code:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-white">
      {/* SideNavBar */}
      <aside className="w-64 shrink-0 bg-[#101d23] p-4 flex flex-col justify-between border-r border-white/10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User avatar"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC02cwG4zotq3e3YQimFEoobIMBv2QWRYmBbinalq9SLmWOROnYdFfRmmuNncs4gUbH3tuzQojHY8o2sDUcfpuaT5KpR7ECaSSDhp55lqKFyaw86MIP82dC-ugjYi7BGj0KuHl_TrS5gvMdSWSGbpvBfSUQ_0-PdbS61UO-Cvyx9KrOzUpQX9JbEQcEDZJxxo6EfkAJp5ZRZHQsXw8qqYd4efjMPb6sQkBT910SoutqqVn57JQYT1ELFrjeRskvBNOecjrUxdPfHMQv")',
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">GamerTag123</h1>
              <p className="text-white/60 text-sm font-normal leading-normal">Level 12 - Master Adventurer</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/5 rounded-lg" href="/">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/5 rounded-lg" href="/products">
              <span className="material-symbols-outlined">storefront</span>
              <p className="text-sm font-medium leading-normal">Marketplace</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary" href="/my-campaigns">
              <span className="material-symbols-outlined">campaign</span>
              <p className="text-sm font-bold leading-normal">My Campaigns</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/5 rounded-lg" href="/wallet">
              <span className="material-symbols-outlined">wallet</span>
              <p className="text-sm font-medium leading-normal">Wallet</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/5 rounded-lg" href="/wallet">
              <span className="material-symbols-outlined">account_circle</span>
              <p className="text-sm font-medium leading-normal">Profile</p>
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <Link
            href="/creator/campaigns/create"
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
          >
            <span className="truncate">Create Campaign</span>
          </Link>
          <div className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/5 rounded-lg" href="/wallet">
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
              className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/5 rounded-lg text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              <p className="text-sm font-medium leading-normal">Log Out</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          {/* PageHeading */}
          <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Campaigns & Giveaways</h1>
              <p className="text-white/60 text-base font-normal leading-normal">Track your entries, rewards, and referral progress all in one place.</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/notifications"
                className="size-10 rounded-lg bg-[#223d49] hover:bg-[#315768] flex items-center justify-center relative"
              >
                <span className="material-symbols-outlined text-white/80">notifications</span>
                <div className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-[#223d49]"></div>
              </Link>
            </div>
          </header>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px]">
              <label className="flex flex-col h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-white/60 flex bg-[#223d49] items-center justify-center pl-4 rounded-l-lg">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-[#223d49] h-full placeholder:text-white/60 px-4 text-base font-normal leading-normal"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div className="flex gap-3">
              <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#223d49] px-4 hover:bg-[#315768]">
                <p className="text-white text-sm font-medium leading-normal">Filter by Reward</p>
                <span className="material-symbols-outlined text-white/80 text-xl">expand_more</span>
              </button>
              <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#223d49] px-4 hover:bg-[#315768]">
                <p className="text-white text-sm font-medium leading-normal">Filter by Publisher</p>
                <span className="material-symbols-outlined text-white/80 text-xl">expand_more</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-white/20 gap-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                  activeTab === 'all' ? 'border-b-primary text-white' : 'border-b-transparent text-white/60 hover:text-white'
                }`}
              >
                <p className="text-white text-sm font-bold leading-normal tracking-[0.015em]">All</p>
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                  activeTab === 'active' ? 'border-b-primary text-white' : 'border-b-transparent text-white/60 hover:text-white'
                }`}
              >
                <p className="font-bold leading-normal tracking-[0.015em] text-sm">Active Giveaways</p>
              </button>
              <button
                onClick={() => setActiveTab('ended')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                  activeTab === 'ended' ? 'border-b-primary text-white' : 'border-b-transparent text-white/60 hover:text-white'
                }`}
              >
                <p className="font-bold leading-normal tracking-[0.015em] text-sm">Ended Campaigns</p>
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                  activeTab === 'referrals' ? 'border-b-primary text-white' : 'border-b-transparent text-white/60 hover:text-white'
                }`}
              >
                <p className="font-bold leading-normal tracking-[0.015em] text-sm">My Referrals</p>
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {loading ? (
                <div className="text-center text-white/50 py-8">Loading campaigns...</div>
              ) : filteredEntries.length === 0 ? (
                <div className="text-center text-white/50 py-8">No campaigns found.</div>
              ) : (
                filteredEntries.map((entry) => {
                  const status = getCampaignStatus(entry.campaign, entry);
                  const isWinner = entry.is_winner;
                  const isEnded = status === 'ended';
                  const isActive = status === 'active';

                  return (
                    <div
                      key={entry.id}
                      className={`bg-[#223d49] rounded-xl overflow-hidden flex flex-col sm:flex-row ${
                        isWinner ? 'border-2 border-[#00FF7F] shadow-lg shadow-[#00FF7F]/20' : ''
                      } ${isEnded ? 'opacity-60' : ''}`}
                    >
                      <div
                        className="sm:w-1/3 h-48 sm:h-auto bg-cover bg-center"
                        data-alt={`${entry.campaign.name} campaign image`}
                        style={{
                          backgroundImage: entry.campaign.image_url
                            ? `url('${entry.campaign.image_url}')`
                            : 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800")',
                        }}
                      />
                      <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{entry.campaign.name}</h3>
                            <p className="text-sm text-white/60">by {entry.campaign.creator.full_name}</p>
                          </div>
                          {isWinner && (
                            <div className="flex items-center gap-2 bg-[#00FF7F]/20 text-[#00FF7F] px-3 py-1 rounded-full text-xs font-bold">
                              <span className="material-symbols-outlined text-sm">military_tech</span>
                              WINNER
                            </div>
                          )}
                          {!isWinner && isActive && (
                            <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
                              <span className="material-symbols-outlined text-sm">hourglass_top</span>
                              ACTIVE
                            </div>
                          )}
                          {isEnded && !isWinner && (
                            <div className="flex items-center gap-2 bg-white/20 text-white/80 px-3 py-1 rounded-full text-xs font-bold">
                              ENDED
                            </div>
                          )}
                        </div>
                        <p className="text-white/80">
                          <span className="font-bold">Prize:</span>{' '}
                          {entry.campaign.rewards?.prize || 'Reward TBD'}
                        </p>
                        {isActive && !isWinner && (
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs text-white/60">
                              <span>Entries Progress</span>
                              <span>3/5</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                        )}
                        {isWinner && (
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs text-white/60">
                              <span>Entries Complete</span>
                              <span>5/5</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2.5">
                              <div className="bg-[#00FF7F] h-2.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                        )}
                        {isWinner && !entry.prize_claimed && (
                          <button className="w-full bg-[#00FF7F] text-black font-bold py-2.5 rounded-lg hover:bg-[#00FF7F]/90">
                            Claim Reward
                          </button>
                        )}
                        {isActive && !isWinner && (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-center sm:text-left">
                              <p className="text-sm font-bold">Ends in:</p>
                              <p className="text-lg font-black text-primary">
                                {formatDistanceToNow(new Date(entry.campaign.end_date), { addSuffix: false })}
                              </p>
                            </div>
                            <button className="w-full sm:w-auto bg-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-primary/90">
                              Complete Entries
                            </button>
                          </div>
                        )}
                        {isEnded && !isWinner && (
                          <p className="text-sm text-white/60">You were not selected as a winner this time. Better luck next time!</p>
                        )}
                        {isEnded && (
                          <button
                            disabled
                            className="w-full bg-white/10 text-white/50 font-bold py-2.5 rounded-lg cursor-not-allowed"
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Referral Program Card */}
              <div className="bg-[#223d49] p-6 rounded-xl flex flex-col gap-4">
                <h3 className="text-xl font-bold">Referral Program</h3>
                <p className="text-white/60 text-sm">Invite friends and earn rewards for every successful sign-up!</p>
                <div className="bg-[#101c22] border border-dashed border-primary/50 p-3 rounded-lg text-center">
                  <p className="text-white/80 text-sm">Your Referral Code</p>
                  <p className="text-primary font-mono text-2xl font-bold tracking-widest">{referralStats.referralCode || 'LOADING...'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyReferralCode}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary/20 text-primary font-bold py-2.5 rounded-lg hover:bg-primary/30"
                  >
                    <span className="material-symbols-outlined text-xl">content_copy</span>
                    Copy
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-primary/20 text-primary font-bold py-2.5 rounded-lg hover:bg-primary/30">
                    <span className="material-symbols-outlined text-xl">share</span>
                    Share
                  </button>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-black">{referralStats.totalReferrals}</p>
                    <p className="text-xs text-white/60">Friends Joined</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-[#00FF7F]">${referralStats.totalEarnings.toFixed(2)}</p>
                    <p className="text-xs text-white/60">Rewards Earned</p>
                  </div>
                </div>
              </div>

              {/* Gamification/Achievements Widget */}
              <div className="bg-[#223d49] p-6 rounded-xl flex flex-col gap-4">
                <h3 className="text-xl font-bold">My Achievements</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg className="size-20" viewBox="0 0 36 36">
                      <path
                        className="stroke-white/10"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="3"
                      />
                      <path
                        className="stroke-primary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeDasharray="80, 100"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-black">12</p>
                      <p className="text-xs text-white/60 -mt-1">Level</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Master Adventurer</p>
                    <div className="flex justify-between text-xs text-white/60 mt-1 mb-1">
                      <span>XP Progress</span>
                      <span>800 / 1000</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/80 font-bold mb-2">Recent Badges</p>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
                      </div>
                      <p className="text-xs text-white/60 text-center">Hot Streak</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <span className="material-symbols-outlined text-primary text-3xl">groups</span>
                      </div>
                      <p className="text-xs text-white/60 text-center">Socializer</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <span className="material-symbols-outlined text-primary text-3xl">military_tech</span>
                      </div>
                      <p className="text-xs text-white/60 text-center">First Win</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

