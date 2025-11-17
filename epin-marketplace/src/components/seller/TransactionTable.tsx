'use client';

interface Transaction {
  id: string;
  date: string;
  transactionId: string;
  type: string;
  product: string;
  amount: number;
  status: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const formatAmount = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    const color = type === 'Sale' ? 'text-[#48BB78]' : type === 'Withdrawal' ? '' : 'text-[#E53E3E]';
    const sign = amount >= 0 ? '+' : '-';

    return (
      <span className={color}>
        {sign} {formatted}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      completed: { label: 'Completed', className: 'bg-[#48BB78]/20 text-[#48BB78]' },
      processing: { label: 'Processing', className: 'bg-[#F59E0B]/20 text-[#F59E0B]' },
      refunded: { label: 'Refunded', className: 'bg-[#E53E3E]/20 text-[#E53E3E]' },
    };

    const statusInfo = statusMap[status.toLowerCase()] || {
      label: status,
      className: 'bg-gray-500/20 text-gray-400',
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-[#315768]">
      <table className="min-w-full text-left text-sm text-white">
        <thead className="border-b border-[#315768] bg-[#1a2931]/50 text-xs uppercase text-[#90b8cb]">
          <tr>
            <th className="px-6 py-3" scope="col">
              Date
            </th>
            <th className="px-6 py-3" scope="col">
              Transaction ID
            </th>
            <th className="px-6 py-3" scope="col">
              Type
            </th>
            <th className="px-6 py-3" scope="col">
              Product
            </th>
            <th className="px-6 py-3 text-right" scope="col">
              Amount
            </th>
            <th className="px-6 py-3 text-center" scope="col">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#315768]">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-[#1a2931]/50 transition-colors">
              <td className="whitespace-nowrap px-6 py-4">{transaction.date}</td>
              <td className="whitespace-nowrap px-6 py-4">{transaction.transactionId}</td>
              <td className="whitespace-nowrap px-6 py-4">{transaction.type}</td>
              <td className="whitespace-nowrap px-6 py-4">{transaction.product}</td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                {formatAmount(transaction.amount, transaction.type)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-center">{getStatusBadge(transaction.status)}</td>
            </tr>
          ))}
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
  );
}

