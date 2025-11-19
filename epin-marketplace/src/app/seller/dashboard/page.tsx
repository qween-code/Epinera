import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import DashboardStats from '@/components/seller/DashboardStats';
import TimeRangeSelector from '@/components/seller/TimeRangeSelector';
import PerformanceChart from '@/components/seller/PerformanceChart';
import TopSellingProducts from '@/components/seller/TopSellingProducts';
import AIInsights from '@/components/seller/AIInsights';
import RecentActivity from '@/components/seller/RecentActivity';

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/seller/dashboard');
  }

  // Fetch seller stats
  const { data: products } = await supabase
    .from('products')
    .select('id, title, status, image_url, product_variants(id, name, price, stock_quantity)')
    .eq('seller_id', user.id);

  const { data: orders } = await supabase
    .from('order_items')
    .select('id, total_price, delivery_status, created_at, products(title)')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('seller_id', user.id);

  // Calculate stats
  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_price?.toString() || '0'), 0) || 0;
  const totalOrders = orders?.length || 0;
  const averageRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 4.8;
  // Real analytics
  let productViews = 0;
  try {
    const { data: analytics } = await supabase
      .from('product_analytics')
      .select('views')
      .eq('seller_id', user.id);

    if (analytics) {
      productViews = analytics.reduce((sum, a) => sum + (a.views || 0), 0);
    }
  } catch (e) {
    console.error('Error fetching analytics', e);
  }

  const stats = {
    totalRevenue: Math.round(totalRevenue),
    totalOrders,
    rating: averageRating.toFixed(1),
    productViews,
  };

  // Real top selling products
  let topProducts: any[] = [];
  try {
    const { data: topSelling } = await supabase
      .from('order_items')
      .select(`
        product_id, 
        price, 
        products (
          title, 
          image_url
        )
      `)
      .eq('seller_id', user.id);

    if (topSelling) {
      const salesMap = new Map();
      topSelling.forEach((item: any) => {
        const pid = item.product_id;
        if (!salesMap.has(pid)) {
          salesMap.set(pid, {
            id: pid,
            name: item.products?.title || 'Unknown Product',
            type: 'Digital Product',
            revenue: 0,
            sold: 0,
            image: item.products?.image_url || 'https://via.placeholder.com/400',
          });
        }
        const p = salesMap.get(pid);
        p.revenue += parseFloat(item.price?.toString() || '0');
        p.sold += 1;
      });

      topProducts = Array.from(salesMap.values())
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);
    }
  } catch (e) {
    console.error('Error fetching top products', e);
  }

  // Recent activities
  const activities = [
    {
      id: '1',
      type: 'order' as const,
      message: 'New order #8452 for $49.99',
      time: '2 minutes ago',
      isPositive: true,
    },
    {
      id: '2',
      type: 'review' as const,
      message: 'Jane Doe left a 5-star review',
      time: '15 minutes ago',
      isPositive: true,
    },
    {
      id: '3',
      type: 'order' as const,
      message: 'New order #8451 for $19.99',
      time: '1 hour ago',
      isPositive: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* PageHeading and Chips */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Welcome back, {user.email?.split('@')[0] || 'Seller'}!
          </p>
          <p className="text-slate-400 text-base font-normal leading-normal">
            Here's a look at your store's performance.
          </p>
        </div>
        <TimeRangeSelector />
      </div>

      {/* Stats Component */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column: Performance Chart & Top Products */}
        <div className="col-span-3 lg:col-span-2 flex flex-col gap-8">
          <PerformanceChart />
          <TopSellingProducts products={topProducts} />
        </div>

        {/* Right Column: AI Insights & Recent Activity */}
        <div className="col-span-3 lg:col-span-1 flex flex-col gap-8">
          <AIInsights />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
