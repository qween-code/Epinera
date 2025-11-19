'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewHero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#0B0E14] via-[#13161C] to-[#0B0E14]">
            {/* Background Image - Full Width */}
            <div
                className="absolute inset-0 z-0 h-full w-full bg-cover bg-center opacity-20"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2175&auto=format&fit=crop')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-transparent to-[#0B0E14]/80"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <span className="mb-6 inline-block rounded-full bg-[#00A3FF]/10 px-5 py-2 text-sm font-bold text-[#00A3FF] border border-[#00A3FF]/20">
                        New Arrivals
                    </span>

                    <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                        The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] to-[#00E0FF]">Digital Gaming</span>
                    </h1>

                    <p className="mb-10 text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                        Experience instant delivery, secure transactions, and the best prices on the market. Join over 1 million gamers today.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for games, gift cards, software..."
                                className="w-full px-6 py-4 pl-14 pr-32 rounded-xl bg-[#13161C] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#00A3FF] transition-all"
                            />
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                                search
                            </span>
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00A3FF] hover:bg-[#0088FF] text-white px-6 py-2.5 rounded-lg font-bold transition-all hover:shadow-[0_0_15px_rgba(0,163,255,0.3)]"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/products"
                            className="flex items-center gap-2 rounded-xl bg-[#00A3FF] px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-[#0088FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.4)] hover:scale-105"
                        >
                            <span className="material-symbols-outlined text-xl">shopping_bag</span>
                            Start Shopping
                        </Link>
                        <Link
                            href="/seller/overview"
                            className="flex items-center gap-2 rounded-xl bg-white/5 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 border border-white/10 hover:scale-105"
                        >
                            <span className="material-symbols-outlined text-xl">sell</span>
                            Start Selling
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
