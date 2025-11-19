'use client';

import { useState } from 'react';
import PriceRangeFilter from './PriceRangeFilter';
import RatingFilter from './RatingFilter';

interface AdvancedFiltersProps {
    onFilterChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
    priceMin: number;
    priceMax: number;
    rating: number | null;
    inStock: boolean;
    categories: string[];
}

export default function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
    const [filters, setFilters] = useState<SearchFilters>({
        priceMin: 0,
        priceMax: 1000,
        rating: null,
        inStock: false,
        categories: [],
    });

    const updateFilters = (updates: Partial<SearchFilters>) => {
        const newFilters = { ...filters, ...updates };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const defaultFilters: SearchFilters = {
            priceMin: 0,
            priceMax: 1000,
            rating: null,
            inStock: false,
            categories: [],
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    return (
        <div className="space-y-6 bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
                <h2 className="text-white text-xl font-bold">Filters</h2>
                <button
                    onClick={resetFilters}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                    Reset All
                </button>
            </div>

            {/* Price Range */}
            <PriceRangeFilter
                minPrice={filters.priceMin}
                maxPrice={filters.priceMax}
                onChange={(min, max) => updateFilters({ priceMin: min, priceMax: max })}
            />

            <div className="border-t border-white/10 pt-6">
                {/* Rating */}
                <RatingFilter
                    selectedRating={filters.rating}
                    onChange={(rating) => updateFilters({ rating })}
                />
            </div>

            <div className="border-t border-white/10 pt-6">
                {/* Availability */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold">Availability</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => updateFilters({ inStock: e.target.checked })}
                            className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                        />
                        <span className="text-white">In Stock Only</span>
                    </label>
                </div>
            </div>

            {/* Active Filters Count */}
            {(filters.rating !== null || filters.inStock || filters.priceMin > 0 || filters.priceMax < 1000) && (
                <div className="border-t border-white/10 pt-6">
                    <div className="bg-primary/10 rounded-lg p-3 text-center">
                        <p className="text-primary text-sm font-medium">
                            {[
                                filters.rating !== null,
                                filters.inStock,
                                filters.priceMin > 0 || filters.priceMax < 1000,
                            ].filter(Boolean).length}{' '}
                            active filter(s)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
