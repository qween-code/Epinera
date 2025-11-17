'use client';

import { useEffect } from 'react';
import useWalletStore from '@/store/wallet';

export default function TransactionHistoryPage() {
  const { transactions, fetchTransactions } = useWalletStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Transaction History</h1>
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
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
            <p className="text-gray-500 text-center py-8">No transactions to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
