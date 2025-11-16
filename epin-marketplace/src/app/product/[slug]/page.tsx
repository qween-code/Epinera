import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/cart/AddToCartButton';
import Link from 'next/link';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const supabase = createClient();

  // Fetch the product, its variants, and seller info based on the slug
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      seller:profiles (
        full_name,
        avatar_url
      ),
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

  // Type assertion for seller to avoid TS errors
  const seller = product.seller as { full_name: string; avatar_url: string } | null;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Media Gallery */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="w-full bg-gray-800 rounded-xl aspect-video flex items-center justify-center">
            <span className="text-gray-500 text-3xl">🎮</span>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                <span className="text-gray-600 text-xs">Thumb</span>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Info */}
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em]">{product.title}</h1>

            {/* Seller Information */}
            <div className="p-6 bg-gray-800/50 rounded-xl">
                <h3 className="text-lg font-bold mb-4">Satıcı Bilgileri</h3>
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" style={{backgroundImage: `url(${seller?.avatar_url || ''})`}}></div>
                    <div>
                        <p className="font-bold">{seller?.full_name || 'Anonymous Seller'}</p>
                        <a className="text-primary text-sm hover:underline" href="#">Mağazayı Görüntüle</a>
                    </div>
                </div>
            </div>

            <p className="text-gray-400 mt-4">{product.description || 'Açıklama henüz eklenmedi.'}</p>

            {/* Product Variants */}
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
