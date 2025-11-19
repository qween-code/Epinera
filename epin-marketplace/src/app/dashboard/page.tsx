import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardStats from './components/DashboardStats';
import ActivityTimeline from './components/ActivityTimeline';
import QuickActions from './components/QuickActions';
import RecommendedProducts from './components/RecommendedProducts';

export default async function EnhancedDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch user stats
  const { data: orders } = await supabase
    .from('orders')
    .select('id, total_amount, status')
    .eq('user_id', user.id);

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', user.id);

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0) || 0;
  const totalReviews = reviews?.length || 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      <div className="relative flex w-full flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 sm:px-10 lg:px-20 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white text-lg font-bold">
              Epin Marketplace
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-white/70 hover:text-white flex items-center gap-2"
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-white/70 hover:text-white flex items-center gap-2"
              >
                <span className="material-symbols-outlined">logout</span>
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main className="px-4 sm:px-10 lg:px-20 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {profile?.full_name || user.email}!
              </h1>
              <p className="text-white/70">Here's what's happening with your account</p>
            </div>

            {/* Stats Cards */}
            <DashboardStats
              totalOrders={totalOrders}
              totalSpent={totalSpent}
              totalReviews={totalReviews}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Left Column - Activity + Quick Actions */}
              <div className="lg:col-span-2 space-y-6">
                <ActivityTimeline userId={user.id} />
                <QuickActions />
              </div>

              {/* Right Column - Recommendations */}
              <div>
                <RecommendedProducts userId={user.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
