import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/cart/AddToCartButton';
import Image from 'next/image';
import { PRODUCT_PLACEHOLDER } from '@/lib/constants/games';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const supabase = await createClient();

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
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="neo rounded-2xl overflow-hidden relative h-80 md:h-[420px]">
            <Image
              src={PRODUCT_PLACEHOLDER}
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

          {/* Product Details */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)]" />
              <span className="terminal-label text-[0.6rem]">STOKTA</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading text-[var(--text-primary)] mb-4">{product.title}</h1>
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
      </div>
    </div>
  );
}
