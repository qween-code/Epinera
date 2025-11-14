import Link from 'next/link';

// Updated ProductCard to handle the new data structure (base product + variants).
// It now links to the product detail page and shows the lowest price.

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    title: string;
    // This assumes we'll fetch and attach the lowest price variant beforehand
    lowest_price?: number;
    currency?: string;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group-hover:shadow-sky-500/50 transition-shadow h-full flex flex-col">
        <div className="h-48 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white truncate group-hover:text-sky-400">
            {product.title}
          </h3>
          <div className="mt-4 flex-grow flex items-end justify-between">
            {product.lowest_price ? (
              <p className="text-xl font-bold text-sky-400">
                {product.lowest_price.toFixed(2)} {product.currency || 'TRY'}
                <span className="text-sm text-gray-400 font-normal"> 'dan başlayan</span>
              </p>
            ) : (
              <p className="text-sm text-gray-400">Fiyatlar için tıklayın</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
