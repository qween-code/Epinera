'use client';

import React from 'react';

// --- Simple Line Chart (Sales Over Time) ---
interface LineChartProps {
    data: { label: string; value: number }[];
    color?: string;
    height?: number;
}

export function SimpleLineChart({ data, color = '#00A3FF', height = 320 }: LineChartProps) {
    if (!data || data.length === 0) return <div className="flex h-full items-center justify-center text-gray-500">No data available</div>;

    const maxValue = Math.max(...data.map((d) => d.value)) * 1.1; // 10% padding
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxValue) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative w-full" style={{ height: `${height}px` }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((tick) => (
                    <line
                        key={tick}
                        x1="0"
                        y1={tick}
                        x2="100"
                        y2={tick}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}

                {/* Line */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Area (Gradient) */}
                <path
                    d={`M0,100 ${points.split(' ').map(p => `L${p}`).join(' ')} L100,100 Z`}
                    fill={color}
                    fillOpacity="0.1"
                    stroke="none"
                />
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 translate-y-6">
                {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d, i) => (
                    <span key={i}>{d.label}</span>
                ))}
            </div>
        </div>
    );
}

// --- Simple Bar Chart (Age Demographics) ---
interface BarChartProps {
    data: { label: string; value: number }[];
    color?: string;
}

export function SimpleBarChart({ data, color = '#00A3FF' }: BarChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="flex h-64 w-full items-end justify-between gap-2">
            {data.map((d, i) => (
                <div key={i} className="group relative flex h-full flex-1 flex-col justify-end">
                    <div className="relative w-full rounded-t-md bg-opacity-20 transition-all hover:bg-opacity-30" style={{ height: `${(d.value / maxValue) * 100}%`, backgroundColor: color }}>
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
                            {d.value}%
                        </div>
                    </div>
                    <span className="mt-2 text-center text-xs text-gray-500">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

// --- Simple Donut Chart (Gender Split) ---
interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
    size?: number;
}

export function SimpleDonutChart({ data, size = 160 }: DonutChartProps) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;

    return (
        <div className="flex items-center gap-8">
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 transform">
                    {data.map((d, i) => {
                        const percentage = d.value / total;
                        const dashArray = percentage * 314; // 2 * PI * R (R=50) => ~314
                        const offset = currentAngle;
                        currentAngle += dashArray; // Accumulate for next segment (stroke-dashoffset is tricky with multiple segments, simpler to use path commands for complex donuts, but circle stroke-dasharray works for simple cases if calculated correctly relative to circumference)

                        // For simple multi-segment donut, circle stroke-dasharray is hard to stack. 
                        // Better approach: Use paths.

                        // Calculating path for arc
                        const startAngle = (currentAngle - dashArray) / 314 * 360;
                        const endAngle = currentAngle / 314 * 360;

                        // Convert to radians
                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;

                        const x1 = 50 + 40 * Math.cos(startRad);
                        const y1 = 50 + 40 * Math.sin(startRad);
                        const x2 = 50 + 40 * Math.cos(endRad);
                        const y2 = 50 + 40 * Math.sin(endRad);

                        const largeArcFlag = percentage > 0.5 ? 1 : 0;

                        const pathData = [
                            `M 50 50`,
                            `L ${x1} ${y1}`,
                            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                            `Z`
                        ].join(' ');

                        return (
                            <path
                                key={i}
                                d={pathData}
                                fill={d.color}
                                stroke="white"
                                strokeWidth="2"
                                className="dark:stroke-slate-900"
                            />
                        );
                    })}
                    <circle cx="50" cy="50" r="25" className="fill-white dark:fill-slate-900" />
                </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{d.label}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round((d.value / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Location List (Top Locations) ---
interface LocationListProps {
    data: { country: string; value: number; flag: string }[];
}

export function LocationList({ data }: LocationListProps) {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="flex flex-col gap-4">
            {data.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{d.flag}</span>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{d.country}</span>
                            <span className="text-sm text-gray-500">{d.value}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${(d.value / maxValue) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
