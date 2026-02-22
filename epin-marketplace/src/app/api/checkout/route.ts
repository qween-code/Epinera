import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
    }

    const body = await request.json();
    const { deliveryEmail, deliveryPhone, deliveryNotes } = body;

    // Get cart items for this user
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(
        `
        id,
        quantity,
        product_variants (
          id,
          name,
          price,
          currency,
          stock_quantity,
          products (
            id,
            title,
            seller_id
          )
        )
      `
      )
      .eq('user_id', user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Sepetiniz boş' }, { status: 400 });
    }

    // Validate stock availability and calculate total
    let total = 0;
    const lineItems: any[] = [];

    for (const item of cartItems) {
      const variant = item.product_variants as any;
      if (!variant) continue;

      if (variant.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `${variant.products.title} için yeterli stok yok` },
          { status: 400 }
        );
      }

      const price = parseFloat(variant.price);
      total += price * item.quantity;

      lineItems.push({
        price_data: {
          currency: variant.currency.toLowerCase(),
          product_data: {
            name: `${variant.products.title} - ${variant.name}`,
          },
          unit_amount: Math.round(price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      });
    }

    // Create order in database
    const firstVariant = cartItems[0].product_variants as any;
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: total,
        currency: firstVariant.currency,
        status: 'pending',
        payment_status: 'pending',
        delivery_email: deliveryEmail,
        delivery_phone: deliveryPhone,
        delivery_notes: deliveryNotes,
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 });
    }

    // Create order items
    const orderItems = cartItems.map((item) => {
      const v = item.product_variants as any;
      return {
        order_id: order.id,
        variant_id: v.id,
        quantity: item.quantity,
        price_at_time: parseFloat(v.price),
        currency: v.currency,
        seller_id: v.products.seller_id,
      };
    });

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      // Rollback: delete order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: 'Sipariş detayları eklenemedi' }, { status: 500 });
    }

    // Create Stripe Checkout Session
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      locale: 'tr',
      line_items: lineItems,
      customer_email: deliveryEmail || user.email || undefined,
      metadata: {
        order_id: order.id,
        user_id: user.id,
      },
      success_url: `${origin}/orders/${order.id}?success=true`,
      cancel_url: `${origin}/checkout?cancelled=true`,
    });

    // Update order with Stripe session ID
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({ sessionId: session.id, sessionUrl: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Ödeme işlemi başlatılamadı' },
      { status: 500 }
    );
  }
}
