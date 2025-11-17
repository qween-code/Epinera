'use client';

import Link from 'next/link';

export default function CategoryTabs() {
  return (
    <div className="mb-12">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Explore by Category</h2>
      <div className="pb-3">
        <div className="flex border-b border-white/10 px-4 gap-8">
          <Link
            className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary gap-1 pb-[7px] pt-2.5"
            href="#"
          >
            <span className="material-symbols-outlined">desktop_windows</span>
            <p className="text-primary text-sm font-bold leading-normal tracking-[0.015em]">Steam</p>
          </Link>
          <Link
            className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-white/50 hover:text-white transition-colors gap-1 pb-[7px] pt-2.5"
            href="#"
          >
            <span className="material-symbols-outlined">stadia_controller</span>
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">PlayStation</p>
          </Link>
          <Link
            className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-white/50 hover:text-white transition-colors gap-1 pb-[7px] pt-2.5"
            href="#"
          >
            <span className="material-symbols-outlined">sports_esports</span>
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Xbox</p>
          </Link>
          <Link
            className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-white/50 hover:text-white transition-colors gap-1 pb-[7px] pt-2.5"
            href="#"
          >
            <span className="material-symbols-outlined">smartphone</span>
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Mobile</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

