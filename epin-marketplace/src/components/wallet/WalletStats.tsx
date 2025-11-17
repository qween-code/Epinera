'use client';

interface WalletStatsProps {
  mainBalance: number;
  escrowBalance: number;
  bonusBalance: number;
  frozenBalance: number;
  currency?: string;
}

export default function WalletStats({
  mainBalance,
  escrowBalance,
  bonusBalance,
  frozenBalance,
  currency = 'USD',
}: WalletStatsProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const stats = [
    {
      label: 'Ana Bakiye (Main Balance)',
      value: mainBalance,
      color: 'text-white',
      tooltip: null,
    },
    {
      label: 'Escrow Bakiye (Escrow)',
      value: escrowBalance,
      color: 'text-white',
      tooltip: 'Funds held in escrow for ongoing transactions.',
    },
    {
      label: 'Bonus Bakiye (Promotional)',
      value: bonusBalance,
      color: 'text-orange-400',
      tooltip: 'Promotional credits with specific usage terms.',
    },
    {
      label: 'Frozen Bakiye (Frozen)',
      value: frozenBalance,
      color: 'text-red-400',
      tooltip: 'Funds temporarily frozen for security verification.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 rounded-xl p-6 bg-[#223d49]/50 border border-white/10"
        >
          <div className="flex items-center gap-2" title={stat.tooltip || undefined}>
            <p className="text-white text-base font-medium leading-normal">{stat.label}</p>
            {stat.tooltip && (
              <span className="material-symbols-outlined icon-regular text-gray-400" style={{ fontSize: '16px' }}>
                info
              </span>
            )}
          </div>
          <p className={`tracking-light text-3xl font-bold leading-tight ${stat.color}`}>
            {formatBalance(stat.value)}
          </p>
        </div>
      ))}
    </div>
  );
}

