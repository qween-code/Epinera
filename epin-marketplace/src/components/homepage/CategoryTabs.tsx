'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHomepageCategories } from '@/app/actions/homepage';

const categoryIcons: Record<string, string> = {
  steam: 'desktop_windows',
  playstation: 'stadia_controller',
  xbox: 'sports_esports',
  mobile: 'smartphone',
  nintendo: 'sports_esports',
  epic: 'storefront',
  default: 'category',
};

export default function CategoryTabs() {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getHomepageCategories();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].slug);
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Explore by Category</h2>
      <div className="pb-3">
        <div className="flex border-b border-white/10 px-4 gap-8 overflow-x-auto">
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            const icon = categoryIcons[category.slug.toLowerCase()] || categoryIcons.default;
            
            return (
              <Link
                key={category.id}
                className={`flex flex-col items-center justify-center border-b-[3px] gap-1 pb-[7px] pt-2.5 transition-colors ${
                  isActive
                    ? 'border-b-primary text-primary'
                    : 'border-b-transparent text-white/50 hover:text-white'
                }`}
                href={`/category/${category.slug}`}
                onClick={() => setActiveCategory(category.slug)}
              >
                <span className="material-symbols-outlined">{icon}</span>
                <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${isActive ? 'text-primary' : ''}`}>
                  {category.name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

