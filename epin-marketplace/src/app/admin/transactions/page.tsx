'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_type: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
  };
}

export default function AdminTransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'purchase' | 'refund'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/admin/transactions');
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

        // Build query
        let query = supabase
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
          .limit(100);

        if (filter !== 'all') {
          query = query.eq('transaction_type', filter);
        }

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        if (searchQuery) {
          query = query.or(`id.ilike.%${searchQuery}%,profiles.full_name.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        setTransactions((data || []).map((t: any) => ({
          id: t.id,
          amount: t.amount,
          currency: t.currency,
          status: t.status,
          transaction_type: t.transaction_type,
          created_at: t.created_at,
          user: t.profiles || { id: '', full_name: 'Unknown' },
        })));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [supabase, router, filter, statusFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      completed: { label: 'Completed', className: 'bg-green-500/10 text-green-500' },
      pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-500' },
      failed: { label: 'Failed', className: 'bg-red-500/10 text-red-500' },
      cancelled: { label: 'Cancelled', className: 'bg-gray-500/10 text-gray-500' },
    };
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-500/10 text-gray-500' };
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      purchase: 'Purchase',
      refund: 'Refund',
      payout: 'Payout',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Page Heading */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
                Transaction History
              </h1>
              <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400 mt-1">
                Monitor and manage all platform transactions
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="flex flex-col w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                  <div className="text-gray-400 dark:text-gray-500 flex border-r-0 bg-gray-200/50 dark:bg-white/5 items-center justify-center pl-4 rounded-l-lg">
                    <span className="material-symbols-outlined text-base">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-200/50 dark:bg-white/5 h-full placeholder:text-gray-500 dark:placeholder:text-gray-500 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                    placeholder="Search by transaction ID or user name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="h-10 px-4 rounded-lg bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-black dark:text-white text-sm"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="purchase">Purchase</option>
                <option value="refund">Refund</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-10 px-4 rounded-lg bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-black dark:text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No transactions found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                  <thead className="bg-gray-50 dark:bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-white/5 divide-y divide-gray-200 dark:divide-white/10">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-white/10">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                          {transaction.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.user.full_name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {getTypeLabel(transaction.transaction_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.amount.toFixed(2)} {transaction.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/admin/transactions/${transaction.id}`}
                            className="text-primary hover:underline"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

