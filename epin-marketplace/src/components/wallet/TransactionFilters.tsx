'use client';

import { useState } from 'react';

interface TransactionFiltersProps {
  onSearchChange?: (query: string) => void;
  onDateRangeChange?: (range: string) => void;
  onTypeChange?: (type: string) => void;
  onStatusChange?: (status: string) => void;
  onReset?: () => void;
  onApply?: () => void;
}

export default function TransactionFilters({
  onSearchChange,
  onDateRangeChange,
  onTypeChange,
  onStatusChange,
  onReset,
  onApply,
}: TransactionFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleDateRangeChange = () => {
    const ranges = ['all', '7days', '30days', '90days', 'custom'];
    const currentIndex = ranges.indexOf(dateRange);
    const nextRange = ranges[(currentIndex + 1) % ranges.length];
    setDateRange(nextRange);
    onDateRangeChange?.(nextRange);
  };

  const handleTypeChange = () => {
    const types = ['all', 'deposit', 'withdrawal', 'purchase', 'refund', 'bonus'];
    const currentIndex = types.indexOf(type);
    const nextType = types[(currentIndex + 1) % types.length];
    setType(nextType);
    onTypeChange?.(nextType);
  };

  const handleStatusChange = () => {
    const statuses = ['all', 'completed', 'pending', 'failed'];
    const currentIndex = statuses.indexOf(status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    setStatus(nextStatus);
    onStatusChange?.(nextStatus);
  };

  const handleReset = () => {
    setSearchQuery('');
    setDateRange('all');
    setType('all');
    setStatus('all');
    onReset?.();
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-b border-white/10 dark:border-[#223d49]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Bar */}
        <div className="lg:col-span-1">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-white/50 dark:text-[#90b8cb] flex border-none bg-white/10 dark:bg-[#223d49] items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-white/10 dark:bg-[#223d49] focus:border-none h-full placeholder:text-white/50 dark:placeholder:text-[#90b8cb] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Search by product or ID"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* Filter Chips */}
        <div className="lg:col-span-2 flex items-center gap-3 overflow-x-auto">
          <button
            onClick={handleDateRangeChange}
            className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white/10 dark:bg-[#223d49] px-4 hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors"
          >
            <span className="material-symbols-outlined text-white/70">calendar_month</span>
            <p className="text-white text-sm font-medium leading-normal">
              {dateRange === 'all' ? 'Date Range' : dateRange === '7days' ? 'Last 7 Days' : dateRange === '30days' ? 'Last 30 Days' : dateRange === '90days' ? 'Last 90 Days' : 'Custom'}
            </p>
            <span className="material-symbols-outlined text-white/70">expand_more</span>
          </button>
          <button
            onClick={handleTypeChange}
            className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white/10 dark:bg-[#223d49] px-4 hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors"
          >
            <span className="material-symbols-outlined text-white/70">receipt_long</span>
            <p className="text-white text-sm font-medium leading-normal">
              {type === 'all' ? 'Transaction Type' : type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
            <span className="material-symbols-outlined text-white/70">expand_more</span>
          </button>
          <button
            onClick={handleStatusChange}
            className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white/10 dark:bg-[#223d49] px-4 hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors"
          >
            <span className="material-symbols-outlined text-white/70">sell</span>
            <p className="text-white text-sm font-medium leading-normal">
              {status === 'all' ? 'Status' : status.charAt(0).toUpperCase() + status.slice(1)}
            </p>
            <span className="material-symbols-outlined text-white/70">expand_more</span>
          </button>
        </div>
      </div>

      {/* Button Group */}
      <div className="flex justify-end">
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-white/10 dark:bg-[#223d49] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors"
          >
            <span className="truncate">Reset</span>
          </button>
          <button
            onClick={onApply}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
          >
            <span className="truncate">Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}

