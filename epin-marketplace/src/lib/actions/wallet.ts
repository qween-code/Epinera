import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'sale';

export async function getWalletBalance() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { balance: 0, currency: 'TRY' };

  const { data: wallet, error } = await supabase
    .from('wallets')
    .select('balance, currency')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching wallet:', error);
    return { balance: 0, currency: 'TRY' };
  }

  // If wallet doesn't exist, return 0 (it will be created on first deposit)
  return {
    balance: wallet?.balance ?? 0,
    currency: wallet?.currency ?? 'TRY'
  };
}

export async function depositFunds(amount: number, paymentDetails: any) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  if (amount <= 0) throw new Error("Invalid amount");

  // 1. Simulate Payment Gateway Validation (Luhn check etc would go here in frontend, backend verifies token)
  // In this "Live Simulation", we assume payment is successful if it reached here.

  // 2. Database Transaction (Upsert Wallet + Insert Transaction Record)
  // Note: In a real app, we would use RPC for atomicity. For this demo, we do checks.

  // Get or Create Wallet
  let { data: wallet } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('user_id', user.id)
    .single();

  if (!wallet) {
    const { data: newWallet, error: createError } = await supabase
      .from('wallets')
      .insert({ user_id: user.id, currency: 'TRY', balance: 0 })
      .select()
      .single();

    if (createError) throw new Error("Failed to create wallet");
    wallet = newWallet;
  }

  // Update Balance
  const newBalance = (Number(wallet.balance) + Number(amount));

  const { error: updateError } = await supabase
    .from('wallets')
    .update({ balance: newBalance, last_updated: new Date().toISOString() })
    .eq('id', wallet.id);

  if (updateError) throw new Error("Failed to update balance");

  // Log Transaction
  const { error: txError } = await supabase
    .from('wallet_transactions')
    .insert({
      wallet_id: wallet.id,
      user_id: user.id,
      transaction_type: 'deposit',
      amount: amount,
      currency: 'TRY',
      status: 'completed',
      metadata: paymentDetails,
      reference_type: 'payment_gateway'
    });

  if (txError) console.error("Failed to log transaction", txError);

  revalidatePath('/dashboard/wallet');
  return { success: true, newBalance };
}
