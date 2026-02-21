import ProductGrid from '@/components/ui/ProductGrid';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

type CategoryPageProps = {
  params: { slug: string };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();

  if (!category) notFound();

  const { data: products } = await supabase
    .from('products')
    .select(`id, slug, title, product_variants (price, currency)`)
    .eq('category_id', category.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

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
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]">
          <span className="terminal-label text-[0.6rem]">// KATEGORI</span>
        </div>
        <h1 className="text-3xl font-heading">
          <span className="text-gradient">{category.name}</span>
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-2">{processedProducts.length} urun bulundu</p>
      </div>

      {processedProducts.length === 0 ? (
        <div className="neo rounded-2xl p-14 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neo-inset flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--text-ghost)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-xl font-heading mb-2">Henuz urun yok</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Bu kategoride henuz urun bulunmuyor</p>
        </div>
      ) : (
        <ProductGrid products={processedProducts} />
      )}
    </div>
  );
}
