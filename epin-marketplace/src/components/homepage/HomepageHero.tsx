'use client';

import { useState } from 'react';

export default function HomepageHero() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="@container mb-12">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
          data-alt="Abstract futuristic digital landscape"
          style={{
            backgroundImage: `linear-gradient(rgba(18, 18, 24, 0.6) 0%, rgba(18, 18, 24, 0.9) 100%), url("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80")`,
          }}
        >
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              The Future of Digital Gaming is Here
            </h1>
            <h2 className="text-white/80 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              Instantly find, trade, and secure your next game with our AI-powered marketplace.
            </h2>
          </div>
          <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-white/70 flex border border-white/20 bg-container-dark items-center justify-center pl-[15px] rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-2xl">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-white/20 bg-container-dark h-full placeholder:text-white/70 px-[15px] border-r-0 border-l-0 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
                placeholder="Search for games, Epins, or gift cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center justify-center rounded-r-lg border-l-0 border border-white/20 bg-container-dark pr-[7px]">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary hover:bg-primary/90 text-black text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] transition-colors">
                  <span className="truncate">Search</span>
                </button>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

