'use client';

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  requestedAt: string;
  completedAt?: string;
  transactionId?: string;
}

interface PayoutHistoryProps {
  payouts: Payout[];
  onRequestPayout?: () => void;
}

export default function PayoutHistory({ payouts, onRequestPayout }: PayoutHistoryProps) {
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      completed: { label: 'Completed', className: 'bg-green-500/10 text-green-400' },
      pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-400' },
      processing: { label: 'Processing', className: 'bg-blue-500/10 text-blue-400' },
      failed: { label: 'Failed', className: 'bg-red-500/10 text-red-400' },
    };

    const statusInfo = statusMap[status.toLowerCase()] || {
      label: status,
      className: 'bg-gray-500/10 text-gray-400',
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Payout History</h2>
        <button
          onClick={onRequestPayout}
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
        >
          <span className="truncate">Request Payout</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-[#223d49]/50 rounded-xl border border-white/10">
        <table className="min-w-full text-left text-sm font-light">
          <thead className="font-medium text-white/70 border-b border-white/10">
            <tr>
              <th className="px-6 py-4" scope="col">
                Date
              </th>
              <th className="px-6 py-4" scope="col">
                Amount
              </th>
              <th className="px-6 py-4" scope="col">
                Method
              </th>
              <th className="px-6 py-4" scope="col">
                Status
              </th>
              <th className="px-6 py-4" scope="col">
                Transaction ID
              </th>
            </tr>
          </thead>
          <tbody className="text-white">
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="whitespace-nowrap px-6 py-4">{formatDate(payout.requestedAt)}</td>
                <td className="whitespace-nowrap px-6 py-4 font-medium">
                  {formatAmount(payout.amount, payout.currency)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">{payout.method}</td>
                <td className="whitespace-nowrap px-6 py-4">{getStatusBadge(payout.status)}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {payout.transactionId ? (
                    <span className="text-primary hover:underline cursor-pointer">{payout.transactionId.slice(0, 8)}...</span>
                  ) : (
                    <span className="text-white/50">-</span>
                  )}
                </td>
              </tr>
            ))}
            {payouts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                  No payout history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

