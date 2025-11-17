'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import WalletStats from '@/components/seller/WalletStats';
import EarningsChart from '@/components/seller/EarningsChart';
import WalletTabs from '@/components/seller/WalletTabs';
import TransactionTable from '@/components/seller/TransactionTable';
import PayoutHistory from '@/components/seller/PayoutHistory';

export default function SellerWalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push('/login?redirect=/seller/wallet');
          return;
        }

        setUser(currentUser);

        // Fetch seller wallet
        const { data: walletData } = await supabase
          .from('wallets')
          .select('balance, escrow_balance, currency')
          .eq('user_id', currentUser.id)
          .eq('currency', 'USD')
          .single();

        if (walletData) {
          // Calculate monthly earnings (last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const { data: monthlyTransactions } = await supabase
            .from('wallet_transactions')
            .select('amount')
            .eq('user_id', currentUser.id)
            .eq('transaction_type', 'sale')
            .eq('status', 'completed')
            .gte('created_at', thirtyDaysAgo.toISOString());

          const monthlyEarnings = monthlyTransactions?.reduce((sum, tx) => sum + parseFloat(tx.amount.toString()), 0) || 0;

          // Calculate growth (mock for now)
          const monthlyGrowth = 15.2;

          setWallet({
            availableBalance: parseFloat(walletData.balance.toString()),
            pendingPayouts: parseFloat(walletData.escrow_balance.toString()),
            monthlyEarnings,
            monthlyGrowth,
            nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            currency: walletData.currency,
          });
        }

        // Fetch all transactions (sales, withdrawals, fees)
        const { data: transactionData } = await supabase
          .from('wallet_transactions')
          .select(`
            *,
            order_items (
              products (
                title
              )
            )
          `)
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (transactionData) {
          setTransactions(
            transactionData.map((tx: any) => ({
              id: tx.id,
              date: new Date(tx.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              transactionId: `#TXN${tx.id.slice(0, 8).toUpperCase()}`,
              type: tx.transaction_type === 'sale' ? 'Sale' : tx.transaction_type === 'withdrawal' ? 'Withdrawal' : 'Fee',
              product: tx.order_items?.[0]?.products?.title || (tx.transaction_type === 'fee' ? 'Marketplace Fee' : '-'),
              amount: parseFloat(tx.amount.toString()) * (tx.transaction_type === 'sale' ? 1 : -1),
              status: tx.status,
            }))
          );
        }

        // Fetch payout history
        const { data: payoutData } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('transaction_type', 'withdrawal')
          .order('created_at', { ascending: false })
          .limit(20);

        if (payoutData) {
          setPayouts(
            payoutData.map((tx: any) => ({
              id: tx.id,
              amount: parseFloat(tx.amount.toString()),
              currency: tx.currency,
              status: tx.status,
              method: tx.metadata?.method || 'Bank Transfer',
              requestedAt: tx.created_at,
              completedAt: tx.status === 'completed' ? tx.updated_at : undefined,
              transactionId: tx.reference_id,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleRequestPayout = () => {
    router.push('/wallet/withdraw');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
        <div className="flex-1 p-8">
          <div className="text-center text-white/50">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Heading */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <p className="text-3xl font-bold leading-tight tracking-tight text-white">Wallet & Payouts</p>
              <p className="text-[#90b8cb] text-base font-normal leading-normal">
                Manage your earnings, payouts, and transaction history.
              </p>
            </div>
            <button
              onClick={handleRequestPayout}
              className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-[#48BB78] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#48BB78]/90 transition-colors"
            >
              <span className="material-symbols-outlined text-base">account_balance_wallet</span>
              <span className="truncate">Withdraw Funds</span>
            </button>
          </div>

          {/* Wallet Stats */}
          {wallet && (
            <WalletStats
              availableBalance={wallet.availableBalance}
              pendingPayouts={wallet.pendingPayouts}
              monthlyEarnings={wallet.monthlyEarnings}
              monthlyGrowth={wallet.monthlyGrowth}
              nextPayoutDate={wallet.nextPayoutDate}
              currency={wallet.currency}
            />
          )}

          {/* Earnings Chart */}
          {wallet && (
            <EarningsChart earnings={8950} growth={5.8} period="Last 30 Days" />
          )}

          {/* Tabs & Content */}
          <div className="mt-8">
            <WalletTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="py-6">
              {activeTab === 'transactions' && <TransactionTable transactions={transactions} />}
              {activeTab === 'payouts' && <PayoutHistory payouts={payouts} onRequestPayout={handleRequestPayout} />}
              {activeTab === 'methods' && (
                <div className="text-center text-white/50 py-8">Payout Methods - Coming Soon</div>
              )}
              {activeTab === 'statements' && (
                <div className="text-center text-white/50 py-8">Statements - Coming Soon</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

