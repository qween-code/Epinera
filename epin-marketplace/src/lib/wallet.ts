import { createClient } from '@/lib/supabase'

export async function getWallet() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
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

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      amount,
      type: 'deposit',
      status: 'completed', // In a real app, this would be 'pending' until confirmed
      details: {
        method: 'Credit Card',
      },
    })

  if (error) {
    console.error('Error creating deposit:', error)
    return null
  }

  return data
}
