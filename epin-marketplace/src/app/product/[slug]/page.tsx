import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/cart/AddToCartButton';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const supabase = await createClient();

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
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image Gallery Placeholder */}
        <div className="bg-gray-800 rounded-lg h-96 flex items-center justify-center">
          <span className="text-6xl">🎮</span>
        </div>

        {/* Product Details and Variants */}
        <div>
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-gray-400 mt-4">{product.description || 'Açıklama henüz eklenmedi.'}</p>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Bir seçenek seçin:</h2>
            <div className="space-y-4">
              {product.product_variants.map((variant: any) => (
                <div key={variant.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-750 transition-colors">
                  <div>
                    <h3 className="text-lg font-medium">{variant.name}</h3>
                    <p className="text-xs text-gray-500">
                      Stok: {variant.stock_quantity > 0 ? variant.stock_quantity : 'Tükendi'}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-2xl font-bold text-blue-400">
                      {parseFloat(variant.price).toFixed(2)} {variant.currency}
                    </p>
                    <AddToCartButton
                      variantId={variant.id}
                      variantName={variant.name}
                      stockQuantity={variant.stock_quantity}
                    />
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
