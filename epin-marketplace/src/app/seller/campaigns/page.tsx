'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Campaign {
  id: string;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  metadata?: any;
}

export default function SellerCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({
    totalActive: 0,
    totalSpend: 0,
    overallROI: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/seller/campaigns');
          return;
        }

        // Check if user is seller
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!profile || (profile.role !== 'seller' && profile.role !== 'admin')) {
          router.push('/');
          return;
        }

        // Fetch campaigns created by seller (seller campaigns are stored with seller_id in metadata or separate table)
        // For now, using campaigns table with creator_id as seller_id
        let query = supabase
          .from('campaigns')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        if (typeFilter !== 'all') {
          query = query.eq('campaign_type', typeFilter);
        }
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data: campaignsData, error } = await query;

        if (error) throw error;
        setCampaigns(campaignsData || []);

        // Calculate stats
        const activeCampaigns = campaignsData?.filter((c) => c.status === 'active') || [];
        const totalActive = activeCampaigns.length;
        // Total spend would come from campaign budget tracking (metadata or separate table)
        const totalSpend = campaignsData?.reduce((sum, c) => sum + (parseFloat(c.metadata?.budget || '0') || 0), 0) || 0;
        // ROI calculation would come from campaign performance data
        const overallROI = 15.2; // This would be calculated from actual performance data

        setStats({
          totalActive,
          totalSpend,
          overallROI,
        });
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router, statusFilter, typeFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      active: { label: 'Active', className: 'text-green-300 bg-green-500/20' },
      scheduled: { label: 'Scheduled', className: 'text-orange-300 bg-orange-500/20' },
      ended: { label: 'Ended', className: 'text-gray-300 bg-gray-500/20' },
      draft: { label: 'Draft', className: 'text-gray-300 bg-gray-500/20' },
    };
    const statusInfo = statusMap[status] || { label: status, className: 'text-gray-300 bg-gray-500/20' };
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getBudgetUsed = (campaign: Campaign) => {
    const budget = parseFloat(campaign.metadata?.budget || '0') || 0;
    const spent = parseFloat(campaign.metadata?.spent || '0') || 0;
    return budget > 0 ? Math.round((spent / budget) * 100) : 0;
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* SideNavBar */}
      <aside className="w-64 flex-shrink-0 bg-[#101d23] p-4 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="Store profile picture"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvdc3Sh4EIy6ZG2GGtBR5E1lqJjyO7blHmf9AmuOFx1aOtZHybfOslsy4g4hV_Tr06K0Cn6QegAg2C9VC8zwq5lnmvycoqEXO_UwMOoc1Rl1D4M7filU3aAd0jbW_Yt1dvtUai0_pVM9Kz1J1y39995fcTFoSTj8SHmLM03HHhEvJfXWuQOlCaMor411lScLvS15rDiIm2piTdcHBfSBSL6nOW_uGfnJZu1kpHhTezyf-FzgogDvjjf2xVnZDxVqQfjNvOjcm-uU05")',
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">Mehmet's Store</h1>
              <p className="text-gray-400 text-sm font-normal leading-normal">Seller Account</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <Link className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded" href="/seller/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded bg-primary/20 text-primary" href="/seller/campaigns">
              <span className="material-symbols-outlined">campaign</span>
              <p className="text-sm font-medium leading-normal">Campaigns</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded" href="/seller/analytics">
              <span className="material-symbols-outlined">pie_chart</span>
              <p className="text-sm font-medium leading-normal">Analytics</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded" href="/seller/products">
              <span className="material-symbols-outlined">inventory</span>
              <p className="text-sm font-medium leading-normal">Products</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded" href="/seller/orders">
              <span className="material-symbols-outlined">receipt_long</span>
              <p className="text-sm font-medium leading-normal">Orders</p>
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-1">
          <Link className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded" href="/seller/settings">
            <span className="material-symbols-outlined">settings</span>
            <p className="text-sm font-medium leading-normal">Settings</p>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded" href="/support">
            <span className="material-symbols-outlined">help</span>
            <p className="text-sm font-medium leading-normal">Help</p>
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium leading-normal">Logout</p>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* PageHeading */}
          <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Campaign Management</h1>
              <p className="text-gray-400 text-base font-normal leading-normal">Create and oversee your promotional activities.</p>
            </div>
            <Link
              href="/seller/campaigns/create"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              <span className="truncate">Create New Campaign</span>
            </Link>
          </header>

          {/* Stats */}
          <section className="mb-8">
            <h2 className="text-white text-lg font-bold mb-3">Campaign Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-[#16252d] border border-white/10">
                <p className="text-gray-300 text-base font-medium leading-normal">Total Active Campaigns</p>
                <p className="text-white tracking-light text-3xl font-bold leading-tight">{stats.totalActive}</p>
                <p className="text-green-400 text-sm font-medium leading-normal flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">arrow_upward</span>
                  +2 this month
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-[#16252d] border border-white/10">
                <p className="text-gray-300 text-base font-medium leading-normal">Total Spend</p>
                <p className="text-white tracking-light text-3xl font-bold leading-tight">${stats.totalSpend.toLocaleString()}</p>
                <p className="text-green-400 text-sm font-medium leading-normal flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">arrow_upward</span>
                  +$300 this week
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-[#16252d] border border-white/10">
                <p className="text-gray-300 text-base font-medium leading-normal">Overall ROI</p>
                <p className="text-white tracking-light text-3xl font-bold leading-tight">{stats.overallROI}%</p>
                <p className="text-green-400 text-sm font-medium leading-normal flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">arrow_upward</span>
                  +1.5%
                </p>
              </div>
            </div>
          </section>

          {/* Campaign List */}
          <section>
            <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-4">My Campaigns</h2>
            {/* ToolBar */}
            <div className="flex justify-between items-center gap-4 p-4 bg-[#16252d] rounded-lg border border-white/10 mb-6 flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative min-w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input
                    className="bg-[#101c22] border border-white/10 text-white text-sm rounded w-full h-10 pl-10 pr-4 focus:ring-primary focus:border-primary"
                    placeholder="Search campaigns..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="bg-[#101c22] border border-white/10 text-white text-sm rounded h-10 pl-3 pr-8 focus:ring-primary focus:border-primary"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Status: All</option>
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="ended">Ended</option>
                  </select>
                  <select
                    className="bg-[#101c22] border border-white/10 text-white text-sm rounded h-10 pl-3 pr-8 focus:ring-primary focus:border-primary"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">Type: All</option>
                    <option value="discount">Discount</option>
                    <option value="loyalty">Loyalty</option>
                    <option value="social">Social</option>
                  </select>
                </div>
              </div>
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded h-10 bg-transparent border border-white/20 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-white/10">
                <span className="material-symbols-outlined text-xl">sort</span>
                <span className="truncate">Sort by Date</span>
              </button>
            </div>

            {/* Campaign Cards */}
            {loading ? (
              <div className="text-center text-white/50 py-8">Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
              <div className="text-center text-white/50 py-8">No campaigns found. Create your first campaign!</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {campaigns.map((campaign) => {
                  const budgetUsed = getBudgetUsed(campaign);
                  const daysRemaining = getDaysRemaining(campaign.end_date);
                  const isEnded = campaign.status === 'ended';

                  return (
                    <div key={campaign.id} className="bg-[#16252d] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-white text-lg font-bold">{campaign.name}</h3>
                          <p className="text-gray-400 text-sm capitalize">{campaign.campaign_type} Campaign</p>
                        </div>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span className="text-gray-400">Conversions</span>
                        <strong>{campaign.metadata?.conversions || '-'}</strong>
                      </div>
                      <div className="w-full bg-[#101c22] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            campaign.status === 'active' ? 'bg-green-500' : campaign.status === 'scheduled' ? 'bg-orange-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${budgetUsed}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>
                          {isEnded
                            ? `Ended on ${new Date(campaign.end_date).toLocaleDateString()}`
                            : daysRemaining > 0
                            ? `Ends in ${daysRemaining} days`
                            : 'Ended'}
                        </span>
                        <span>{budgetUsed}% Budget Used</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded text-sm font-bold bg-white/10 text-white hover:bg-white/20">
                          <span className="material-symbols-outlined text-base">visibility</span>
                          View
                        </button>
                        <Link
                          href={`/seller/campaigns/${campaign.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded text-sm font-bold bg-white/10 text-white hover:bg-white/20"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                          Edit
                        </Link>
                        <button className="h-9 w-9 flex items-center justify-center rounded bg-white/10 text-white hover:bg-white/20">
                          <span className="material-symbols-outlined text-base">more_horiz</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

