'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function CreatorAudiencePage() {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'custom'>('30days');
  const [stats, setStats] = useState({
    totalFollowers: 125430,
    followerGrowth: 1200,
    totalEpinSales: 15820,
    conversionRate: 4.2,
  });
  const [topContent, setTopContent] = useState([
    { title: 'New Valorant Skins Review', sales: 1250, conversion: 8.1 },
    { title: 'Apex Legends Tournament Stream', sales: 980, conversion: 6.5 },
    { title: 'Fortnite Item Shop Update', sales: 750, conversion: 5.2 },
  ]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/creator/audience');
        return;
      }

      // TODO: Fetch real analytics data from campaigns and user_events tables
      // For now, using mock data
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const statCards = [
    {
      label: 'Total Followers',
      value: stats.totalFollowers.toLocaleString(),
      change: '+5.1%',
      changeType: 'positive' as const,
    },
    {
      label: 'Follower Growth',
      value: stats.followerGrowth.toLocaleString(),
      change: '+2.3%',
      changeType: 'positive' as const,
    },
    {
      label: 'Total Epin Sales',
      value: `$${stats.totalEpinSales.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      label: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: '-0.8%',
      changeType: 'negative' as const,
    },
  ];

  const timeRangeOptions = [
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: 'custom', label: 'Custom Range', icon: 'calendar_month' },
  ];

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* PageHeading */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Audience Analytics</p>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
              Understand your audience and optimize your content.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Chips */}
            <div className="flex gap-2">
              {timeRangeOptions.map((option) => {
                const isActive = timeRange === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setTimeRange(option.id as any)}
                    className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/90 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{option.label}</span>
                    {option.icon && <span className="material-symbols-outlined text-base">{option.icon}</span>}
                  </button>
                );
              })}
            </div>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-slate-700 dark:bg-slate-800 text-white text-sm font-bold leading-normal tracking-wide">
              <span className="material-symbols-outlined text-lg">download</span>
              <span className="truncate">Export</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-normal">{stat.label}</p>
              <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
                {stat.value}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className={`material-symbols-outlined text-lg ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.changeType === 'positive' ? 'arrow_upward' : 'arrow_downward'}
                </span>
                <p
                  className={`text-sm font-medium leading-normal ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Audience Demographics Section */}
        <div className="mb-8">
          <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight px-1 pb-4">
            Audience Demographics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Age Demographics Chart */}
            <div className="rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4">Age Demographics</h3>
              <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Age Chart Placeholder</p>
              </div>
            </div>

            {/* Gender Split & AI Insight */}
            <div className="flex flex-col gap-6">
              <div className="rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4">Gender Split</h3>
                <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Gender Chart Placeholder</p>
                </div>
              </div>
              <div className="rounded-xl p-6 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                  <h3 className="text-slate-800 dark:text-white font-semibold">AI Insights</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Your audience from Brazil is growing fast. Consider promoting Epins popular in that region to boost
                  sales.
                </p>
              </div>
            </div>

            {/* Geographical Map */}
            <div className="rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4">Top Locations</h3>
              <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">World Map Placeholder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales & Content Performance */}
        <div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight px-1 pb-4">
            Sales & Content Performance
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Sales Over Time */}
            <div className="lg:col-span-3 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4">Epin Sales Over Time</h3>
              <div className="w-full h-80 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Sales Chart Placeholder</p>
              </div>
            </div>

            {/* Top Performing Content Table */}
            <div className="lg:col-span-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4">Top Performing Content</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 pr-3" scope="col">
                        Content
                      </th>
                      <th className="py-3 px-3 text-right" scope="col">
                        Sales
                      </th>
                      <th className="py-3 pl-3 text-right" scope="col">
                        Conv.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topContent.map((content, index) => (
                      <tr key={index} className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3 pr-3 font-medium text-slate-800 dark:text-slate-200 truncate">
                          {content.title}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">
                          ${content.sales.toLocaleString()}
                        </td>
                        <td className="py-3 pl-3 text-right text-green-500">{content.conversion}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

