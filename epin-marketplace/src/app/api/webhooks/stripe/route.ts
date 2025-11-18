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
        // Update transaction status
        await supabase
          .from('wallet_transactions')
          .update({ status: 'completed' })
          .eq('id', transactionId)
          .eq('user_id', userId);

        // Update wallet balance
        const { data: transaction } = await supabase
          .from('wallet_transactions')
          .select('amount, currency, wallet_id')
          .eq('id', transactionId)
          .single();

        if (transaction) {
          const { data: wallet } = await supabase
            .from('wallets')
            .select('balance')
            .eq('id', transaction.wallet_id)
            .single();

          if (wallet) {
            await supabase
              .from('wallets')
              .update({
                balance: (parseFloat(wallet.balance.toString()) + parseFloat(transaction.amount.toString())).toString(),
              })
              .eq('id', transaction.wallet_id);
          }
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      const failedTransactionId = failedPayment.metadata.transaction_id;

      if (failedTransactionId) {
        await supabase
          .from('wallet_transactions')
          .update({ status: 'failed' })
          .eq('id', failedTransactionId);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

