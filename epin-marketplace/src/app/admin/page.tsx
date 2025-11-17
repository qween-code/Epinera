import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  // Fetch platform stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Fetch recent transactions
  const { data: recentTransactions } = await supabase
    .from('wallet_transactions')
    .select(`
      id,
      amount,
      currency,
      status,
      transaction_type,
      created_at,
      profiles!wallet_transactions_user_id_fkey(id, full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  // Calculate 24h stats (mock for now)
  const activeUsers = totalUsers || 0;
  const salesVolume24h = 54120;
  const revenue24h = 18942;
  const avgTransactionValue = 38.03;

  return (
    <main className="flex-1 overflow-y-auto">
      {/* TopNavBar */}
      <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-background-light/80 px-8 py-4 backdrop-blur-sm dark:border-white/10 dark:bg-background-dark/80">
        <label className="relative flex min-w-40 max-w-sm flex-col">
          <div className="flex w-full flex-1 items-stretch">
            <div className="flex items-center justify-center pl-4 text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-2xl">search</span>
            </div>
            <input
              className="w-full flex-1 resize-none overflow-hidden border-none bg-transparent text-black placeholder:text-gray-500 focus:outline-0 focus:ring-0 dark:text-white dark:placeholder:text-gray-400"
              placeholder="Search for users, transactions, reports..."
              type="text"
            />
          </div>
        </label>
        <div className="flex items-center gap-4">
          <Link
            href="/notifications"
            className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
          </Link>
          <div
            className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat"
            data-alt="Admin avatar"
            style={{
              backgroundImage: profile.avatar_url
                ? `url('${profile.avatar_url}')`
                : 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=admin")',
            }}
          ></div>
        </div>
      </header>

      <div className="p-8">
        {/* PageHeading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
              Super Admin Dashboard
            </p>
            <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
              Real-time overview of platform activity and system health.
            </p>
          </div>
          <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-100 px-4 text-sm font-bold leading-normal tracking-[0.015em] text-black hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
            <span className="material-symbols-outlined text-lg">edit_note</span>
            <span className="truncate">Customize Dashboard</span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-400">Active Users</p>
            <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
              {activeUsers.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-green-500">arrow_upward</span>
              <p className="text-sm font-medium leading-normal text-green-500">+1.5%</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-400">Sales Volume (24h)</p>
            <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
              ${salesVolume24h.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-red-500">arrow_downward</span>
              <p className="text-sm font-medium leading-normal text-red-500">-0.8%</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-400">Revenue (24h)</p>
            <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
              ${revenue24h.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-green-500">arrow_upward</span>
              <p className="text-sm font-medium leading-normal text-green-500">+2.1%</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-400">
              Avg. Transaction Value
            </p>
            <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
              ${avgTransactionValue.toFixed(2)}
            </p>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-green-500">arrow_upward</span>
              <p className="text-sm font-medium leading-normal text-green-500">+0.5%</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Platform Monitoring */}
            <div className="flex flex-col">
              <h2 className="px-1 pb-3 pt-2 text-xl font-bold leading-tight tracking-tight text-black dark:text-white">
                Platform Monitoring
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black dark:text-white">Transaction Volume</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 Days</p>
                    <span className="material-symbols-outlined text-lg text-gray-500 dark:text-gray-400">expand_more</span>
                  </div>
                </div>
                <div className="mt-4 h-64 w-full flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm">Transaction Volume Chart Placeholder</p>
                </div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="flex flex-col">
              <h2 className="px-1 pb-3 pt-2 text-xl font-bold leading-tight tracking-tight text-black dark:text-white">
                Recent Transactions
              </h2>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                  <thead className="bg-gray-50 dark:bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" scope="col">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" scope="col">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" scope="col">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" scope="col">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" scope="col">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm text-gray-900 dark:divide-white/10 dark:text-gray-200">
                    {recentTransactions && recentTransactions.length > 0 ? (
                      recentTransactions.slice(0, 4).map((transaction: any) => {
                        const user = transaction.profiles;
                        const statusColors = {
                          completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
                          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
                          failed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
                        };
                        return (
                          <tr key={transaction.id}>
                            <td className="whitespace-nowrap px-6 py-4 font-mono text-gray-500 dark:text-gray-400">
                              #{transaction.id.substring(0, 8).toUpperCase()}...
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">{user?.full_name || 'Unknown'}</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              ${Math.abs(parseFloat(transaction.amount.toString())).toFixed(2)} {transaction.currency}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  statusColors[transaction.status as keyof typeof statusColors] ||
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                                }`}
                              >
                                {transaction.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Security Alerts */}
            <div className="flex flex-col">
              <h2 className="px-1 pb-3 pt-2 text-xl font-bold leading-tight tracking-tight text-black dark:text-white">
                Security Alerts
              </h2>
              <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-6 dark:border-red-500/60 dark:bg-red-500/20">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-2xl text-red-500 dark:text-red-400">error</span>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-black dark:text-white">Potential Fraud Detected</h3>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      High-volume transactions from a new user account have been flagged. Review required.
                    </p>
                    <Link href="/admin/security" className="mt-3 w-fit text-sm font-bold text-primary hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="flex flex-col">
              <h2 className="px-1 pb-3 pt-2 text-xl font-bold leading-tight tracking-tight text-black dark:text-white">
                System Health
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-300">Overall Status</p>
                    <div className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      All Systems Operational
                    </div>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-300">API Latency</p>
                    <span className="font-medium text-black dark:text-white">42ms</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-300">Database Load</p>
                    <span className="font-medium text-black dark:text-white">18%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-300">Blockchain Node</p>
                    <div className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      Synced
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* AI Insights */}
            <div className="flex flex-col">
              <h2 className="px-1 pb-3 pt-2 text-xl font-bold leading-tight tracking-tight text-black dark:text-white">
                AI Insights
              </h2>
              <div className="rounded-xl border border-primary/50 bg-primary/10 p-6 dark:border-primary/60 dark:bg-primary/20">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-2xl text-primary dark:text-primary/90">
                    model_training
                  </span>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-black dark:text-white">Weekend Sales Projection</h3>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      Sales are projected to increase by 15% this weekend based on current trends and historical data for
                      "Game X".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
