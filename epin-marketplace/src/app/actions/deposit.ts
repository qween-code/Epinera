'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { createPaymentIntent, isTestMode } from '@/lib/payment/stripe';

export async function createDepositIntent(amount: number, currency: string = 'USD', paymentMethod: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  if (amount <= 0) {
    return { success: false, error: 'Invalid amount' };
  }

  try {
    // Calculate processing fee (3%)
    const processingFee = amount * 0.03;
    const totalAmount = amount + processingFee;

    // Create deposit transaction record
    const { data: wallet } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .eq('currency', currency)
      .single();

    if (!wallet) {
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
        .select('id')
        .single();

      if (createError) throw createError;

      // Create pending transaction
      const { data: transaction, error: transError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: newWallet.id,
          user_id: user.id,
          transaction_type: 'deposit',
          amount: amount,
          currency,
          status: 'pending',
          metadata: {
            description: `Deposit of ${amount} ${currency}`,
          },
        })
        .select('id')
        .single();

      if (transError) throw transError;

      return {
        success: true,
        transactionId: transaction.id,
        totalAmount,
        processingFee,
        creditsToReceive: amount,
      };
    }

    // Create pending transaction
    const { data: transaction, error: transError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: user.id,
        transaction_type: 'deposit',
        amount: amount,
        currency,
        status: 'pending',
        metadata: {
          description: `Deposit of ${amount} ${currency}`,
        },
      })
      .select('id')
      .single();

    if (transError) throw transError;

    // Integrate with Stripe payment gateway
    const paymentResult = await createPaymentIntent(totalAmount, currency, {
      user_id: user.id,
      transaction_id: transaction.id,
      environment: isTestMode() ? 'test' : 'production',
    });

    if (!paymentResult.success) {
      // Update transaction status to failed
      await supabase
        .from('wallet_transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);

      return {
        success: false,
        error: paymentResult.error || 'Payment gateway error',
      };
    }

    // Store payment intent ID in transaction metadata
    await supabase
      .from('wallet_transactions')
      .update({
        metadata: {
          payment_intent_id: paymentResult.paymentIntentId,
          payment_method: paymentMethod,
          environment: isTestMode() ? 'test' : 'production',
        },
      })
      .eq('id', transaction.id);

    return {
      success: true,
      transactionId: transaction.id,
      totalAmount,
      processingFee,
      creditsToReceive: amount,
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      isTestMode: isTestMode(),
    };
  } catch (error: any) {
    console.error('Error creating deposit intent:', error);
    return { success: false, error: error.message };
  }
}

export async function confirmDeposit(transactionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Get transaction
    const { data: transaction, error: transError } = await supabase
      .from('wallet_transactions')
      .select('*, wallets!inner(user_id, currency)')
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .single();

    if (transError || !transaction) {
      return { success: false, error: 'Transaction not found' };
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('wallet_transactions')
      .update({ status: 'completed' })
      .eq('id', transactionId);

    if (updateError) throw updateError;

    // Update wallet balance
    const wallet = transaction.wallets as any;
    const { error: walletError } = await supabase
      .from('wallets')
      .update({
        balance: (parseFloat(wallet.balance.toString()) + parseFloat(transaction.amount.toString())).toString(),
      })
      .eq('id', wallet.id);

    if (walletError) throw walletError;

    revalidatePath('/wallet');
    revalidatePath('/wallet/deposit');

    return { success: true };
  } catch (error: any) {
    console.error('Error confirming deposit:', error);
    return { success: false, error: error.message };
  }
}

