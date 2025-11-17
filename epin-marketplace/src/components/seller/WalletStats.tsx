'use client';

interface WalletStatsProps {
  availableBalance: number;
  pendingPayouts: number;
  monthlyEarnings: number;
  monthlyGrowth?: number;
  nextPayoutDate?: string;
  currency?: string;
}

export default function WalletStats({
  availableBalance,
  pendingPayouts,
  monthlyEarnings,
  monthlyGrowth = 0,
  nextPayoutDate,
  currency = 'USD',
}: WalletStatsProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stats = [
    {
      label: 'Available for Withdrawal',
      value: availableBalance,
      color: 'text-white',
    },
    {
      label: 'Pending Payouts (Escrow)',
      value: pendingPayouts,
      color: 'text-white',
    },
    {
      label: 'Earnings This Month',
      value: monthlyEarnings,
      growth: monthlyGrowth,
      color: 'text-white',
    },
    {
      label: 'Next Scheduled Payout',
      value: nextPayoutDate,
      isDate: true,
      color: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-xl border border-[#315768] p-5">
          <p className="text-sm font-medium leading-normal text-[#90b8cb]">{stat.label}</p>
          {stat.isDate ? (
            <p className={`text-2xl font-bold leading-tight tracking-light ${stat.color}`}>
              {formatDate(stat.value as string)}
            </p>
          ) : (
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold leading-tight tracking-light ${stat.color}`}>
                {formatAmount(stat.value as number)}
              </p>
              {stat.growth !== undefined && stat.growth > 0 && (
                <p className="text-sm font-medium leading-normal text-[#48BB78]">+{stat.growth}%</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

