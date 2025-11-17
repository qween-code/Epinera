'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreatorCampaignsPage() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'campaigns' | 'analytics'>('integrations');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState([
    { platform: 'twitch', connected: true, name: 'Twitch' },
    { platform: 'youtube', connected: false, name: 'YouTube' },
    { platform: 'instagram', connected: false, name: 'Instagram' },
  ]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (activeTab === 'campaigns') {
      fetchCampaigns();
    }
  }, [activeTab]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/creator/campaigns');
        return;
      }

      const { data: campaignsData, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(campaignsData || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPlatform = async (platform: string) => {
    // TODO: Implement OAuth flow for platform integration
    setIntegrations((prev) =>
      prev.map((int) => (int.platform === platform ? { ...int, connected: true } : int))
    );
  };

  const handleDisconnectPlatform = async (platform: string) => {
    setIntegrations((prev) =>
      prev.map((int) => (int.platform === platform ? { ...int, connected: false } : int))
    );
  };

  const tabs = [
    { id: 'integrations', label: 'Platform Integrations' },
    { id: 'campaigns', label: 'My Campaigns' },
    { id: 'analytics', label: 'Performance Analytics' },
  ];

  const platformLogos: Record<string, string> = {
    twitch: 'https://cdn.simpleicons.org/twitch/9146FF',
    youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
    instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
  };

  const platformDescriptions: Record<string, string> = {
    twitch: 'Track stream performance and sponsored content.',
    youtube: 'Monitor video campaigns and affiliate link clicks.',
    instagram: 'Analyze stories, posts, and Reels performance.',
  };

  return (
    <div className="flex-1 p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* PageHeading */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-800 dark:text-white text-4xl font-black leading-tight tracking-tight">
              Campaign Integration & Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
              Integrate your platforms, create campaigns, and track your performance.
            </p>
          </div>
          <button
            onClick={() => router.push('/creator/campaigns/create')}
            className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="truncate">Create New Campaign</span>
          </button>
        </header>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-slate-200 dark:border-white/10 gap-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-1 transition-colors ${
                    isActive
                      ? 'border-b-primary text-slate-900 dark:text-white'
                      : 'border-b-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-wide">{tab.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'integrations' && (
          <section>
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight mb-2">
              Connect Your Platforms
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal mb-6">
              Integrate your accounts to track cross-platform campaign performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <div
                  key={integration.platform}
                  className="flex flex-col p-6 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <img
                      className="h-8 w-8 dark:invert-0"
                      src={platformLogos[integration.platform]}
                      alt={`${integration.name} Logo`}
                    />
                    <div
                      className={`flex items-center gap-2 text-sm font-medium ${
                        integration.connected ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {integration.connected ? (
                        <>
                          <span className="material-symbols-outlined text-base">check_circle</span>
                          <span>Connected</span>
                        </>
                      ) : (
                        <span>Not Connected</span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{integration.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow">
                    {platformDescriptions[integration.platform]}
                  </p>
                  {integration.connected ? (
                    <button
                      onClick={() => handleDisconnectPlatform(integration.platform)}
                      className="w-full flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-red-600/10 text-red-500 text-sm font-bold leading-normal tracking-wide hover:bg-red-600/20 transition-colors"
                    >
                      <span>Disconnect</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectPlatform(integration.platform)}
                      className="w-full flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
                    >
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'campaigns' && (
          <section>
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight mb-2">
              My Campaigns
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal mb-6">
              Manage your active and past campaigns.
            </p>
            {loading ? (
              <div className="text-center py-16">
                <div className="text-slate-500 dark:text-slate-400">Loading campaigns...</div>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No campaigns yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first campaign to start earning!</p>
                <button
                  onClick={() => router.push('/creator/campaigns/create')}
                  className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors mx-auto"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  <span className="truncate">Create Campaign</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex flex-col p-6 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          campaign.status === 'active'
                            ? 'bg-green-500/20 text-green-500'
                            : campaign.status === 'draft'
                            ? 'bg-gray-500/20 text-gray-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {campaign.status.toUpperCase()}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{campaign.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                      {campaign.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">campaign</span>
                        {campaign.campaign_type}
                      </span>
                    </div>
                    <Link
                      href={`/creator/campaigns/${campaign.id}`}
                      className="w-full flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
                    >
                      <span>View Details</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'analytics' && (
          <section>
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight mb-2">
              Performance Analytics
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal mb-6">
              Track your campaign performance across all platforms.
            </p>
            <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Analytics Coming Soon</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Detailed performance metrics and analytics will be available here.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

