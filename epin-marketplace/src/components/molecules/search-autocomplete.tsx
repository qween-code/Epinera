'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface SearchAutocompleteProps {
    onSearch?: (query: string) => void;
}

export default function SearchAutocomplete({ onSearch }: SearchAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            if (query.length >= 2) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(debounceTimeout);
    }, [query]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('products')
                .select('id, title, slug')
                .ilike('title', `%${query}%`)
                .eq('status', 'active')
                .limit(8);

            setSuggestions(data || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (suggestion: any) => {
        router.push(`/product/${suggestion.slug}`);
        setQuery('');
        setShowSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
            if (onSearch) onSearch(query);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search products..."
                        className="w-full px-4 py-3 pl-12 pr-12 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                        search
                    </span>
                    {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute top-full mt-2 w-full bg-slate-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                    <div className="py-2">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                onClick={() => handleSelect(suggestion)}
                                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3"
                            >
                                <span className="material-symbols-outlined text-white/60">search</span>
                                <span className="text-white">{suggestion.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* View All Results */}
                    <div className="border-t border-white/10">
                        <button
                            onClick={handleSubmit}
                            className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-primary"
                        >
                            <span className="material-symbols-outlined">arrow_forward</span>
                            <span>View all results for "{query}"</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
