import ProductCard from './ProductCard';

type Product = {
  id: string;
  slug: string;
  title: string;
  product_variants?: { price: number, currency: string }[];
  lowest_price?: number;
  currency?: string;
};

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="neo rounded-2xl p-14 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neo-inset flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--text-ghost)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 className="text-xl font-heading mb-2">Urun Bulunamadi</h2>
        <p className="text-sm text-[var(--text-tertiary)]">Bu kategoride gosterilecek urun bulunmuyor.</p>
      </div>
    );
  }

  const processedProducts = products.map(product => {
    if (product.lowest_price !== undefined) {
      return { ...product, lowest_price: product.lowest_price, currency: product.currency || 'TRY' };
    }
    const variants = product.product_variants || [];
    const prices = variants.map(v => v.price);
    const lowest_price = prices.length > 0 ? Math.min(...prices) : undefined;
    const currency = variants.length > 0 ? variants[0].currency : 'TRY';
    return { ...product, lowest_price, currency };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {processedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
