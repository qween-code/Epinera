'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import AnalyticsStats from '@/components/seller/AnalyticsStats';
import TimeRangeButtons from '@/components/seller/TimeRangeButtons';
import RevenueChart from '@/components/seller/RevenueChart';
import CustomerInsights from '@/components/seller/CustomerInsights';
import TopProducts from '@/components/seller/TopProducts';
import AIMarketIntelligence from '@/components/seller/AIMarketIntelligence';

export default function SellerAnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState('30days');
  const [analytics, setAnalytics] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push('/login?redirect=/seller/analytics');
          return;
        }

        setUser(currentUser);

        // Calculate date range
        const now = new Date();
        let startDate: Date;
        switch (activeRange) {
          case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '90days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Fetch order items for revenue calculation
        const { data: orderItems } = await supabase
          .from('order_items')
          .select(
            `
            total_price,
            quantity,
            products (
              id,
              title,
              image_url
            )
          `
          )
          .eq('seller_id', currentUser.id)
          .gte('created_at', startDate.toISOString());

        // Calculate analytics
        const totalRevenue = orderItems?.reduce((sum, item) => sum + parseFloat(item.total_price.toString()), 0) || 0;
        const unitsSold = orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

        // Mock growth calculations (in production, compare with previous period)
        const revenueGrowth = 5.2;
        const unitsGrowth = 8.1;
        const conversionRate = 4.7;
        const conversionChange = -0.3;
        const customerSatisfaction = 95;
        const satisfactionChange = 1.5;

        setAnalytics({
          totalRevenue,
          revenueGrowth,
          unitsSold,
          unitsGrowth,
          conversionRate,
          conversionChange,
          customerSatisfaction,
          satisfactionChange,
        });

        // Calculate top products
        const productMap = new Map();
        orderItems?.forEach((item: any) => {
          const productId = item.products?.id;
          if (productId) {
            const existing = productMap.get(productId) || { id: productId, title: item.products.title, image_url: item.products.image_url, unitsSold: 0, revenue: 0 };
            existing.unitsSold += item.quantity || 0;
            existing.revenue += parseFloat(item.total_price.toString());
            productMap.set(productId, existing);
          }
        });

        const topProductsList = Array.from(productMap.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setTopProducts(topProductsList);

        // Mock AI insights
        setInsights([
          {
            id: '1',
            type: 'trend',
            title: 'Market Trend Opportunity',
            description: "Demand for 'Game X' credits is up 20% this week.",
          },
          {
            id: '2',
            type: 'restock',
            title: 'Predictive Restock Alert',
            description: "Low stock on 'Game Z' skin. Predict 50 sales in next 7 days.",
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, activeRange]);

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export report');
  };

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f0f0f0] dark:bg-[#1E1E2F] font-display">
        <div className="flex w-full flex-1 flex-col items-center p-4 md:p-6 lg:p-10">
          <div className="text-center text-gray-900 dark:text-white/50">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f0f0f0] dark:bg-[#1E1E2F] font-display text-gray-900 dark:text-[#F0F0F0]">
      <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-[#f0f0f0]/80 px-4 py-3 backdrop-blur-sm dark:bg-[#1E1E2F]/80 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center gap-2 sm:gap-4 text-gray-900 dark:text-white">
          <div className="size-5 sm:size-6 text-[#4A90E2]">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fillRule="evenodd"></path>
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
        </div>
        <div className="hidden flex-1 items-center justify-center gap-4 sm:gap-6 md:gap-8 md:flex">
          <Link className="text-sm font-medium leading-normal text-gray-600 dark:text-[#F0F0F0]" href="/seller/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium leading-normal text-gray-600 dark:text-[#F0F0F0]" href="/seller/products">
            Inventory
          </Link>
          <Link className="text-sm font-medium leading-normal text-gray-600 dark:text-[#F0F0F0]" href="/seller/orders">
            Orders
          </Link>
          <Link className="text-sm font-medium leading-normal text-[#4A90E2] dark:text-[#4A90E2]" href="/seller/analytics">
            Analytics
          </Link>
          <Link className="text-sm font-medium leading-normal text-gray-600 dark:text-[#F0F0F0]" href="/seller/marketing">
            Marketing
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-gray-900 dark:bg-[#2C2C3E] dark:text-white">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-gray-900 dark:bg-[#2C2C3E] dark:text-white">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            data-alt="User profile avatar"
            style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")' }}
          />
        </div>
      </header>
      <main className="flex w-full flex-1 flex-col items-center p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="flex w-full max-w-7xl flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                Sales Analytics & Reporting
              </p>
              <p className="text-sm sm:text-base font-normal leading-normal text-gray-600 dark:text-[#F0F0F0]">
                Detailed insights into your sales performance.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex w-full sm:w-auto h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#4A90E2] px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white hover:bg-[#4A90E2]/90 transition-colors"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span className="truncate">Export Report</span>
            </button>
          </div>

          <TimeRangeButtons activeRange={activeRange} onRangeChange={setActiveRange} />

          {analytics && (
            <AnalyticsStats
              totalRevenue={analytics.totalRevenue}
              revenueGrowth={analytics.revenueGrowth}
              unitsSold={analytics.unitsSold}
              unitsGrowth={analytics.unitsGrowth}
              conversionRate={analytics.conversionRate}
              conversionChange={analytics.conversionChange}
              customerSatisfaction={analytics.customerSatisfaction}
              satisfactionChange={analytics.satisfactionChange}
            />
          )}

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
            <RevenueChart title="Revenue Trends" />
            <CustomerInsights returningPercentage={75} newPercentage={25} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <TopProducts products={topProducts} />
            <AIMarketIntelligence insights={insights} />
          </div>
        </div>
      </main>
    </div>
  );
}

