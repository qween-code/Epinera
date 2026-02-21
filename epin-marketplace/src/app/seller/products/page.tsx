import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SellerProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/seller/products');

  const { data: products } = await supabase
    .from('products')
    .select(`id, title, slug, status, created_at, product_variants (id, name, price, currency, stock_quantity, status)`)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  const statusBadge: Record<string, string> = {
    active: 'badge-green',
    draft: 'badge-ghost',
    inactive: 'badge-red',
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-heading"><span className="text-gradient">Urunlerim</span></h1>
          <Link href="/seller/products/new" className="btn btn-success">+ Yeni Urun Ekle</Link>
        </div>

        {!products || products.length === 0 ? (
          <div className="neo rounded-2xl p-14 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neo-inset flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--text-ghost)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-heading mb-2">Henuz Urununuz Yok</h2>
            <p className="text-sm text-[var(--text-tertiary)] mb-6">Ilk urununuzu ekleyerek satisa baslayin</p>
            <Link href="/seller/products/new" className="btn btn-success">Urun Ekle</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const variantCount = product.product_variants?.length || 0;
              const activeVariants = product.product_variants?.filter((v: any) => v.status === 'active').length || 0;
              const totalStock = product.product_variants?.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) || 0;

              return (
                <div key={product.id} className="neo-flat rounded-xl p-5 hover:border-[var(--border-medium)] transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[var(--text-primary)]">{product.title}</h3>
                        <span className={`badge ${statusBadge[product.status] || 'badge-ghost'}`}>
                          {product.status === 'active' ? 'Aktif' : product.status === 'draft' ? 'Taslak' : 'Pasif'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        {variantCount} varyant ({activeVariants} aktif) &middot; Toplam stok: <span className="stat-number">{totalStock}</span>
                      </p>
                      <p className="text-[0.65rem] text-[var(--text-ghost)] mt-0.5 font-mono-accent">
                        {new Date(product.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/product/${product.slug}`} target="_blank" className="btn btn-sm btn-ghost">Onizle</Link>
                      <Link href={`/seller/products/${product.id}/edit`} className="btn btn-sm btn-primary">Duzenle</Link>
                    </div>
                  </div>
                  {product.product_variants && product.product_variants.length > 0 && (
                    <div className="mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {product.product_variants.map((variant: any) => (
                          <div key={variant.id} className="neo-inset-sm rounded-lg p-3">
                            <div className="text-sm font-medium text-[var(--text-primary)]">{variant.name}</div>
                            <div className="text-xs text-[var(--neon-cyan)] stat-number">{parseFloat(variant.price).toFixed(2)} {variant.currency}</div>
                            <div className="text-[0.65rem] text-[var(--text-ghost)]">Stok: {variant.stock_quantity}</div>
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
