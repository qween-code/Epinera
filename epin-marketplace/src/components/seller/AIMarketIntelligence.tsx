'use client';

interface Insight {
  id: string;
  type: 'trend' | 'restock' | 'pricing' | 'demand';
  title: string;
  description: string;
}

interface AIMarketIntelligenceProps {
  insights: Insight[];
}

export default function AIMarketIntelligence({ insights }: AIMarketIntelligenceProps) {
  const getIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      trend: 'auto_awesome',
      restock: 'inventory_2',
      pricing: 'attach_money',
      demand: 'trending_up',
    };
    return iconMap[type] || 'lightbulb';
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white dark:bg-[#2C2C3E] p-6">
      <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
        AI Market Intelligence
      </h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="flex gap-4 rounded-lg bg-[#50E3C2]/10 p-3">
            <span className="material-symbols-outlined text-[#50E3C2]">{getIcon(insight.type)}</span>
            <div>
              <p className="font-bold text-[#50E3C2]">{insight.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
            </div>
          </div>
        ))}
        {insights.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No insights available</p>
        )}
      </div>
    </div>
  );
}

