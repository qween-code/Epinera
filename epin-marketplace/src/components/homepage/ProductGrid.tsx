'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
    id: string;
    title: string;
    slug?: string;
    price: number;
    originalPrice?: number;
    image: string;
    platform: 'steam' | 'xbox' | 'playstation' | 'origin' | 'uplay';
    rating: number;
}

interface ProductGridProps {
    title: string;
    icon: string;
    products: Product[];
}

const platformIcons = {
    steam: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
    xbox: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg',
    playstation: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg',
    origin: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Origin.svg', // Placeholder
    uplay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Ubisoft_Connect_logo.svg/1200px-Ubisoft_Connect_logo.svg.png', // Placeholder
};

export default function ProductGrid({ title, icon, products }: ProductGridProps) {
    return (
        <section className="py-8">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A3FF]/10 text-[#00A3FF]">
                        <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>
                <Link
                    href="/products"
                    className="flex items-center gap-1 text-sm font-bold text-[#00A3FF] hover:text-[#0088FF] transition-colors"
                >
                    View All
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((product, index) => (
                    <Link
                        key={product.id}
                        href={`/product/${product.slug || product.id}`}
                        className="block"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#13161C] transition-all hover:border-[#00A3FF]/50 hover:shadow-[0_0_20px_rgba(0,163,255,0.15)] hover:-translate-y-1 h-full cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative aspect-[3/4] w-full overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#13161C] via-transparent to-transparent opacity-60"></div>

                                {/* Platform Icon */}
                                <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 backdrop-blur-md p-1.5 flex items-center justify-center border border-white/10">
                                    {/* Using text for simplicity if icon URL fails, ideally use SVG or Image */}
                                    <span className="text-[10px] font-bold text-white uppercase">{product.platform.slice(0, 2)}</span>
                                </div>

                                {/* Discount Badge */}
                                {product.originalPrice && (
                                    <div className="absolute top-3 left-3 rounded-lg bg-[#00A3FF] px-2 py-1 text-xs font-bold text-white shadow-lg">
                                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="mb-1 truncate text-base font-bold text-white group-hover:text-[#00A3FF] transition-colors">{product.title}</h3>
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                    <span className="text-xs font-medium text-gray-400">{product.rating}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        {product.originalPrice && (
                                            <span className="text-xs font-medium text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                                        )}
                                        <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            // Add to cart logic here
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#00A3FF] hover:bg-[#00A3FF] hover:text-white transition-all"
                                    >
                                        <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
