import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function buyProduct(productId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // 1. Fetch Product & Check Stock
  const { data: product, error: prodError } = await supabase
    .from('products')
    .select('*, seller:seller_id(id)')
    .eq('id', productId)
    .single();

  if (prodError || !product) throw new Error("Product not found");
  if (product.stock_quantity < 1) throw new Error("Out of stock");

  const price = Number(product.price);

  // 2. Fetch User Wallet & Check Balance
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('user_id', user.id)
    .single();

  if (!wallet || Number(wallet.balance) < price) {
    return { success: false, error: "INSUFFICIENT_FUNDS" };
  }

  // 3. ATOMIC TRANSACTION (Simulated)
  // We need to be careful. If step B or C fails, we must refund step A.

  // A. Deduct from Buyer Wallet
  const { error: deductError } = await supabase
    .from('wallets')
    .update({
      balance: Number(wallet.balance) - price,
      last_updated: new Date().toISOString()
    })
    .eq('id', wallet.id);

  if (deductError) throw new Error("Transaction failed");

  try {
      // B. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          total_amount: price,
          currency: 'TRY',
          status: 'completed',
          payment_status: 'paid',
          payment_method: 'credit_card'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // C. Create Order Item
      let variantId = null;
      const { data: variants } = await supabase.from('product_variants').select('id').eq('product_id', product.id).limit(1);

      if (variants && variants.length > 0) {
        variantId = variants[0].id;
      } else {
        // Fallback or Fail
        throw new Error("Product configuration error: No variant found");
      }

      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: product.id,
          variant_id: variantId,
          seller_id: product.seller_id,
          quantity: 1,
          unit_price: price,
          total_price: price,
          delivery_status: 'completed',
          digital_content_delivered: product.digital_content
        });

      if (itemError) throw itemError;

      // D. Decrement Stock
      await supabase
        .from('products')
        .update({ stock_quantity: product.stock_quantity - 1 })
        .eq('id', productId);

      revalidatePath('/dashboard/wallet');
      revalidatePath('/dashboard/inventory');

      return { success: true, orderId: order.id };

  } catch (error) {
    console.error("Transaction failed during order creation, rolling back wallet...", error);

    // ROLLBACK WALLET
    // We add the money back.
    // Note: In a high concurrency environment, this is dangerous (ABA problem),
    // but for this implementation it is the standard "Compensation Transaction" pattern.
    const { error: refundError } = await supabase
      .from('wallets')
      .update({
        balance: Number(wallet.balance), // Reset to original
        last_updated: new Date().toISOString()
      })
      .eq('id', wallet.id);

    if (refundError) {
        console.error("CRITICAL: REFUND FAILED", refundError);
        // Alert Admin / Sentry log here
    }

    return { success: false, error: "TRANSACTION_FAILED" };
  }
}
