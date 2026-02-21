import { createClient } from '@/lib/supabase/server';
import HeroBanner from '@/components/home/HeroBanner';
import GameCategories from '@/components/home/GameCategories';
import ProductGrid from '@/components/ui/ProductGrid';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      title,
      image_url,
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

  const processedProducts = (products || []).map((product: any) => {
    const variants = product.product_variants || [];
    const lowestPrice = variants.length > 0
      ? Math.min(...variants.map((v: any) => parseFloat(v.price)))
      : undefined;

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      image_url: product.image_url,
      lowest_price: lowestPrice,
      currency: variants[0]?.currency || 'TRY',
    };
  });

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Banner */}
      <section className="container mx-auto px-6 pt-6">
        <HeroBanner />
      </section>

      {/* Game Categories */}
      <section>
        <GameCategories />
      </section>

      {/* Featured Products */}
      {processedProducts.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]">
                <span className="terminal-label text-[0.6rem]">// ONE CIKAN URUNLER</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading">
                <span className="text-gradient">Populer Urunler</span>
              </h2>
            </div>
            <Link
              href="/search"
              className="btn btn-sm btn-secondary group"
            >
              Tumunu Gor
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <ProductGrid products={processedProducts} />
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-6">
        <div className="neo rounded-2xl p-10 md:p-14 gradient-mesh">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              color="cyan"
              title="Anlik Teslimat"
              description="Odeme sonrasi otomatik teslimat sistemi ile saniyeler icinde urunun elinde"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              color="green"
              title="Guvenli Alisveris"
              description="SSL sertifikali guvenli odeme alt yapisi ve 7/24 musteri destegi"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="amber"
              title="En Iyi Fiyatlar"
              description="Piyasanin en uygun fiyatlari ve ozel kampanyalarla kazancin cebinde"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl neo p-10 md:p-14 text-center">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,240,255,0.04)] via-transparent to-[rgba(184,41,255,0.04)]" />

          {/* HUD corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[var(--neon-cyan)] opacity-25" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--neon-magenta)] opacity-25" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--neon-magenta)] opacity-25" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[var(--neon-cyan)] opacity-25" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]">
              <span className="terminal-label text-[0.6rem]">// SATICI OL</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading mb-4">
              <span className="text-gradient-cyber">Satici Olmak Ister misin?</span>
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
              Kendi urunlerini sat, binlerce oyuncuya ulas ve kazanmaya basla
            </p>
            <Link href="/seller/dashboard" className="btn btn-filled btn-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Satici Olmaya Basla
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, color, title, description }: {
  icon: React.ReactNode;
  color: 'cyan' | 'green' | 'amber';
  title: string;
  description: string;
}) {
  const colorMap = {
    cyan: { bg: 'rgba(0, 240, 255, 0.08)', border: 'rgba(0, 240, 255, 0.2)', text: 'var(--neon-cyan)' },
    green: { bg: 'rgba(57, 255, 20, 0.08)', border: 'rgba(57, 255, 20, 0.2)', text: 'var(--neon-green)' },
    amber: { bg: 'rgba(255, 184, 0, 0.08)', border: 'rgba(255, 184, 0, 0.2)', text: 'var(--neon-amber)' },
  };

  const c = colorMap[color];

  return (
    <div className="text-center">
      <div
        className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
        style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{title}</h3>
      <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">{description}</p>
    </div>
  );
}
