/**
 * Stripe Webhook Handler
 * Handles payment events from Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = await createClient();

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const transactionId = paymentIntent.metadata.transaction_id;
      const userId = paymentIntent.metadata.user_id;

      if (transactionId && userId) {
        // Get transaction
        const { data: transaction } = await supabase
          .from('wallet_transactions')
          .select('*, wallets!inner(id, balance, user_id)')
          .eq('id', transactionId)
          .eq('user_id', userId)
          .single();

        if (transaction && transaction.status === 'pending') {
          // Update transaction status
          await supabase
            .from('wallet_transactions')
            .update({ 
              status: 'completed',
              metadata: {
                ...transaction.metadata,
                stripe_payment_intent_id: paymentIntent.id,
                completed_at: new Date().toISOString(),
              },
            })
            .eq('id', transactionId);

          // Update wallet balance (add deposit amount)
          const wallet = transaction.wallets as any;
          const depositAmount = parseFloat(transaction.amount.toString());
          
          await supabase
            .from('wallets')
            .update({
              balance: (parseFloat(wallet.balance.toString()) + depositAmount).toString(),
            })
            .eq('id', wallet.id);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      const failedTransactionId = failedPayment.metadata.transaction_id;

      if (failedTransactionId) {
        await supabase
          .from('wallet_transactions')
          .update({ 
            status: 'failed',
            metadata: {
              stripe_payment_intent_id: failedPayment.id,
              failure_reason: failedPayment.last_payment_error?.message || 'Payment failed',
            },
          })
          .eq('id', failedTransactionId);
      }
      break;

    case 'transfer.created':
    case 'transfer.paid':
      const transfer = event.data.object as Stripe.Transfer;
      const payoutTransactionId = transfer.metadata?.transaction_id;
      const payoutUserId = transfer.metadata?.user_id;

      if (payoutTransactionId && payoutUserId) {
        // Update payout transaction status
        const status = event.type === 'transfer.paid' ? 'completed' : 'processing';
        
        await supabase
          .from('wallet_transactions')
          .update({ 
            status,
            metadata: {
              stripe_transfer_id: transfer.id,
              stripe_transfer_status: transfer.status,
            },
          })
          .eq('id', payoutTransactionId)
          .eq('user_id', payoutUserId);

        // If completed, move from frozen_balance (already deducted from balance)
        if (status === 'completed') {
          const { data: transaction } = await supabase
            .from('wallet_transactions')
            .select('*, wallets!inner(id, frozen_balance)')
            .eq('id', payoutTransactionId)
            .single();

          if (transaction) {
            const wallet = transaction.wallets as any;
            const frozenAmount = Math.abs(parseFloat(transaction.amount.toString()));
            
            // Remove from frozen_balance (already deducted from balance when requested)
            await supabase
              .from('wallets')
              .update({
                frozen_balance: Math.max(0, parseFloat(wallet.frozen_balance?.toString() || '0') - frozenAmount).toString(),
              })
              .eq('id', wallet.id);
          }
        }
      }
      break;

    case 'transfer.failed':
      const failedTransfer = event.data.object as Stripe.Transfer;
      const failedPayoutTransactionId = failedTransfer.metadata?.transaction_id;

      if (failedPayoutTransactionId) {
        // Refund the amount back to balance
        const { data: transaction } = await supabase
          .from('wallet_transactions')
          .select('*, wallets!inner(id, balance, frozen_balance)')
          .eq('id', failedPayoutTransactionId)
          .single();

        if (transaction) {
          const wallet = transaction.wallets as any;
          const refundAmount = Math.abs(parseFloat(transaction.amount.toString()));

          // Refund to balance and remove from frozen
          await supabase
            .from('wallets')
            .update({
              balance: (parseFloat(wallet.balance.toString()) + refundAmount).toString(),
              frozen_balance: Math.max(0, parseFloat(wallet.frozen_balance?.toString() || '0') - refundAmount).toString(),
            })
            .eq('id', wallet.id);

          // Update transaction status
          await supabase
            .from('wallet_transactions')
            .update({ 
              status: 'failed',
              metadata: {
                ...transaction.metadata,
                stripe_transfer_id: failedTransfer.id,
                failure_reason: 'Transfer failed',
              },
            })
            .eq('id', failedPayoutTransactionId);
        }
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

