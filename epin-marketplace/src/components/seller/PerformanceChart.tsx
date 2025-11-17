'use client';

export default function PerformanceChart() {
  return (
    <div className="bg-[#0c161b] rounded-xl border border-[#315768] p-6">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Performance</h2>
      <div className="w-full h-80 bg-[#101c22] rounded-lg flex items-center justify-center">
        <img
          className="w-full h-full object-contain p-4"
          data-alt="A line chart showing sales trends over the last 7 days, indicating an upward trajectory."
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
          alt="Performance Chart"
        />
      </div>
    </div>
  );
}

