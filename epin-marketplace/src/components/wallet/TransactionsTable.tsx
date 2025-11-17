'use client';

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  created_at: string;
  reference_id?: string;
  reference_type?: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onViewDetails?: (transactionId: string) => void;
}

export default function TransactionsTable({ transactions, onViewDetails }: TransactionsTableProps) {
  const getTransactionIcon = (type: string) => {
    const iconMap: Record<string, { icon: string; color: string }> = {
      purchase: { icon: 'shopping_cart', color: 'text-red-500' },
      deposit: { icon: 'account_balance_wallet', color: 'text-green-500' },
      withdrawal: { icon: 'logout', color: 'text-orange-400' },
      refund: { icon: 'undo', color: 'text-blue-400' },
      bonus: { icon: 'military_tech', color: 'text-blue-400' },
      fee: { icon: 'receipt', color: 'text-gray-400' },
    };

    return iconMap[type.toLowerCase()] || { icon: 'receipt_long', color: 'text-gray-400' };
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      completed: { label: 'Completed', className: 'bg-green-900 text-green-300' },
      pending: { label: 'Pending', className: 'bg-yellow-900 text-yellow-300' },
      failed: { label: 'Failed', className: 'bg-red-900 text-red-300' },
      cancelled: { label: 'Cancelled', className: 'bg-gray-900 text-gray-300' },
    };

    const statusInfo = statusMap[status.toLowerCase()] || { label: status, className: 'bg-gray-900 text-gray-300' };

    return (
      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    const sign = amount >= 0 ? '+' : '';
    const color = amount >= 0 ? 'text-green-400' : 'text-red-400';
    return (
      <span className={`text-right ${color}`}>
        {sign}{Math.abs(amount).toFixed(2)} {currency}
      </span>
    );
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white/70 dark:text-[#a0aec0]">
          <thead className="border-b border-white/10 dark:border-[#223d49] text-xs uppercase text-white/50 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3" scope="col">Date</th>
              <th className="px-6 py-3" scope="col">Type</th>
              <th className="px-6 py-3" scope="col">Details</th>
              <th className="px-6 py-3 text-right" scope="col">Amount</th>
              <th className="px-6 py-3" scope="col">Status</th>
              <th className="px-6 py-3 text-center" scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const { icon, color } = getTransactionIcon(transaction.transaction_type);
              return (
                <tr key={transaction.id} className="border-b border-white/10 dark:border-[#223d49]">
                  <td className="px-6 py-4">{formatDate(transaction.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                      <span className="capitalize">{transaction.transaction_type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {transaction.description || `${transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)} transaction`}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(transaction.status)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onViewDetails?.(transaction.id)}
                      className="text-primary hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-white/50">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

