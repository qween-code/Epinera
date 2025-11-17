'use client';

interface RevenueChartProps {
  title: string;
}

export default function RevenueChart({ title }: RevenueChartProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white dark:bg-[#2C2C3E] p-6 lg:col-span-2">
      <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="aspect-[16/9] w-full bg-cover bg-center rounded-lg" data-alt="A line chart showing revenue trends">
        {/* Placeholder for chart - in production, use a charting library like recharts */}
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Chart visualization</p>
        </div>
      </div>
    </div>
  );
}

