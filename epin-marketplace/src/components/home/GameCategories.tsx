'use client';

import Image from 'next/image';
import Link from 'next/link';
import { GAME_ASSETS, CATEGORY_IMAGES } from '@/lib/constants/games';

const CATEGORIES = [
  {
    name: 'Valorant',
    slug: 'valorant',
    key: 'valorant' as const,
    description: 'VP, Hesap ve Skin\'ler',
  },
  {
    name: 'League of Legends',
    slug: 'league-of-legends',
    key: 'lol' as const,
    description: 'RP, Hesap ve Champion\'lar',
  },
  {
    name: 'PUBG Mobile',
    slug: 'pubg-mobile',
    key: 'pubg' as const,
    description: 'UC, Royal Pass ve Skin\'ler',
  },
  {
    name: 'Steam',
    slug: 'steam',
    key: 'steam' as const,
    description: 'Wallet Code ve Oyunlar',
  },
  {
    name: 'Knight Online',
    slug: 'knight-online',
    key: 'knightOnline' as const,
    description: 'GB, Hesap ve Item\'lar',
  },
];

export default function GameCategories() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Popüler Oyunlar</span>
          </h2>
          <p className="text-xl text-gray-400">
            Favori oyunun için hemen al, hemen oyna
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {CATEGORIES.map((category) => {
            const gameAsset = GAME_ASSETS[category.key];

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl card card-glow"
                style={{
                  background: `linear-gradient(135deg, ${gameAsset.color}15 0%, transparent 100%)`,
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                  <Image
                    src={CATEGORY_IMAGES[category.key]}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="relative p-6 flex flex-col items-center text-center">
                  {/* Game Logo */}
                  <div
                    className="w-20 h-20 mb-4 p-4 rounded-2xl transition-transform group-hover:scale-110"
                    style={{ background: gameAsset.gradient }}
                  >
                    <Image
                      src={gameAsset.logo}
                      alt={category.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400">
                    {category.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <div className="flex items-center gap-2 text-primary-400 font-semibold">
                      <span>Keşfet</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
