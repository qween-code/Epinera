'use client';

import { useState } from 'react';

interface TransactionHistoryTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function TransactionHistoryTabs({ activeTab = 'all', onTabChange }: TransactionHistoryTabsProps) {
  const tabs = [
    { id: 'all', label: 'All Transactions' },
    { id: 'deposits', label: 'Deposits' },
    { id: 'withdrawals', label: 'Withdrawals' },
    { id: 'purchases', label: 'Purchases' },
  ];

  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="border-b border-white/10 px-4">
      <nav className="-mb-px flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentTab === tab.id
                ? 'text-primary border-primary'
                : 'text-gray-400 hover:text-white border-transparent hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

