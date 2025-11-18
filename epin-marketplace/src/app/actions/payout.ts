/**
 * Payout Actions for Sellers
 * Handles withdrawal requests and Stripe payout processing
 */

'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Request a payout (withdrawal) from wallet to external account
 */
export async function requestPayout(
  amount: number,
  currency: string = 'USD',
  method: 'bank' | 'crypto' = 'bank',
  accountDetails?: {
    accountNumber?: string;
    routingNumber?: string;
    accountHolderName?: string;
    cryptoAddress?: string;
    cryptoNetwork?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  if (amount <= 0) {
    return { success: false, error: 'Invalid amount' };
  }

  // Minimum payout amount
  if (amount < 10) {
    return { success: false, error: 'Minimum payout amount is $10' };
  }

  try {
    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('id, balance, currency')
      .eq('user_id', user.id)
      .eq('currency', currency)
      .single();

    if (walletError || !wallet) {
      return { success: false, error: 'Wallet not found' };
    }

    const availableBalance = parseFloat(wallet.balance.toString());

    if (availableBalance < amount) {
      return {
        success: false,
        error: 'Insufficient balance',
        available: availableBalance,
        required: amount,
      };
    }

    // Calculate fees
    const processingFee = method === 'bank' ? 2.50 : 5.00; // Bank: $2.50, Crypto: $5.00
    const totalDeduction = amount + processingFee;

    if (availableBalance < totalDeduction) {
      return {
        success: false,
        error: 'Insufficient balance (including fees)',
        available: availableBalance,
        required: totalDeduction,
      };
    }

    // Create withdrawal transaction
    const { data: transaction, error: transError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: user.id,
        transaction_type: 'withdrawal',
        amount: -totalDeduction, // Negative for withdrawal
        currency,
        status: 'pending',
        description: `Withdrawal request: ${amount} ${currency} via ${method}`,
        metadata: {
          method,
          account_details: accountDetails,
          processing_fee: processingFee,
          net_amount: amount,
        },
      })
      .select('id')
      .single();

    if (transError) throw transError;

    // Freeze the amount in wallet (move to frozen_balance)
    const { error: freezeError } = await supabase
      .from('wallets')
      .update({
        balance: (availableBalance - totalDeduction).toString(),
        frozen_balance: (parseFloat(wallet.frozen_balance?.toString() || '0') + totalDeduction).toString(),
      })
      .eq('id', wallet.id);

    if (freezeError) throw freezeError;

    // Process payout via Stripe (if connected account exists)
    // For now, we'll mark as pending and process manually or via webhook
    // In production, you would:
    // 1. Create a Stripe Transfer or Payout
    // 2. Link it to the transaction
    // 3. Update status when Stripe confirms

    // If user has Stripe Connect account, create transfer
    const { data: profile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single();

    const stripeAccountId = profile?.metadata?.stripe_account_id;

    if (stripeAccountId && process.env.NODE_ENV === 'production') {
      try {
        // Create Stripe Transfer to connected account
        const transfer = await stripe.transfers.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          destination: stripeAccountId,
          metadata: {
            user_id: user.id,
            transaction_id: transaction.id,
            type: 'payout',
          },
        });

        // Update transaction with Stripe transfer ID
        await supabase
          .from('wallet_transactions')
          .update({
            metadata: {
              ...transaction.metadata,
              stripe_transfer_id: transfer.id,
            },
          })
          .eq('id', transaction.id);

        // Update status to processing
        await supabase
          .from('wallet_transactions')
          .update({ status: 'processing' })
          .eq('id', transaction.id);
      } catch (stripeError: any) {
        console.error('Stripe transfer error:', stripeError);
        // Keep transaction as pending, will be processed manually
      }
    }

    revalidatePath('/wallet');
    revalidatePath('/wallet/withdraw');
    revalidatePath('/seller/wallet');

    return {
      success: true,
      transactionId: transaction.id,
      amount,
      processingFee,
      totalDeduction,
      netAmount: amount,
      status: 'pending',
    };
  } catch (error: any) {
    console.error('Error requesting payout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel a pending payout
 */
export async function cancelPayout(transactionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Get transaction
    const { data: transaction, error: transError } = await supabase
      .from('wallet_transactions')
      .select('*, wallets!inner(id, balance, frozen_balance, user_id)')
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (transError || !transaction) {
      return { success: false, error: 'Transaction not found or cannot be cancelled' };
    }

    const wallet = transaction.wallets as any;
    const frozenAmount = Math.abs(parseFloat(transaction.amount.toString()));

    // Unfreeze the amount (move back from frozen_balance to balance)
    const { error: unfreezeError } = await supabase
      .from('wallets')
      .update({
        balance: (parseFloat(wallet.balance.toString()) + frozenAmount).toString(),
        frozen_balance: (parseFloat(wallet.frozen_balance?.toString() || '0') - frozenAmount).toString(),
      })
      .eq('id', wallet.id);

    if (unfreezeError) throw unfreezeError;

    // Update transaction status
    const { error: updateError } = await supabase
      .from('wallet_transactions')
      .update({ status: 'cancelled' })
      .eq('id', transactionId);

    if (updateError) throw updateError;

    revalidatePath('/wallet');
    revalidatePath('/wallet/withdraw');
    revalidatePath('/seller/wallet');

    return { success: true };
  } catch (error: any) {
    console.error('Error cancelling payout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get payout history for user
 */
export async function getPayoutHistory(limit: number = 20) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated', payouts: [] };
  }

  try {
    const { data: transactions, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('transaction_type', 'withdrawal')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const payouts = transactions?.map((tx) => ({
      id: tx.id,
      amount: Math.abs(parseFloat(tx.amount.toString())),
      currency: tx.currency,
      status: tx.status,
      method: tx.metadata?.method || 'bank',
      processingFee: tx.metadata?.processing_fee || 0,
      netAmount: tx.metadata?.net_amount || Math.abs(parseFloat(tx.amount.toString())),
      requestedAt: tx.created_at,
      completedAt: tx.status === 'completed' ? tx.updated_at : undefined,
      stripeTransferId: tx.metadata?.stripe_transfer_id,
    })) || [];

    return { success: true, payouts };
  } catch (error: any) {
    console.error('Error fetching payout history:', error);
    return { success: false, error: error.message, payouts: [] };
  }
}

