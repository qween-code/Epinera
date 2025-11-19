'use client';

import { useState } from 'react';

interface PriceRangeFilterProps {
    minPrice: number;
    maxPrice: number;
    onChange: (min: number, max: number) => void;
}

export default function PriceRangeFilter({ minPrice, maxPrice, onChange }: PriceRangeFilterProps) {
    const [min, setMin] = useState(minPrice);
    const [max, setMax] = useState(maxPrice);

    const handleMinChange = (value: number) => {
        const newMin = Math.min(value, max - 1);
        setMin(newMin);
        onChange(newMin, max);
    };

    const handleMaxChange = (value: number) => {
        const newMax = Math.max(value, min + 1);
        setMax(newMax);
        onChange(min, newMax);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-white font-bold">Price Range</h3>

            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="text-white/70 text-sm">Min</label>
                        <input
                            type="number"
                            value={min}
                            onChange={(e) => handleMinChange(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                            min="0"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-white/70 text-sm">Max</label>
                        <input
                            type="number"
                            value={max}
                            onChange={(e) => handleMaxChange(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                            min="0"
                        />
                    </div>
                </div>

                {/* Slider */}
                <div className="relative pt-6 pb-2">
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={min}
                        onChange={(e) => handleMinChange(Number(e.target.value))}
                        className="absolute w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        style={{ zIndex: min > max - 100 ? 5 : 3 }}
                    />
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={max}
                        onChange={(e) => handleMaxChange(Number(e.target.value))}
                        className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
                        style={{ zIndex: 4 }}
                    />
                    <div className="relative h-2 bg-white/10 rounded-lg">
                        <div
                            className="absolute h-2 bg-primary rounded-lg"
                            style={{
                                left: `${(min / 1000) * 100}%`,
                                right: `${100 - (max / 1000) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-between text-white/60 text-sm">
                    <span>${min}</span>
                    <span>${max}</span>
                </div>
            </div>
        </div>
    );
}
