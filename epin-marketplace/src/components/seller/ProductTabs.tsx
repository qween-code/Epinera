'use client';

import { useState } from 'react';

interface ProductTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function ProductTabs({ activeTab = 'all', onTabChange }: ProductTabsProps) {
  const tabs = [
    { id: 'all', label: 'All Products' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'new', label: 'New Arrivals' },
  ];

  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="pb-3">
      <div className="flex border-b border-[#315768] gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
              currentTab === tab.id
                ? 'border-b-primary text-white'
                : 'border-b-transparent text-[#90b8cb] hover:border-b-primary/50 hover:text-white'
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

