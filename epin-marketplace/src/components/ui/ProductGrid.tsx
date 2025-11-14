import ProductCard from './ProductCard';

// A simple placeholder for the product grid component.
// It will be populated with dynamic data in a later step.

export default function ProductGrid() {
  const products = [
    { id: 1, title: 'Valorant VP', seller: 'GameStore', price: '100', currency: 'TRY' },
    { id: 2, title: 'LoL RP', seller: 'EpinShop', price: '50', currency: 'TRY' },
    { id: 3, title: 'WoW Gold', seller: 'GoldKing', price: '250', currency: 'TRY' },
    { id: 4, title: 'PUBG UC', seller: 'FastUC', price: '75', currency: 'TRY' },
  ];

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
