'use client';

import { useState } from 'react';

interface CategoryFiltersProps {
  categories?: Array<{ id: string; name: string }>;
  onCategoryChange?: (categoryIds: string[]) => void;
  onPriceRangeChange?: (min: number, max: number) => void;
  onRatingChange?: (minRating: number) => void;
  onReset?: () => void;
  onApply?: () => void;
}

export default function CategoryFilters({
  categories = [],
  onCategoryChange,
  onPriceRangeChange,
  onRatingChange,
  onReset,
  onApply,
}: CategoryFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleCategoryToggle = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelection);
    onCategoryChange?.(newSelection);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value);
    setPriceRange({ ...priceRange, max });
    onPriceRangeChange?.(priceRange.min, max);
  };

  const handleRatingClick = (rating: number) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    onRatingChange?.(newRating || 0);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
    setSelectedRating(null);
    onReset?.();
  };

  const handleApply = () => {
    onApply?.();
  };

  const renderStars = (rating: number, filled: number) => {
    return (
      <>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined ${i < filled ? 'text-yellow-400' : 'text-white/30'}`}
            style={{ fontSize: '20px' }}
          >
            star
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="sticky top-28 flex flex-col gap-6">
      {/* Filters Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Filters</h3>
        <button
          onClick={handleReset}
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Filter Sections */}
      <div className="flex flex-col gap-6">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white">Category</h4>
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 text-sm text-white/80 cursor-pointer hover:text-white transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="form-checkbox h-4 w-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white">Price Range</h4>
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange.max}
              onChange={handlePriceRangeChange}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-sm text-white/60">
              <span>${priceRange.min}</span>
              <span>${priceRange.max}</span>
            </div>
          </div>
        </div>

        {/* Seller Rating Filter */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white">Seller Rating</h4>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleRatingClick(5)}
              className={`flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors ${
                selectedRating === 5 ? 'text-white' : ''
              }`}
            >
              {renderStars(5, 5)}
            </button>
            <button
              onClick={() => handleRatingClick(4)}
              className={`flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors ${
                selectedRating === 4 ? 'text-white' : ''
              }`}
            >
              {renderStars(4, 4)}
              <span className="ml-1">& Up</span>
            </button>
            <button
              onClick={() => handleRatingClick(3)}
              className={`flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors ${
                selectedRating === 3 ? 'text-white' : ''
              }`}
            >
              {renderStars(3, 3)}
              <span className="ml-1">& Up</span>
            </button>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] transition-opacity hover:opacity-90"
      >
        Apply Filters
      </button>
    </div>
  );
}

