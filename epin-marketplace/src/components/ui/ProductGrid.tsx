import ProductCard from './ProductCard';

// Updated ProductGrid to accept a list of products as a prop.
// This makes it a reusable component for displaying products in a grid layout.

type Product = {
  id: string;
  slug: string;
  title: string;
  product_variants: { price: number, currency: string }[];
};

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <p className="text-gray-400">Bu kategoride gösterilecek ürün bulunmuyor.</p>;
  }

  // Data transformation: Find the lowest price for each product from its variants.
  // In a real-world scenario, this might be better done in the database query itself.
  const productsWithLowestPrice = products.map(product => {
    const prices = product.product_variants.map(v => v.price);
    const lowest_price = prices.length > 0 ? Math.min(...prices) : undefined;
    const currency = product.product_variants.length > 0 ? product.product_variants[0].currency : 'TRY';
    return { ...product, lowest_price, currency };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productsWithLowestPrice.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
