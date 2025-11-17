'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function CreatorDashboardPage() {
  const [stats, setStats] = useState({
    liveViewers: 1204,
    realTimeEarnings: 84.5,
    clicksToday: 512,
    conversionsToday: 32,
  });
  const [activeCampaign, setActiveCampaign] = useState<any>(null);
  const [totalEarnings, setTotalEarnings] = useState(4521.8);
  const [nextPayout, setNextPayout] = useState(350.0);
  const supabase = createClient();

  useEffect(() => {
    fetchCampaigns();
    fetchEarnings();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('creator_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (campaigns) {
        setActiveCampaign(campaigns);
      } else {
        // Mock data for demo
        setActiveCampaign({
          id: '1',
          title: 'Summer Game Fest Sale',
          description: 'Promote our latest titles and get 15% commission on all sales. Use the assets below!',
          promo_code: 'SUMMERSTREAM',
          commission_rate: 15,
          image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        });
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // TODO: Calculate from actual campaign earnings
      // For now, using mock data
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const statCards = [
    {
      label: 'Live Viewers',
      value: stats.liveViewers.toLocaleString(),
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      label: 'Real-Time Earnings',
      value: `$${stats.realTimeEarnings.toFixed(2)}`,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      label: 'Clicks Today',
      value: stats.clicksToday.toLocaleString(),
      change: '-2%',
      changeType: 'negative' as const,
    },
    {
      label: 'Conversions Today',
      value: stats.conversionsToday.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="p-8">
      {/* PageHeading */}
      <div className="flex flex-wrap justify-between gap-3 mb-6">
        <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="flex flex-1 flex-col gap-2 rounded-xl p-6 bg-white/5 border border-white/10">
            <p className="text-gray-600 dark:text-gray-400 text-base font-medium leading-normal">{stat.label}</p>
            <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">{stat.value}</p>
            <p
              className={`text-base font-medium leading-normal ${
                stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Section: Live Stream Integration */}
      <section>
        <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
          Live Stream Integration
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Campaign Card */}
          <div className="lg:col-span-2">
            <div className="p-4 @container bg-white/5 rounded-xl border border-white/10 h-full">
              <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start h-full">
                <div
                  className="w-full @xl:w-1/3 h-48 @xl:h-full bg-center bg-no-repeat aspect-video @xl:aspect-auto bg-cover rounded-xl"
                  style={{
                    backgroundImage: `url(${activeCampaign?.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'})`,
                  }}
                ></div>
                <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 py-4 @xl:px-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">Active Campaign</p>
                  <p className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    {activeCampaign?.title || 'No Active Campaign'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                    {activeCampaign?.description || 'Create a campaign to start earning commissions!'}
                  </p>
                  {activeCampaign?.promo_code && (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">Promo Code:</p>
                      <span className="bg-primary/20 text-primary text-sm font-mono px-3 py-1 rounded">
                        {activeCampaign.promo_code}
                      </span>
                    </div>
                  )}
                  <Link
                    href="/creator/campaigns"
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal mt-4"
                  >
                    <span className="truncate">View Campaign Details</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Overlay Integration */}
          <div className="flex flex-col gap-4 justify-between rounded-xl p-6 bg-white/5 border border-white/10">
            <div className="flex flex-col gap-2">
              <h3 className="text-black dark:text-white text-lg font-bold leading-tight">Chat Overlay Bot</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Integrate our bot to automatically share campaign links and codes in your stream chat.
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-400">
              <span className="material-symbols-outlined">check_circle</span>
              <p className="text-sm font-medium">Status: Connected</p>
            </div>
            <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-medium leading-normal">
              <span className="truncate">Configure Bot</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section: Content Tools & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Section: Content Creation Tools */}
          <section>
            <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
              Content Creation Tools
            </h2>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-black dark:text-white text-lg font-bold">Branded Link Generator</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Create a unique tracked link for any product.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  className="flex-grow bg-background-light dark:bg-background-dark border border-white/20 rounded-lg px-3 py-2 text-black dark:text-white placeholder-gray-500 focus:ring-primary focus:border-primary"
                  placeholder="Paste product URL here..."
                  type="text"
                />
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal">
                  <span className="truncate">Generate Link</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section: Asset Download Center */}
          <section>
            <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
              Asset Download Center
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Brand Logos', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200' },
                { name: 'Banners', image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=200' },
                { name: 'Stream Overlays', image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200' },
              ].map((asset, index) => (
                <div key={index} className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 bg-white/5 border border-white/10">
                  <div className="flex items-center justify-center h-20 w-full bg-background-light dark:bg-background-dark rounded-lg">
                    <img className="max-h-12" src={asset.image} alt={asset.name} />
                  </div>
                  <p className="text-black dark:text-white text-sm font-medium">{asset.name}</p>
                  <button className="w-full text-primary text-sm font-medium hover:underline">Download</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Section: Revenue Management */}
          <section>
            <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
              Revenue Management
            </h2>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Earnings</p>
                <p className="text-black dark:text-white text-3xl font-bold">${totalEarnings.toFixed(2)}</p>
              </div>
              <hr className="border-white/10" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Next Payout</p>
                  <p className="text-black dark:text-white text-lg font-medium">${nextPayout.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-right">Payout Date</p>
                  <p className="text-black dark:text-white text-lg font-medium">July 15, 2024</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  href="/creator/revenue"
                  className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal"
                >
                  <span className="truncate">View Payout History</span>
                </Link>
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-medium leading-normal">
                  <span className="truncate">Tax Documents</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section: Audience Insights */}
          <section>
            <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
              Audience Insights
            </h2>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-black dark:text-white text-lg font-bold mb-1">Top Follower Locations</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Based on your last 30 days</p>
              <div className="flex flex-col gap-3">
                {[
                  { country: 'United States', percentage: 32 },
                  { country: 'United Kingdom', percentage: 18 },
                  { country: 'Germany', percentage: 12 },
                  { country: 'France', percentage: 8 },
                ].map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <p className="text-black dark:text-white text-sm font-medium">{location.country}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium w-8 text-right">
                        {location.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

