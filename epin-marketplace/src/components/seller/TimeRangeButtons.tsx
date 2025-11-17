'use client';

interface TimeRangeButtonsProps {
  activeRange: string;
  onRangeChange: (range: string) => void;
}

export default function TimeRangeButtons({ activeRange, onRangeChange }: TimeRangeButtonsProps) {
  const ranges = [
    { id: '30days', label: 'Last 30 Days' },
    { id: '7days', label: 'Last 7 Days' },
    { id: '90days', label: 'Last 90 Days' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ranges.map((range) => (
        <button
          key={range.id}
          onClick={() => onRangeChange(range.id)}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-2 transition-colors ${
            activeRange === range.id
              ? 'bg-primary/20 text-primary dark:bg-primary/20 dark:text-primary'
              : 'bg-white dark:bg-[#2C2C3E] text-gray-900 dark:text-white'
          }`}
        >
          <p className="text-sm font-medium leading-normal">{range.label}</p>
          {activeRange === range.id && (
            <span className="material-symbols-outlined text-lg">expand_more</span>
          )}
        </button>
      ))}
    </div>
  );
}

