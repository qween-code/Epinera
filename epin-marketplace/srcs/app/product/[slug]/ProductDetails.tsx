'use client';

import useCartStore from '@/store/cart';

export default function ProductDetails({ product }: { product: any }) {
  const { addItem } = useCartStore();

  return (
    <div>
      <h1 className="text-4xl font-bold">{product.title}</h1>
      <p className="text-gray-400 mt-4">{product.description || 'No description available.'}</p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Select an option:</h2>
        <div className="space-y-4">
          {product.product_variants.map((variant: any) => (
            <div key={variant.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{variant.name}</h3>
                <p className="text-xs text-gray-500">Stock: {variant.stock_quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-sky-400">
                  {variant.price.toFixed(2)} {variant.currency}
                </p>
                <button onClick={() => addItem(variant.id)} className="mt-1 px-6 py-2 bg-sky-600 rounded-md text-sm font-semibold hover:bg-sky-700">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
