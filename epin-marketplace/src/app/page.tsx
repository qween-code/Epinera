import { createClient } from '@/lib/supabase/server';
import HeroBanner from '@/components/home/HeroBanner';
import GameCategories from '@/components/home/GameCategories';
import ProductGrid from '@/components/ui/ProductGrid';

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured products (8 most recent active products)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      title,
      product_variants (
        price,
        currency
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(8);

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  // Process products to add lowest price
  const processedProducts = (products || []).map((product: any) => {
    const variants = product.product_variants || [];
    const lowestPrice = variants.length > 0
      ? Math.min(...variants.map((v: any) => parseFloat(v.price)))
      : undefined;

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      lowest_price: lowestPrice,
      currency: variants[0]?.currency || 'TRY',
    };
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="-mt-4">
        <HeroBanner />
      </section>

      {/* Game Categories */}
      <section>
        <GameCategories />
      </section>

      {/* Featured Products */}
      {processedProducts.length > 0 && (
        <section>
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="text-gradient">Öne Çıkan Ürünler</span>
                </h2>
                <p className="text-gray-400">En yeni ve popüler ürünler</p>
              </div>
              <a
                href="/search"
                className="text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-2 group"
              >
                <span>Tümünü Gör</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <ProductGrid products={processedProducts} />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-gradient-to-r from-primary-900/20 to-secondary-900/20 rounded-3xl p-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Anlık Teslimat</h3>
              <p className="text-gray-400">
                Ödeme sonrası otomatik teslimat sistemi ile saniyeler içinde ürününüz elinizde
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-success-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Güvenli Alışveriş</h3>
              <p className="text-gray-400">
                SSL sertifikalı güvenli ödeme alt yapısı ve 7/24 müşteri desteği
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">En İyi Fiyatlar</h3>
              <p className="text-gray-400">
                Piyasanın en uygun fiyatları ve özel kampanyalarla kazancınız cebinizde
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="container mx-auto px-6">
          <div className="gradient-gaming rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Satıcı Olmak İster misin?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Kendi ürünlerini sat, binlerce oyuncuya ulaş ve kazanmaya başla
            </p>
            <a
              href="/seller/dashboard"
              className="btn btn-lg inline-flex items-center gap-2"
              style={{ background: 'white', color: 'var(--primary-600)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Satıcı Olmaya Başla
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
