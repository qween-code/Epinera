'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
}

function StatCard({ label, value, change }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#0c161b] border border-[#315768]">
      <p className="text-slate-300 text-base font-medium leading-normal">{label}</p>
      <p className="text-white tracking-light text-3xl font-bold leading-tight">{value}</p>
      {change && (
        <p className={`text-base font-medium leading-normal flex items-center gap-1 ${
          change.isPositive ? 'text-[#0bda57]' : 'text-[#fa5f38]'
        }`}>
          <span className="material-symbols-outlined text-lg">
            {change.isPositive ? 'arrow_upward' : 'arrow_downward'}
          </span>
          {change.value}
        </p>
      )}
    </div>
  );
}

export default function DashboardStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        change={{ value: '+5.2%', isPositive: true }}
      />
      <StatCard
        label="Number of Orders"
        value={stats.totalOrders}
        change={{ value: '+8.1%', isPositive: true }}
      />
      <StatCard
        label="Seller Rating"
        value={`${stats.rating}/5`}
        change={{ value: '+0.1', isPositive: true }}
      />
      <StatCard
        label="Product Views"
        value={stats.productViews.toLocaleString()}
        change={{ value: '-1.5%', isPositive: false }}
      />
    </div>
  );
}

