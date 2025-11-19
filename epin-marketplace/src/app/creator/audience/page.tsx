'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { subDays, format, parseISO } from 'date-fns';
import { SimpleLineChart, SimpleBarChart, SimpleDonutChart, LocationList } from '@/components/creator/CreatorCharts';

export default function CreatorAudiencePage() {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'custom'>('30days');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFollowers: 0,
    followerGrowth: 0,
    totalEpinSales: 0,
    conversionRate: 0,
  });
  const [salesData, setSalesData] = useState<{ label: string; value: number }[]>([]);
  const [locationData, setLocationData] = useState<{ country: string; value: number; flag: string }[]>([]);
  const [topContent, setTopContent] = useState([
    { title: 'New Valorant Skins Review', sales: 1250, conversion: 8.1 },
    { title: 'Apex Legends Tournament Stream', sales: 980, conversion: 6.5 },
    { title: 'Fortnite Item Shop Update', sales: 750, conversion: 5.2 },
  ]);

  // Mock data for missing schema tables (Age/Gender)
  const ageData = [
    { label: '13-17', value: 15 },
    { label: '18-24', value: 45 },
    { label: '25-34', value: 30 },
    { label: '35-44', value: 8 },
    { label: '45+', value: 2 },
  ];

  const genderData = [
    { label: 'Male', value: 65, color: '#00A3FF' },
    { label: 'Female', value: 30, color: '#FF00A3' },
    { label: 'Other', value: 5, color: '#A300FF' },
  ];

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/creator/audience');
        return;
      }

      // Calculate date range
      const now = new Date();
      let startDate = subDays(now, 30); // Default
      if (timeRange === '7days') startDate = subDays(now, 7);
      // Custom range implementation would go here

      // 1. Fetch Aggregated Stats (Snapshot)
      const { data: analytics } = await supabase
        .from('creator_analytics')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (analytics) {
        setStats({
          totalFollowers: analytics.total_followers || 0,
          followerGrowth: analytics.follower_growth || 0,
          totalEpinSales: analytics.total_sales || 0,
          conversionRate: analytics.conversion_rate || 0,
        });
      }

      // 2. Fetch Sales History for Line Chart
      const { data: history } = await supabase
        .from('creator_analytics')
        .select('created_at, earnings')
        .eq('creator_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (history && history.length > 0) {
        // Group by day and sum earnings
        const dailyMap = new Map<string, number>();
        // Initialize all days in range with 0
        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
          dailyMap.set(format(d, 'MMM dd'), 0);
        }

        history.forEach((item: any) => {
          const dateLabel = format(parseISO(item.created_at), 'MMM dd');
          // Only set if key exists (within range) or just set it
          dailyMap.set(dateLabel, (dailyMap.get(dateLabel) || 0) + (item.earnings || 0));
        });

        const chartData = Array.from(dailyMap.entries()).map(([label, value]) => ({
          label,
          value
        }));
        // Sort by date (simple string sort might fail for cross-month, but Map insertion order is preserved for initialized keys)
        // Re-sorting just in case
        // Actually, since we iterated startDate to now to init map, the order is correct.
        setSalesData(chartData);
      } else {
        // Fallback mock data if no history exists yet
        const mockHistory = [];
        for (let i = 0; i < (timeRange === '7days' ? 7 : 30); i++) {
          const d = subDays(now, i);
          mockHistory.unshift({
            label: format(d, 'MMM dd'),
            value: Math.floor(Math.random() * 500) + 100
          });
        }
        setSalesData(mockHistory);
      }

      // 3. Fetch Top Locations
      const { data: locations } = await supabase
        .from('creator_audience')
        .select('country, count')
        .eq('creator_id', user.id)
        .order('count', { ascending: false })
        .limit(5);

      if (locations && locations.length > 0) {
        const total = locations.reduce((sum, l) => sum + l.count, 0);
        const locData = locations.map((l: any) => ({
          country: l.country,
          value: Math.round((l.count / total) * 100),
          flag: getFlagEmoji(l.country)
        }));
        setLocationData(locData);
      } else {
        setLocationData([
          { country: 'United States', value: 45, flag: '🇺🇸' },
          { country: 'Brazil', value: 25, flag: '🇧🇷' },
          { country: 'Germany', value: 15, flag: '🇩🇪' },
          { country: 'Japan', value: 10, flag: '🇯🇵' },
          { country: 'Other', value: 5, flag: '🌍' },
        ]);
      }

      // 4. Fetch Top Content
      const { data: campaigns } = await supabase
        .from('campaign_performance')
        .select('campaign_id, campaigns(title), sales_count, conversion_rate')
        .eq('creator_id', user.id)
        .order('sales_count', { ascending: false })
        .limit(5);

      if (campaigns && campaigns.length > 0) {
        const contentData = campaigns.map((c: any) => ({
          title: c.campaigns?.title || 'Unknown Campaign',
          sales: c.sales_count || 0,
          conversion: c.conversion_rate || 0,
        }));
        setTopContent(contentData);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get flag emoji
  const getFlagEmoji = (countryName: string) => {
    const flags: { [key: string]: string } = {
      'United States': '🇺🇸', 'USA': '🇺🇸', 'US': '🇺🇸',
      'Brazil': '🇧🇷', 'Germany': '🇩🇪', 'Japan': '🇯🇵',
      'United Kingdom': '🇬🇧', 'UK': '🇬🇧', 'France': '🇫🇷',
      'Canada': '🇨🇦', 'Australia': '🇦🇺', 'India': '🇮🇳'
    };
    return flags[countryName] || '🌍';
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
                    className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium transition-colors ${isActive
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
                  className={`material-symbols-outlined text-lg ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                  {stat.changeType === 'positive' ? 'arrow_upward' : 'arrow_downward'}
                </span>
                <p
                  className={`text-sm font-medium leading-normal ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
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
              <SimpleBarChart data={ageData} />
            </div>

            {/* Gender Split & AI Insight */}
            <div className="flex flex-col gap-6">
              <div className="rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4 w-full text-left">Gender Split</h3>
                <SimpleDonutChart data={genderData} />
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

            {/* Geographical Map (Top Locations) */}
            <div className="rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4">Top Locations</h3>
              <LocationList data={locationData} />
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
              <SimpleLineChart data={salesData} />
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
