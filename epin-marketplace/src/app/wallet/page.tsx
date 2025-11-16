'use client';

import { useEffect } from 'react';
import useWalletStore from '@/store/wallet';
import Link from 'next/link';

export default function WalletPage() {
  const { wallet, transactions, fetchWallet, fetchTransactions } = useWalletStore();

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [fetchWallet, fetchTransactions]);

  if (!wallet) {
    return <div>Loading wallet...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-xl p-8 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-gray-400 text-lg">Total Balance</h2>
          <p className="text-5xl font-bold mt-2">
            {wallet.balance.toFixed(2)} <span className="text-3xl text-gray-400">{wallet.currency}</span>
          </p>
        </div>
        <div>
          <Link href="/wallet/deposit" className="px-6 py-3 bg-sky-600 rounded-md font-semibold hover:bg-sky-700 transition-colors">
            Deposit Funds
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold capitalize">{tx.type}</p>
                <p className="text-sm text-gray-400">{tx.description}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(tx.created_at).toLocaleString()}</p>
              </div>
              <p className={`text-lg font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tx.amount.toFixed(2)} {tx.currency}
              </p>
            </div>
          ))}
           {transactions.length === 0 && (
            <p className="text-gray-500 text-center py-4">No transactions yet.</p>
           )}
        </div>
      </div>
    </div>
  );
}
