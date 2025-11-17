'use server';

import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getTransactions(
  filters?: {
    search?: string;
    dateRange?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated', transactions: [], total: 0 };
  }

  try {
    let query = supabase
      .from('wallet_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.type && filters.type !== 'all') {
      query = query.eq('transaction_type', filters.type);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      query = query.gte('created_at', startDate.toISOString());
    }

    if (filters?.search) {
      query = query.or(`description.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data: transactions, error, count } = await query;

    if (error) throw error;

    return {
      success: true,
      transactions: transactions || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return { success: false, error: error.message, transactions: [], total: 0 };
  }
}

export async function exportTransactionsToCSV(filters?: {
  search?: string;
  dateRange?: string;
  type?: string;
  status?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    let query = supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply same filters as getTransactions
    if (filters?.type && filters.type !== 'all') {
      query = query.eq('transaction_type', filters.type);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      query = query.gte('created_at', startDate.toISOString());
    }

    if (filters?.search) {
      query = query.or(`description.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
    }

    const { data: transactions, error } = await query;

    if (error) throw error;

    // Convert to CSV
    const headers = ['Date', 'Type', 'Amount', 'Currency', 'Status', 'Description'];
    const rows = (transactions || []).map((tx) => [
      new Date(tx.created_at).toLocaleString(),
      tx.transaction_type,
      tx.amount.toString(),
      tx.currency,
      tx.status,
      tx.description || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return {
      success: true,
      csvContent,
      filename: `transactions_${new Date().toISOString().split('T')[0]}.csv`,
    };
  } catch (error: any) {
    console.error('Error exporting transactions:', error);
    return { success: false, error: error.message };
  }
}

