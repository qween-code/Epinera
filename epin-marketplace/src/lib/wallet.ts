import { createClient } from '@/lib/supabase'

export async function getWallet() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: transactions, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    return null
  }

  const balance = transactions.reduce((acc, tx) => acc + tx.amount, 0)

  return { balance, transactions }
}

export async function createDeposit(amount: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get or create wallet first
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_id', user.id)
    .eq('currency', 'USD')
    .single()

  if (walletError && walletError.code !== 'PGRST116') {
    console.error('Error fetching wallet:', walletError)
    return null
  }

  let walletId = wallet?.id
  if (!walletId) {
    const { data: newWallet, error: createError } = await supabase
      .from('wallets')
      .insert({
        user_id: user.id,
        currency: 'USD',
        balance: 0,
      })
      .select('id')
      .single()

    if (createError) {
      console.error('Error creating wallet:', createError)
      return null
    }
    walletId = newWallet.id
  }

  const { data, error } = await supabase
    .from('wallet_transactions')
    .insert({
      wallet_id: walletId,
      user_id: user.id,
      transaction_type: 'deposit',
      amount,
      currency: 'USD',
      status: 'pending', // In a real app, this would be 'pending' until confirmed
      metadata: {
        method: 'Credit Card',
      },
    })

  if (error) {
    console.error('Error creating deposit:', error)
    return null
  }

  return data
}
