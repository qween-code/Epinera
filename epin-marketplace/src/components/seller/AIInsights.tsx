'use client';

export default function AIInsights() {
  const insights = [
    {
      type: 'Price Recommendation',
      message: "Consider lowering the price of 'Starfall Chronicles' by 10% to increase sales by an estimated 15%.",
    },
    {
      type: 'Market Trend',
      message: "Demand for 'Cyber Odyssey' credits is currently high. Consider a promotion to maximize revenue.",
    },
  ];

  return (
    <div className="bg-primary/10 rounded-xl border border-primary/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">AI Insights</h2>
      </div>
      <div className="flex flex-col gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-[#0c161b]/50 p-4 rounded-lg">
            <p className="text-primary font-semibold text-sm mb-1">{insight.type}</p>
            <p className="text-slate-200 text-sm">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

