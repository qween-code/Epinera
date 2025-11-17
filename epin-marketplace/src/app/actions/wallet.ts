'use server';

import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getWalletBalance(currency: string = 'USD') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated', balance: 0 };
  }

  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('balance, escrow_balance, bonus_balance, frozen_balance, currency')
      .eq('user_id', user.id)
      .eq('currency', currency)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      // Create wallet if it doesn't exist
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          currency,
          balance: 0,
          escrow_balance: 0,
          bonus_balance: 0,
          frozen_balance: 0,
        })
        .select('balance, escrow_balance, bonus_balance, frozen_balance, currency')
        .single();

      if (createError) throw createError;
      return {
        success: true,
        balance: parseFloat(newWallet.balance.toString()),
        escrowBalance: parseFloat(newWallet.escrow_balance.toString()),
        bonusBalance: parseFloat(newWallet.bonus_balance.toString()),
        frozenBalance: parseFloat(newWallet.frozen_balance.toString()),
        currency: newWallet.currency,
      };
    }

    return {
      success: true,
      balance: parseFloat(data.balance.toString()),
      escrowBalance: parseFloat(data.escrow_balance.toString()),
      bonusBalance: parseFloat(data.bonus_balance.toString()),
      frozenBalance: parseFloat(data.frozen_balance.toString()),
      currency: data.currency,
    };
  } catch (error: any) {
    console.error('Error fetching wallet balance:', error);
    return { success: false, error: error.message, balance: 0 };
  }
}

export async function applyDiscountCode(code: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // TODO: Implement discount code validation from campaigns table
    // For now, return mock response
    const { data, error } = await supabase
      .from('campaigns')
      .select('id, discount_percentage, discount_amount, currency, valid_from, valid_until')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid discount code' };
    }

    const now = new Date();
    const validFrom = new Date(data.valid_from);
    const validUntil = data.valid_until ? new Date(data.valid_until) : null;

    if (now < validFrom || (validUntil && now > validUntil)) {
      return { success: false, error: 'Discount code has expired' };
    }

    return {
      success: true,
      discount: {
        id: data.id,
        percentage: data.discount_percentage,
        amount: data.discount_amount,
        currency: data.currency,
      },
    };
  } catch (error: any) {
    console.error('Error applying discount code:', error);
    return { success: false, error: error.message };
  }
}
