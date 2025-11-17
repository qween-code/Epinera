'use client';

interface OrderSearchProps {
  onSearch: (query: string) => void;
}

export default function OrderSearch({ onSearch }: OrderSearchProps) {
  return (
    <div className="w-full">
      <label className="flex flex-col min-w-40 h-12">
        <div className="flex w-full flex-1 items-stretch rounded h-full bg-white dark:bg-[#1A2831] border border-gray-200 dark:border-[#2D3748] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 transition-colors">
          <div className="text-gray-500 dark:text-[#A0AEC0] flex items-center justify-center pl-4">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-gray-800 dark:text-[#EDF2F7] focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 dark:placeholder:text-[#A0AEC0] px-2 text-base font-normal leading-normal"
            placeholder="Search by Order ID, Buyer Name, or Product..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </label>
    </div>
  );
}

