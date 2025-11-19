'use client';

import { useState, useEffect } from 'react';
import { ThemeManager, ThemeConfig, accentColors, ThemeMode, AccentColor } from '@/lib/theme-utils';

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState<ThemeConfig>(ThemeManager.getTheme());
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        ThemeManager.initialize();
    }, []);

    const updateTheme = (updates: Partial<ThemeConfig>) => {
        const newTheme = { ...theme, ...updates };
        setTheme(newTheme);
        ThemeManager.saveTheme(updates);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="Theme Settings"
            >
                <span className="material-symbols-outlined text-white">palette</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-xl shadow-2xl border border-white/20 p-6 z-50">
                        <h3 className="text-white font-bold text-lg mb-4">Theme Settings</h3>

                        {/* Theme Mode */}
                        <div className="space-y-3 mb-6">
                            <label className="text-white/70 text-sm font-medium">Mode</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => updateTheme({ mode })}
                                        className={`px-4 py-2 rounded-lg capitalize transition-colors ${theme.mode === mode
                                                ? 'bg-primary text-white'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Accent Color */}
                        <div className="space-y-3 mb-6">
                            <label className="text-white/70 text-sm font-medium">Accent Color</label>
                            <div className="flex gap-3">
                                {(Object.keys(accentColors) as AccentColor[]).map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => updateTheme({ accentColor: color })}
                                        className={`w-10 h-10 rounded-full transition-transform ${theme.accentColor === color ? 'ring-2 ring-white scale-110' : ''
                                            }`}
                                        style={{ backgroundColor: accentColors[color] }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-3 mb-6">
                            <label className="text-white/70 text-sm font-medium">Font Size</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['sm', 'md', 'lg'] as const).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => updateTheme({ fontSize: size })}
                                        className={`px-4 py-2 rounded-lg uppercase text-xs transition-colors ${theme.fontSize === size
                                                ? 'bg-primary text-white'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compact Mode */}
                        <div className="flex items-center justify-between">
                            <label className="text-white/70 text-sm font-medium">Compact Mode</label>
                            <button
                                onClick={() => updateTheme({ compactMode: !theme.compactMode })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${theme.compactMode ? 'bg-primary' : 'bg-white/20'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${theme.compactMode ? 'translate-x-6' : ''
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
