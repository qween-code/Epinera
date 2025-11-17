'use client';

interface AnalyticsStatsProps {
  totalRevenue: number;
  revenueGrowth: number;
  unitsSold: number;
  unitsGrowth: number;
  conversionRate: number;
  conversionChange: number;
  customerSatisfaction: number;
  satisfactionChange: number;
}

export default function AnalyticsStats({
  totalRevenue,
  revenueGrowth,
  unitsSold,
  unitsGrowth,
  conversionRate,
  conversionChange,
  customerSatisfaction,
  satisfactionChange,
}: AnalyticsStatsProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const stats = [
    {
      label: 'Total Revenue',
      value: formatAmount(totalRevenue),
      change: revenueGrowth,
      positive: revenueGrowth >= 0,
    },
    {
      label: 'Units Sold',
      value: unitsSold.toLocaleString(),
      change: unitsGrowth,
      positive: unitsGrowth >= 0,
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: conversionChange,
      positive: conversionChange >= 0,
    },
    {
      label: 'Customer Satisfaction',
      value: `${customerSatisfaction}%`,
      change: satisfactionChange,
      positive: satisfactionChange >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-1 flex-col gap-2 rounded-lg border border-white/10 bg-white dark:bg-[#2C2C3E] p-4"
        >
          <p className="text-base font-medium leading-normal text-gray-600 dark:text-[#F0F0F0]">{stat.label}</p>
          <p className="tracking-light text-2xl font-bold leading-tight text-gray-900 dark:text-white">{stat.value}</p>
          <p
            className={`text-base font-medium leading-normal ${
              stat.positive ? 'text-[#50E3C2]' : 'text-[#fa5f38]'
            }`}
          >
            {stat.change >= 0 ? '+' : ''}
            {stat.change}%
          </p>
        </div>
      ))}
    </div>
  );
}

