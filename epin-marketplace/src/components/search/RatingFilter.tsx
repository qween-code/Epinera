'use client';

import { useState } from 'react';

interface RatingFilterProps {
    selectedRating: number | null;
    onChange: (rating: number | null) => void;
}

export default function RatingFilter({ selectedRating, onChange }: RatingFilterProps) {
    const ratings = [5, 4, 3, 2, 1];

    return (
        <div className="space-y-4">
            <h3 className="text-white font-bold">Rating</h3>

            <div className="space-y-2">
                <button
                    onClick={() => onChange(null)}
                    className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${selectedRating === null
                            ? 'bg-primary/20 text-primary border-2 border-primary'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border-2 border-transparent'
                        }`}
                >
                    All Ratings
                </button>

                {ratings.map((rating) => (
                    <button
                        key={rating}
                        onClick={() => onChange(rating)}
                        className={`w-full px-4 py-2 rounded-lg text-left transition-colors flex items-center gap-2 ${selectedRating === rating
                                ? 'bg-primary/20 text-primary border-2 border-primary'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 border-2 border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-1">
                            {[...Array(rating)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-yellow-400 text-sm">
                                    star
                                </span>
                            ))}
                            {[...Array(5 - rating)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-white/20 text-sm">
                                    star
                                </span>
                            ))}
                        </div>
                        <span className="text-sm">& Up</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
