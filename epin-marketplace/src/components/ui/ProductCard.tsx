import Link from 'next/link';
import Image from 'next/image';
import { PRODUCT_PLACEHOLDER } from '@/lib/constants/games';
import WishlistButton from '@/components/ui/WishlistButton';

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    title: string;
    lowest_price?: number;
    currency?: string;
    image_url?: string;
    average_rating?: number;
    review_count?: number;
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

          {/* Wishlist Button */}
          <div className="absolute top-3 left-3 z-10">
            <WishlistButton productId={product.id} />
          </div>

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

          {/* Rating */}
          {product.average_rating && product.average_rating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(product.average_rating!) ? 'text-[var(--neon-amber)]' : 'text-[var(--text-ghost)]'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[0.6rem] text-[var(--text-ghost)] font-mono-accent">
                ({product.review_count || 0})
              </span>
            </div>
          )}

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
