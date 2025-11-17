'use client';

import { useState } from 'react';

interface OrderFiltersProps {
  onStatusChange?: (status: string) => void;
  onDateRangeChange?: (range: string) => void;
  onVIPChange?: (vip: string) => void;
}

export default function OrderFilters({ onStatusChange, onDateRangeChange, onVIPChange }: OrderFiltersProps) {
  const [status, setStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [vip, setVip] = useState('all');

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => {
          const newStatus = status === 'all' ? 'pending' : status === 'pending' ? 'processing' : status === 'processing' ? 'completed' : 'all';
          setStatus(newStatus);
          onStatusChange?.(newStatus);
        }}
        className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded bg-white dark:bg-[#1A2831] border border-gray-200 dark:border-[#2D3748] pl-3 pr-2 hover:bg-primary/10 transition-colors"
      >
        <span className="material-symbols-outlined text-base">sell</span>
        <p className="text-gray-800 dark:text-[#EDF2F7] text-sm font-medium leading-normal">
          Status: {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
        <span className="material-symbols-outlined text-base">expand_more</span>
      </button>
      <button
        onClick={() => {
          const newRange = dateRange === 'all' ? '7days' : dateRange === '7days' ? '30days' : dateRange === '30days' ? '90days' : 'all';
          setDateRange(newRange);
          onDateRangeChange?.(newRange);
        }}
        className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded bg-white dark:bg-[#1A2831] border border-gray-200 dark:border-[#2D3748] pl-3 pr-2 hover:bg-primary/10 transition-colors"
      >
        <span className="material-symbols-outlined text-base">calendar_month</span>
        <p className="text-gray-800 dark:text-[#EDF2F7] text-sm font-medium leading-normal">Date Range</p>
        <span className="material-symbols-outlined text-base">expand_more</span>
      </button>
      <button
        onClick={() => {
          const newVip = vip === 'all' ? 'vip' : vip === 'vip' ? 'non-vip' : 'all';
          setVip(newVip);
          onVIPChange?.(newVip);
        }}
        className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded bg-white dark:bg-[#1A2831] border border-gray-200 dark:border-[#2D3748] pl-3 pr-2 hover:bg-primary/10 transition-colors"
      >
        <span className="material-symbols-outlined text-base text-[#D69E2E]">star</span>
        <p className="text-gray-800 dark:text-[#EDF2F7] text-sm font-medium leading-normal">
          VIP Status: {vip === 'all' ? 'All' : vip === 'vip' ? 'VIP' : 'Non-VIP'}
        </p>
        <span className="material-symbols-outlined text-base">expand_more</span>
      </button>
    </div>
  );
}

