import Link from 'next/link';
import Image from 'next/image';
import { PRODUCT_PLACEHOLDER } from '@/lib/constants/games';

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    title: string;
    lowest_price?: number;
    currency?: string;
    image_url?: string;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <div className="card card-glow h-full flex flex-col overflow-hidden p-0">
        {/* Product Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={product.image_url || PRODUCT_PLACEHOLDER}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />

          {/* Quick View Badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <div className="glass px-2.5 py-1 rounded-md text-[0.65rem] font-semibold text-[var(--neon-cyan)]">
              Hizli Goruntule
            </div>
          </div>

          {/* Bottom gradient line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm font-semibold mb-2 line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors leading-snug">
            {product.title}
          </h3>

          <div className="mt-auto pt-3 flex items-end justify-between border-t border-[var(--border-dim)]">
            {product.lowest_price ? (
              <div>
                <div className="text-lg font-bold text-neon-cyan stat-number">
                  {product.lowest_price.toFixed(2)}
                  <span className="text-xs ml-1 text-[var(--text-tertiary)] font-normal">{product.currency || 'TRY'}</span>
                </div>
                <div className="text-[0.6rem] text-[var(--text-ghost)] font-mono-accent mt-0.5">
                  &apos;dan baslayan
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-ghost)]">Fiyatlar icin tiklayin</p>
            )}

            {/* Add to Cart Icon */}
            <button
              className="w-9 h-9 rounded-lg neo-sm flex items-center justify-center border border-[rgba(0,240,255,0.15)] opacity-0 group-hover:opacity-100 hover:border-[rgba(0,240,255,0.4)] hover:shadow-[var(--glow-cyan-sm)] transition-all"
              aria-label="Sepete ekle"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <svg className="w-4 h-4 text-[var(--neon-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
