import Link from 'next/link';

interface RelatedProduct {
  id: string;
  title: string;
  game: string;
  price: number;
  currency: string;
  image: string;
  slug: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Players Also Bought</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
          >
            <div
              className="w-full bg-center bg-no-repeat bg-cover aspect-video"
              style={{
                backgroundImage: `url(${product.image})`,
              }}
              role="img"
              aria-label={`Product image for ${product.title}`}
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-black dark:text-white flex-grow">{product.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{product.game}</p>
              <p className="text-lg font-bold text-black dark:text-white mt-2">
                {product.currency === 'USD' ? '$' : ''}
                {product.price.toFixed(2)}
                {product.currency !== 'USD' ? ` ${product.currency}` : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

