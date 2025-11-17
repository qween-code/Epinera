'use server';

import { createClient } from '@/lib/supabase';

export async function getWallet() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: wallet, error } = await supabase
    .from('wallets')
    .select('balance, currency')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching wallet:', error);
    // Maybe create a wallet if it doesn't exist?
    if (error.code === 'PGRST116') { // "Not found"
        const {data: newWallet, error: creationError} = await supabase.from('wallets').insert({user_id: user.id, balance: 0, currency: 'USD'}).select().single();
        if(creationError) {
            console.error('Error creating wallet:', creationError);
            return null;
        }
        return newWallet;
    }
    return null;
  }

  return wallet;
}

export async function getTransactions() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return transactions;
  }
