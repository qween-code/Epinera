// A simple placeholder for the product card component.
// It will display a single product's information.

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-sky-500/50 transition-shadow">
      <div className="h-48 bg-gray-700 flex items-center justify-center">
        <span className="text-gray-500">Product Image</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">{product.title}</h3>
        <p className="text-sm text-gray-400 mt-1">Seller: {product.seller}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-sky-400">{product.price} {product.currency}</p>
          <button className="px-4 py-2 bg-sky-600 rounded-md text-sm font-semibold hover:bg-sky-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
