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
      <div className="card card-glow h-full flex flex-col overflow-hidden">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.image_url || PRODUCT_PLACEHOLDER}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

          {/* Quick View Badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="glass px-3 py-1 rounded-full text-xs font-semibold">
              Hızlı Görünüm
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {product.title}
          </h3>

          <div className="mt-auto pt-4 flex items-center justify-between">
            {product.lowest_price ? (
              <div>
                <div className="text-2xl font-bold text-primary-400">
                  {product.lowest_price.toFixed(2)} {product.currency || 'TRY'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  'dan başlayan
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Fiyatlar için tıklayın</p>
            )}

            {/* Add to Cart Icon */}
            <button
              className="w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Sepete ekle"
              onClick={(e) => {
                e.preventDefault();
                // Will be handled by the product page
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
