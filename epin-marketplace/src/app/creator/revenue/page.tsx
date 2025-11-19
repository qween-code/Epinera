'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { subDays } from 'date-fns';

export default function CreatorRevenuePage() {
  const [timeRange, setTimeRange] = useState<'30days' | '90days' | 'year'>('30days');
  const [stats, setStats] = useState({
    availableForPayout: 0,
    lifetimeEarnings: 0,
    earnings30Days: 0,
  });
  const [payouts, setPayouts] = useState<any[]>([]);
  const [payoutMethods, setPayoutMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchEarnings();
  }, [timeRange]);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/creator/revenue');
        return;
      }

      // 1. Fetch Wallet Balance (Available for Payout)
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      // 2. Fetch Lifetime Earnings (from campaign_earnings)
      const { data: allEarnings } = await supabase
        .from('campaign_earnings')
        .select('amount, created_at')
        .eq('creator_id', user.id);

      const lifetimeTotal = allEarnings?.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) || 0;

      // 3. Calculate Period Earnings
      const now = new Date();
      let daysToSubtract = 30;
      if (timeRange === '90days') daysToSubtract = 90;
      if (timeRange === 'year') daysToSubtract = 365;

      const startDate = subDays(now, daysToSubtract);

      const periodEarnings = allEarnings
        ?.filter((e: any) => new Date(e.created_at) >= startDate)
        .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) || 0;

      setStats({
        availableForPayout: parseFloat(wallet?.balance?.toString() || '0'),
        lifetimeEarnings: lifetimeTotal,
        earnings30Days: periodEarnings,
      });

      // 4. Fetch Payout History
      const { data: payoutHistory } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('transaction_type', 'withdrawal')
        .order('created_at', { ascending: false })
        .limit(10);

      if (payoutHistory) {
        setPayouts(payoutHistory.map((p: any) => ({
          date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          amount: parseFloat(p.amount || 0),
          method: p.metadata?.method || 'Bank Transfer',
          status: p.status
        })));
      }

      // 5. Fetch Payout Methods (Mock for now as table might not exist, but structured for replacement)
      // In a real app, we'd query a 'payout_methods' table
      setPayoutMethods([
        { name: 'Bank Account', details: '**** **** **** 5678', isPrimary: true },
        { name: 'PayPal', details: user.email, isPrimary: false },
      ]);

    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 90 Days' },
    { id: 'year', label: 'This Year' },
  ];

  if (loading) {
    return <div className="flex-1 p-8 text-white">Loading revenue data...</div>;
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* PageHeading & Main Action Button */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            Earnings & Payouts
          </h1>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors duration-200">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="truncate">Withdraw Funds</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white/5 border border-white/10">
            <p className="text-gray-300 text-base font-medium leading-normal">Available for Payout</p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">
              ${stats.availableForPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white/5 border border-white/10">
            <p className="text-gray-300 text-base font-medium leading-normal">Lifetime Earnings</p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">
              ${stats.lifetimeEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white/5 border border-white/10">
            <p className="text-gray-300 text-base font-medium leading-normal">
              {timeRange === '30days' ? '30-Day' : timeRange === '90days' ? '90-Day' : 'Yearly'} Earnings
            </p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">
              ${stats.earnings30Days.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Earnings Overview Chart */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Earnings Overview</h2>
            <div className="flex items-center gap-2">
              {timeRangeOptions.map((option) => {
                const isActive = timeRange === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setTimeRange(option.id as any)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? 'bg-primary/20 text-primary'
                        : 'text-gray-300 hover:bg-white/10'
                      }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="h-80 flex items-center justify-center bg-white/5 rounded-lg">
            <p className="text-gray-400 text-sm">Earnings Chart (Coming Soon)</p>
          </div>
        </div>

        {/* Payout Management & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">Payout History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-gray-300">Date</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Amount</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Method</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.length > 0 ? (
                    payouts.map((payout, index) => (
                      <tr key={index} className="border-b border-white/10 last:border-b-0">
                        <td className="p-3 text-sm text-gray-200">{payout.date}</td>
                        <td className="p-3 text-sm text-gray-200 font-medium">
                          ${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-sm text-gray-200">{payout.method}</td>
                        <td className="p-3 text-sm text-green-400">
                          <div className="flex items-center gap-1.5">
                            <div className={`size-2 rounded-full ${payout.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                            {payout.status === 'completed' ? 'Paid' : payout.status}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-3 text-sm text-gray-400 text-center">No payout history found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white text-lg font-bold mb-4">Payout Methods</h3>
              <div className="space-y-4">
                {payoutMethods.map((method, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${method.isPrimary ? 'border-white/20 bg-white/5' : 'border-white/10'
                      }`}
                  >
                    <p className="text-white font-medium">
                      {method.name}
                      {method.isPrimary && <span className="text-primary text-sm ml-2">(Primary)</span>}
                    </p>
                    <p className="text-gray-400 text-sm truncate">{method.details}</p>
                  </div>
                ))}
                <button className="w-full text-center py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200">
                  Add New Method
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white text-lg font-bold mb-4">Tax & Reports</h3>
              <div className="space-y-3">
                <Link href="/creator/revenue/tax-form" className="flex items-center gap-2 text-primary hover:underline">
                  <span className="material-symbols-outlined text-base">download</span>
                  <span className="text-sm font-medium">Download 2023 Tax Form</span>
                </Link>
                <Link href="/creator/revenue/report" className="flex items-center gap-2 text-primary hover:underline">
                  <span className="material-symbols-outlined text-base">description</span>
                  <span className="text-sm font-medium">Generate Earnings Report</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
