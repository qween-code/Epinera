import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const supabase = createClient();

  // Fetch the product and its variants based on the slug
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      product_variants (
        id,
        name,
        price,
        currency,
        stock_quantity
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image Gallery Placeholder */}
        <div className="bg-gray-800 rounded-lg h-96 flex items-center justify-center">
          <span className="text-gray-500">Product Image Gallery</span>
        </div>

        {/* Product Details and Variants */}
        <div>
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-gray-400 mt-4">{product.description || 'No description available.'}</p>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Select an option:</h2>
            <div className="space-y-4">
              {product.product_variants.map((variant) => (
                <div key={variant.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{variant.name}</h3>
                    <p className="text-xs text-gray-500">Stock: {variant.stock_quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-sky-400">
                      {variant.price.toFixed(2)} {variant.currency}
                    </p>
                    <button className="mt-1 px-6 py-2 bg-sky-600 rounded-md text-sm font-semibold hover:bg-sky-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
