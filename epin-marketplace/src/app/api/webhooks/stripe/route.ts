import { stripe } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = await createClient();
  const orderId = session.metadata?.order_id;

  if (!orderId) {
    console.error('No order_id in session metadata');
    return;
  }

  // Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'processing',
      payment_status: 'paid',
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq('id', orderId);

  if (updateError) {
    console.error('Failed to update order:', updateError);
    return;
  }

  // Get order items to decrement stock
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('variant_id, quantity')
    .eq('order_id', orderId);

  if (orderItems) {
    // Decrement stock for each variant
    for (const item of orderItems) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        variant_id: item.variant_id,
        quantity: item.quantity,
      });

      if (stockError) {
        console.error('Failed to decrement stock:', stockError);
      }
    }
  }

  // Clear user's cart
  const userId = session.metadata?.user_id;
  if (userId) {
    await supabase.from('cart_items').delete().eq('user_id', userId);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Additional handling if needed
  console.log('Payment succeeded:', paymentIntent.id);
}
