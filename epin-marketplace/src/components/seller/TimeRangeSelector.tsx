'use client';

import { useState } from 'react';

type TimeRange = '7days' | '30days' | '90days' | 'custom';

export default function TimeRangeSelector({ onRangeChange }: { onRangeChange?: (range: TimeRange) => void }) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('7days');

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    onRangeChange?.(range);
  };

  return (
    <div className="flex gap-2 p-1 overflow-x-auto">
      <button
        onClick={() => handleRangeChange('7days')}
        className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${
          selectedRange === '7days'
            ? 'bg-primary/20'
            : 'bg-[#223d49] hover:bg-primary/20 hover:text-primary'
        }`}
      >
        <p className={`text-sm font-medium leading-normal ${
          selectedRange === '7days' ? 'text-primary' : 'text-white'
        }`}>Last 7 Days</p>
      </button>
      <button
        onClick={() => handleRangeChange('30days')}
        className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${
          selectedRange === '30days'
            ? 'bg-primary/20'
            : 'bg-[#223d49] hover:bg-primary/20 hover:text-primary'
        }`}
      >
        <p className={`text-sm font-medium leading-normal ${
          selectedRange === '30days' ? 'text-primary' : 'text-white'
        }`}>Last 30 Days</p>
      </button>
      <button
        onClick={() => handleRangeChange('90days')}
        className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${
          selectedRange === '90days'
            ? 'bg-primary/20'
            : 'bg-[#223d49] hover:bg-primary/20 hover:text-primary'
        }`}
      >
        <p className={`text-sm font-medium leading-normal ${
          selectedRange === '90days' ? 'text-primary' : 'text-white'
        }`}>Last 90 Days</p>
      </button>
      <button
        onClick={() => handleRangeChange('custom')}
        className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-3 transition-colors ${
          selectedRange === 'custom'
            ? 'bg-primary/20'
            : 'bg-[#223d49] hover:bg-primary/20 hover:text-primary'
        }`}
      >
        <p className={`text-sm font-medium leading-normal ${
          selectedRange === 'custom' ? 'text-primary' : 'text-white'
        }`}>Custom Range</p>
        <span className="material-symbols-outlined text-base">calendar_today</span>
      </button>
    </div>
  );
}

