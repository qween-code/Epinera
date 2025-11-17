'use client';

interface CustomerInsightsProps {
  returningPercentage: number;
  newPercentage: number;
}

export default function CustomerInsights({ returningPercentage, newPercentage }: CustomerInsightsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white dark:bg-[#2C2C3E] p-6">
      <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
        Customer Insights
      </h2>
      <div className="aspect-square w-full bg-cover bg-center rounded-lg" data-alt="A donut chart showing customer breakdown">
        {/* Placeholder for chart */}
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{returningPercentage}%</div>
            <p className="text-gray-600 dark:text-gray-400">Returning</p>
          </div>
        </div>
      </div>
      <div className="flex justify-around text-sm">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-[#4A90E2]"></div>
          <span className="text-gray-600 dark:text-gray-300">Returning ({returningPercentage}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-[#50E3C2]"></div>
          <span className="text-gray-600 dark:text-gray-300">New ({newPercentage}%)</span>
        </div>
      </div>
    </div>
  );
}

