'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface FinancialStats {
  grossMerchandiseValue: number;
  netRevenue: number;
  commissionRevenue: number;
  paymentProcessingCosts: number;
  chargebackLosses: number;
}

interface Transaction {
  id: string;
  transaction_id: string;
  date: string;
  product: string;
  amount: number;
  status: string;
  payment_method: string;
}

export default function AdminFinancialPage() {
  const router = useRouter();
  const [stats, setStats] = useState<FinancialStats>({
    grossMerchandiseValue: 0,
    netRevenue: 0,
    commissionRevenue: 0,
    paymentProcessingCosts: 0,
    chargebackLosses: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'costs' | 'compliance'>('overview');
  const [dateRange, setDateRange] = useState({ start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/admin/financial');
          return;
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!profile || profile.role !== 'admin') {
          router.push('/');
          return;
        }

        // Fetch financial stats from orders and wallet_transactions
        const startDate = dateRange.start.toISOString();
        const endDate = dateRange.end.toISOString();

        // Calculate GMV (Gross Merchandise Value) from orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total_amount, currency')
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .eq('status', 'delivered');

        const gmv = ordersData?.reduce((sum, order) => sum + parseFloat(order.total_amount?.toString() || '0'), 0) || 0;

        // Calculate commission revenue (assuming 10% commission)
        const commissionRevenue = gmv * 0.1;

        // Calculate net revenue (GMV - refunds - chargebacks)
        const { data: refundsData } = await supabase
          .from('wallet_transactions')
          .select('amount')
          .eq('transaction_type', 'refund')
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        const refunds = refundsData?.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount?.toString() || '0')), 0) || 0;
        const netRevenue = gmv - refunds;

        // Calculate payment processing costs (assuming 2.9% + $0.30 per transaction)
        const { data: transactionsCount } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .eq('status', 'delivered');

        const transactionCount = transactionsCount?.length || 0;
        const paymentProcessingCosts = gmv * 0.029 + transactionCount * 0.3;

        // Calculate chargeback losses
        const { data: chargebacksData } = await supabase
          .from('wallet_transactions')
          .select('amount')
          .eq('transaction_type', 'chargeback')
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        const chargebackLosses = chargebacksData?.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount?.toString() || '0')), 0) || 0;

        setStats({
          grossMerchandiseValue: gmv,
          netRevenue,
          commissionRevenue,
          paymentProcessingCosts,
          chargebackLosses,
        });

        // Fetch recent transactions
        const { data: transactionsData } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            currency,
            created_at,
            status,
            order_items (
              product:products (
                title
              )
            )
          `)
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .order('created_at', { ascending: false })
          .limit(50);

        const mappedTransactions: Transaction[] = (transactionsData || []).map((order: any) => ({
          id: order.id,
          transaction_id: `#TXN${order.id.substring(0, 5).toUpperCase()}`,
          date: order.created_at,
          product: order.order_items?.[0]?.product?.title || 'N/A',
          amount: parseFloat(order.total_amount?.toString() || '0'),
          status: order.status,
          payment_method: 'Credit Card', // This would come from payment metadata
        }));

        setTransactions(mappedTransactions);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router, dateRange]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      delivered: { label: 'Completed', className: 'bg-green-900 text-green-300' },
      processing: { label: 'Pending', className: 'bg-yellow-900 text-yellow-300' },
      cancelled: { label: 'Failed', className: 'bg-red-900 text-red-300' },
    };
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-900 text-gray-300' };
    return (
      <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <div className="flex h-full w-full">
        {/* SideNavBar */}
        <aside className="flex h-auto min-h-screen w-64 flex-col justify-between bg-[#101d23] p-4 border-r border-slate-800">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt="Admin user avatar"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaGU4aGeQjvlK7tpclWwt7MUoaePzQFVO9zwU50D3Vfu5eljP0554HQpIREKeWfMUIWlZ43fopHTnRtF0vxv_YWA19-H_XOgyJAzi2jZZnhlenoMvTfw-YjOxZs2JXVZKA5qRpfZCYdULE_jqoT3JPaVx4PhTUExS_Ga2TT772sfunwOC6EC2mBY8sZoNddv-iQRzFVtstMvRHoLO-In8lj9HEeIeAXBBLemzVSjPAUauQ1EE03JrjlDa19T1gHteO7ZOiRo_aHaVR")',
                }}
              />
              <div className="flex flex-col">
                <h1 className="text-white text-base font-medium leading-normal">Admin Fatma</h1>
                <p className="text-[#90b8cb] text-sm font-normal leading-normal">Administrator</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#223d49] transition-colors"
                href="/admin"
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                  dashboard
                </span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
                href="/admin/financial"
              >
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
                >
                  monitoring
                </span>
                <p className="text-sm font-medium leading-normal">Financial Reporting</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#223d49] transition-colors"
                href="/admin/users"
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                  group
                </span>
                <p className="text-sm font-medium leading-normal">User Management</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#223d49] transition-colors"
                href="/admin/content"
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                  folder
                </span>
                <p className="text-sm font-medium leading-normal">Content</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#223d49] transition-colors"
                href="/admin/settings"
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                  settings
                </span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity">
              <span className="truncate">New Report</span>
            </button>
            <div className="flex flex-col gap-1">
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#223d49] transition-colors"
                href="/support"
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                  help_center
                </span>
                <p className="text-sm font-medium leading-normal">Help Center</p>
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#223d49] transition-colors text-left"
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                  logout
                </span>
                <p className="text-sm font-medium leading-normal">Logout</p>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <p className="text-white text-3xl font-black leading-tight tracking-[-0.033em]">Financial Reporting</p>
                <p className="text-[#90b8cb] text-base font-normal leading-normal">Advanced analytics for strategic management.</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Date Range Picker */}
                <div className="flex items-center gap-2 rounded-lg bg-[#223d49] p-2">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                    calendar_today
                  </span>
                  <p className="text-white text-sm font-medium">
                    {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
                  </p>
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                    arrow_drop_down
                  </span>
                </div>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#223d49] text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                    download
                  </span>
                  <span className="truncate">Download Summary</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="pb-3 mb-6">
              <div className="flex border-b border-[#315768] gap-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'overview'
                      ? 'border-b-primary text-white'
                      : 'border-b-transparent text-[#90b8cb] hover:text-white'
                  }`}
                >
                  <p className="text-white text-sm font-bold leading-normal tracking-[0.015em]">Overview</p>
                </button>
                <button
                  onClick={() => setActiveTab('revenue')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'revenue'
                      ? 'border-b-primary text-white'
                      : 'border-b-transparent text-[#90b8cb] hover:text-white'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Revenue Streams</p>
                </button>
                <button
                  onClick={() => setActiveTab('costs')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'costs'
                      ? 'border-b-primary text-white'
                      : 'border-b-transparent text-[#90b8cb] hover:text-white'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Costs & Losses</p>
                </button>
                <button
                  onClick={() => setActiveTab('compliance')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'compliance'
                      ? 'border-b-primary text-white'
                      : 'border-b-transparent text-[#90b8cb] hover:text-white'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Compliance Reports</p>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#1A2C3A] border border-[#315768]">
                <p className="text-[#90b8cb] text-sm font-medium leading-normal">Gross Merchandise Value</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {formatCurrency(stats.grossMerchandiseValue)}
                </p>
                <p className="text-[#0bda57] text-sm font-medium leading-normal">+5.2%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#1A2C3A] border border-[#315768]">
                <p className="text-[#90b8cb] text-sm font-medium leading-normal">Net Revenue</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {formatCurrency(stats.netRevenue)}
                </p>
                <p className="text-[#0bda57] text-sm font-medium leading-normal">+4.8%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#1A2C3A] border border-[#315768]">
                <p className="text-[#90b8cb] text-sm font-medium leading-normal">Commission Revenue</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {formatCurrency(stats.commissionRevenue)}
                </p>
                <p className="text-[#0bda57] text-sm font-medium leading-normal">+6.1%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#1A2C3A] border border-[#315768]">
                <p className="text-[#90b8cb] text-sm font-medium leading-normal">Payment Processing Costs</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {formatCurrency(stats.paymentProcessingCosts)}
                </p>
                <p className="text-[#fa5f38] text-sm font-medium leading-normal">-1.5%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#1A2C3A] border border-[#315768]">
                <p className="text-[#90b8cb] text-sm font-medium leading-normal">Chargeback Losses</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {formatCurrency(stats.chargebackLosses)}
                </p>
                <p className="text-[#fa5f38] text-sm font-medium leading-normal">+0.5%</p>
              </div>
            </div>

            {/* Main Chart and Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Trends Chart */}
              <div className="lg:col-span-2 bg-[#1A2C3A] border border-[#315768] rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Revenue Trends</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full bg-primary"></div>
                      <span className="text-[#90b8cb]">GMV</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full bg-[#0bda57]"></div>
                      <span className="text-[#90b8cb]">Net Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full bg-purple-500"></div>
                      <span className="text-[#90b8cb]">Commissions</span>
                    </div>
                  </div>
                </div>
                <div
                  className="w-full h-80 bg-center bg-no-repeat bg-contain"
                  data-alt="A line chart showing revenue trends over the past month with three lines representing GMV, Net Revenue, and Commissions, all showing an upward trend."
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXGl-HBSLMJzBRixaTET6O6n4GBw7IEx4HIEB6SzPKLOTiDndUBklcpBZCDXez4NdVzXwAJoiBIDvVbIi4z51cNGmQaZaxHYKcyHEKarrt4rsVdIW4ZErrl3gFBa4Lh7X_FoEl0UJiQQXc9iJe_rCr5V0wSXDXQQzb7TF48S9tUojPQOp7QHz6RGjhMu9uPHlqUV2UPXJUFPac00xjFuagaAzDNpBfgg3q_DoibpFOq8subyNbPh7gNoxn8SeSftWHP45QGoQdHvF3')",
                  }}
                />
              </div>
              {/* Revenue Breakdown */}
              <div className="bg-[#1A2C3A] border border-[#315768] rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">Revenue by Publisher</h3>
                <div
                  className="w-full h-56 bg-center bg-no-repeat bg-contain mb-4"
                  data-alt="A colorful donut chart showing revenue breakdown by publisher, with Riot Games, Steam, and Ubisoft as the top three."
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDi9gJdshNbLyWnNekZogOgaxCgY8h2r46wQmTcAxu_0OJgk7wp3ZEaL3sVzR3IrBM3dhrTC5Yzx5x0b9TvOZT3h9RQOozeCgA0xHleQFdsYV8CZ0wmu3MS-0MSSEJbkLo73XcqrwTA4rJ6-GbBN6f32s9StJIbbdK1MQwa8a0aJjVktx5b6blh3cnPT4W9KnVTU7JnnEryPgQdS_ChNzeorYeogMh7zXIp552oNEGfPBgc5-hoBYWzr0ePShrWymfYIu6Sv57aty6T')",
                  }}
                />
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full bg-primary"></div>
                      <span className="text-[#90b8cb]">Riot Games</span>
                    </div>
                    <span className="text-white font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full bg-[#0bda57]"></div>
                      <span className="text-[#90b8cb]">Steam</span>
                    </div>
                    <span className="text-white font-medium">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full bg-purple-500"></div>
                      <span className="text-[#90b8cb]">Ubisoft</span>
                    </div>
                    <span className="text-white font-medium">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full bg-yellow-500"></div>
                      <span className="text-[#90b8cb]">Others</span>
                    </div>
                    <span className="text-white font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Transactions Table */}
            <div className="mt-8 bg-[#1A2C3A] border border-[#315768] rounded-xl p-6">
              <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <h3 className="text-white font-bold text-lg">Detailed Transactions</h3>
                <div className="flex items-center gap-4">
                  <input
                    className="bg-[#223d49] border border-[#315768] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                    placeholder="Search transactions..."
                    type="text"
                  />
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-[#223d49] border border-[#315768] text-white text-sm font-bold rounded-lg hover:bg-opacity-80">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      filter_list
                    </span>
                    Filter
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-[#90b8cb]">
                  <thead className="text-xs text-white uppercase bg-[#223d49]">
                    <tr>
                      <th className="px-6 py-3 rounded-l-lg" scope="col">Transaction ID</th>
                      <th className="px-6 py-3" scope="col">Date</th>
                      <th className="px-6 py-3" scope="col">Product</th>
                      <th className="px-6 py-3" scope="col">Amount</th>
                      <th className="px-6 py-3" scope="col">Status</th>
                      <th className="px-6 py-3 rounded-r-lg" scope="col">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-white/50">
                          Loading transactions...
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-white/50">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-[#315768]">
                          <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{tx.transaction_id}</td>
                          <td className="px-6 py-4">{format(new Date(tx.date), 'yyyy-MM-dd')}</td>
                          <td className="px-6 py-4">{tx.product}</td>
                          <td className="px-6 py-4 text-white">{formatCurrency(tx.amount)}</td>
                          <td className="px-6 py-4">{getStatusBadge(tx.status)}</td>
                          <td className="px-6 py-4">{tx.payment_method}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

