'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ProfileSidebar from '@/components/wallet/ProfileSidebar';
import ProfileHeader from '@/components/wallet/ProfileHeader';
import WalletStats from '@/components/wallet/WalletStats';
import WalletActions from '@/components/wallet/WalletActions';
import TransactionHistoryTabs from '@/components/wallet/TransactionHistoryTabs';
import TransactionsTable from '@/components/wallet/TransactionsTable';
import { getWalletBalance } from '@/app/actions/wallet';
import { getTransactions } from '@/app/actions/transactions';
import Link from 'next/link';

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (currentUser) {
          setUser(currentUser);

          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email, avatar_url, created_at')
            .eq('id', currentUser.id)
            .single();

          setProfile(profileData);

          // Fetch wallet balance
          const walletResult = await getWalletBalance('USD');
          if (walletResult.success) {
            setWallet(walletResult);
          }

          // Fetch transactions
          const transactionsResult = await getTransactions({ limit: 10 });
          if (transactionsResult.success) {
            setTransactions(transactionsResult.transactions);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = async (tab: string) => {
    setActiveTab(tab);
    try {
      const type = tab === 'all' ? undefined : tab === 'purchases' ? 'purchase' : tab.slice(0, -1);
      const result = await getTransactions({ type, limit: 10 });
      if (result.success) {
        setTransactions(result.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
        <div className="flex-1 p-8">
          <div className="w-full max-w-5xl mx-auto text-center text-white/50">Loading...</div>
        </div>
      </div>
    );
  }

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = profile?.email || user?.email;
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : undefined;

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      <ProfileSidebar
        userName={userName}
        userEmail={userEmail}
        isVerified={true}
        avatarUrl={profile?.avatar_url}
      />
      <main className="flex-1 p-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Profile Header */}
          <ProfileHeader
            userName={userName}
            userEmail={userEmail}
            joinDate={joinDate}
            avatarUrl={profile?.avatar_url}
            onEdit={() => {
              // TODO: Implement edit profile
              console.log('Edit profile');
            }}
          />

          {/* Wallet Section */}
          <section>
            {/* Stats & Actions */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="flex-grow">
                {wallet && (
                  <WalletStats
                    mainBalance={wallet.balance || 0}
                    escrowBalance={wallet.escrowBalance || 0}
                    bonusBalance={wallet.bonusBalance || 0}
                    frozenBalance={wallet.frozenBalance || 0}
                    currency={wallet.currency || 'USD'}
                  />
                )}
              </div>
              <div className="flex-shrink-0 lg:w-52">
                <WalletActions />
              </div>
            </div>
          </section>

          {/* Transaction History Section */}
          <section>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Transaction History
            </h2>
            {/* Tabs */}
            <TransactionHistoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
            {/* Transaction Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="font-medium text-gray-400">
                  <tr>
                    <th className="px-6 py-4" scope="col">
                      Date
                    </th>
                    <th className="px-6 py-4" scope="col">
                      Type
                    </th>
                    <th className="px-6 py-4" scope="col">
                      Amount
                    </th>
                    <th className="px-6 py-4" scope="col">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right" scope="col">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {transactions.map((transaction) => {
                    const getStatusBadge = (status: string) => {
                      const statusMap: Record<string, { label: string; className: string }> = {
                        completed: { label: 'Completed', className: 'bg-green-500/10 text-green-400' },
                        pending: { label: 'Pending', className: 'bg-orange-500/10 text-orange-400' },
                        failed: { label: 'Failed', className: 'bg-red-500/10 text-red-400' },
                      };
                      const statusInfo = statusMap[status.toLowerCase()] || {
                        label: status,
                        className: 'bg-gray-500/10 text-gray-400',
                      };
                      return (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      );
                    };

                    const formatDate = (dateString: string) => {
                      return new Date(dateString).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      });
                    };

                    const formatAmount = (amount: number, currency: string) => {
                      const sign = amount >= 0 ? '+' : '';
                      const color = amount >= 0 ? 'text-green-400' : '';
                      return (
                        <span className={`whitespace-nowrap px-6 py-4 font-medium ${color}`}>
                          {sign}
                          {Math.abs(amount).toFixed(2)} {currency}
                        </span>
                      );
                    };

                    return (
                      <tr key={transaction.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="whitespace-nowrap px-6 py-4">{formatDate(transaction.created_at)}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {transaction.transaction_type.charAt(0).toUpperCase() +
                            transaction.transaction_type.slice(1)}
                          {transaction.reference_type === 'order' && ' - Game Key'}
                        </td>
                        {formatAmount(transaction.amount, transaction.currency)}
                        <td className="whitespace-nowrap px-6 py-4">{getStatusBadge(transaction.status)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <Link href={`/wallet/transactions/${transaction.id}`} className="text-primary hover:underline">
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
