import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SellerProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/seller/products');
  }

  // Fetch seller's products
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      slug,
      status,
      created_at,
      product_variants (
        id,
        name,
        price,
        currency,
        stock_quantity,
        status
      )
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ürünlerim</h1>
          <Link
            href="/seller/products/new"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            + Yeni Ürün Ekle
          </Link>
        </div>

        {!products || products.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">Henüz Ürününüz Yok</h2>
            <p className="text-gray-400 mb-6">İlk ürününüzü ekleyerek satışa başlayın</p>
            <Link
              href="/seller/products/new"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Ürün Ekle
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const variantCount = product.product_variants?.length || 0;
              const activeVariants = product.product_variants?.filter((v: any) => v.status === 'active').length || 0;
              const totalStock = product.product_variants?.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) || 0;

              return (
                <div
                  key={product.id}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{product.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.status === 'active' ? 'bg-green-900 text-green-300' :
                          product.status === 'draft' ? 'bg-gray-700 text-gray-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {product.status === 'active' && 'Aktif'}
                          {product.status === 'draft' && 'Taslak'}
                          {product.status === 'inactive' && 'Pasif'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {variantCount} varyant ({activeVariants} aktif) • Toplam stok: {totalStock}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Oluşturulma: {new Date(product.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                      >
                        Önizle
                      </Link>
                      <Link
                        href={`/seller/products/${product.id}/edit`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                      >
                        Düzenle
                      </Link>
                    </div>
                  </div>

                  {/* Variants */}
                  {product.product_variants && product.product_variants.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-sm font-semibold text-gray-400 mb-2">Varyantlar:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {product.product_variants.map((variant: any) => (
                          <div
                            key={variant.id}
                            className="bg-gray-700 rounded p-3 text-sm"
                          >
                            <div className="font-medium">{variant.name}</div>
                            <div className="text-gray-400">
                              {parseFloat(variant.price).toFixed(2)} {variant.currency}
                            </div>
                            <div className="text-xs text-gray-500">
                              Stok: {variant.stock_quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
