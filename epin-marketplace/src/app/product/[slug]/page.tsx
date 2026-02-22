import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/cart/AddToCartButton';
import ReviewSection from '@/components/product/ReviewSection';
import Image from 'next/image';
import { PRODUCT_PLACEHOLDER } from '@/lib/constants/games';
import type { Metadata } from 'next';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('title, description, image_url')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!product) return { title: 'Urun Bulunamadi' };

  return {
    title: product.title,
    description: product.description || `${product.title} - Epinera Gaming Marketplace`,
    openGraph: {
      title: product.title,
      description: product.description || `${product.title} - Epinera Gaming Marketplace`,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      image_url,
      images,
      average_rating,
      review_count,
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

  const allImages = [
    product.image_url,
    ...(product.images || []),
  ].filter(Boolean) as string[];

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Product Image Gallery */}
          <div>
            <div className="neo rounded-2xl overflow-hidden relative h-80 md:h-[420px]">
              <Image
                src={allImages[0] || PRODUCT_PLACEHOLDER}
                alt={product.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />

              {/* HUD corners */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[var(--neon-cyan)] opacity-30" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[var(--neon-cyan)] opacity-30" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[var(--neon-cyan)] opacity-30" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[var(--neon-cyan)] opacity-30" />
            </div>

            {/* Thumbnail gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 flex-shrink-0 rounded-lg neo-sm overflow-hidden border border-[var(--border-dim)]">
                    <Image src={img} alt={`${product.title} ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)]" />
              <span className="terminal-label text-[0.6rem]">STOKTA</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading text-[var(--text-primary)] mb-4">{product.title}</h1>

            {/* Rating summary */}
            {product.average_rating && product.average_rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(product.average_rating!) ? 'text-[var(--neon-amber)]' : 'text-[var(--text-ghost)]'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-[var(--text-tertiary)]">
                  {product.average_rating.toFixed(1)} ({product.review_count || 0} degerlendirme)
                </span>
              </div>
            )}

            <p className="text-[var(--text-tertiary)] mb-8 leading-relaxed">
              {product.description || 'Aciklama henuz eklenmedi.'}
            </p>

            <div className="divider" />

            <div className="mt-6">
              <h2 className="terminal-label mb-4">// BIR SECENEK SECIN</h2>
              <div className="space-y-3">
                {product.product_variants.map((variant: any) => (
                  <div
                    key={variant.id}
                    className="neo-flat rounded-xl p-4 flex justify-between items-center hover:border-[var(--border-medium)] transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{variant.name}</h3>
                      <p className="text-xs text-[var(--text-ghost)] font-mono-accent mt-1">
                        Stok: {variant.stock_quantity > 0 ? (
                          <span className="text-[var(--neon-green)]">{variant.stock_quantity}</span>
                        ) : (
                          <span className="text-[var(--neon-red)]">Tukendi</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-xl font-bold text-neon-cyan stat-number">
                        {parseFloat(variant.price).toFixed(2)}
                        <span className="text-xs ml-1 text-[var(--text-tertiary)] font-normal">{variant.currency}</span>
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

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewSection productId={product.id} />
        </div>
      </div>
    </div>
  );
}
