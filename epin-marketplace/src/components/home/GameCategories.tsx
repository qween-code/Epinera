'use client';

import Image from 'next/image';
import Link from 'next/link';
import { GAME_ASSETS, CATEGORY_IMAGES } from '@/lib/constants/games';

const CATEGORIES = [
  {
    name: 'Valorant',
    slug: 'valorant',
    key: 'valorant' as const,
    description: 'VP, Hesap ve Skinler',
    tag: 'FPS',
  },
  {
    name: 'League of Legends',
    slug: 'league-of-legends',
    key: 'lol' as const,
    description: 'RP, Hesap ve Championlar',
    tag: 'MOBA',
  },
  {
    name: 'PUBG Mobile',
    slug: 'pubg-mobile',
    key: 'pubg' as const,
    description: 'UC, Royal Pass ve Skinler',
    tag: 'BR',
  },
  {
    name: 'Steam',
    slug: 'steam',
    key: 'steam' as const,
    description: 'Wallet Code ve Oyunlar',
    tag: 'PLATFORM',
  },
  {
    name: 'Knight Online',
    slug: 'knight-online',
    key: 'knightOnline' as const,
    description: 'GB, Hesap ve Itemlar',
    tag: 'MMORPG',
  },
];

export default function GameCategories() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]">
            <span className="terminal-label text-[0.6rem]">// POPULER OYUNLAR</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading mb-3">
            <span className="text-gradient">Oyun Kategorileri</span>
          </h2>
          <p className="text-[var(--text-tertiary)] max-w-md mx-auto">
            Favori oyunun icin hemen al, hemen oyna
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((category, index) => {
            const gameAsset = GAME_ASSETS[category.key];

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-xl neo-flat p-5 flex flex-col items-center text-center holographic"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Background Image - very subtle */}
                <div className="absolute inset-0 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500">
                  <Image
                    src={CATEGORY_IMAGES[category.key]}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${gameAsset.color}, transparent)` }}
                />

                {/* Tag */}
                <div className="absolute top-3 right-3">
                  <span className="badge badge-ghost text-[0.55rem]">{category.tag}</span>
                </div>

                {/* Game Logo */}
                <div
                  className="relative w-16 h-16 mb-4 p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${gameAsset.color}20, ${gameAsset.color}08)`,
                    border: `1px solid ${gameAsset.color}25`,
                    boxShadow: `0 0 0 rgba(0,0,0,0)`,
                  }}
                >
                  <Image
                    src={gameAsset.logo}
                    alt={category.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold mb-1 text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[var(--text-tertiary)]">
                  {category.description}
                </p>

                {/* Hover arrow */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-xs font-semibold text-[var(--neon-cyan)] flex items-center gap-1">
                    Kesfet
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
