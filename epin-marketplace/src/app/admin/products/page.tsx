import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

async function updateProductStatus(formData: FormData) {
  'use server';
  const supabase = await createClient();
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  await supabase.from('products').update({ status }).eq('id', id);
  revalidatePath('/admin/products');
}

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select(`
      id, title, slug, status, created_at, image_url,
      profiles!inner(id, full_name),
      product_variants(id, name, price, stock_quantity)
    `)
    .order('created_at', { ascending: false });

  const statusBadge: Record<string, string> = {
    active: 'badge-green', draft: 'badge-ghost', inactive: 'badge-red',
  };

  return (
    <div>
      <h1 className="text-2xl font-heading mb-8"><span className="text-gradient">Ürün Moderasyonu</span></h1>

      <div className="space-y-3">
        {(products || []).map((product: any) => {
          const totalStock = product.product_variants?.reduce((s: number, v: any) => s + (v.stock_quantity || 0), 0) || 0;
          return (
            <div key={product.id} className="neo-flat rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[var(--text-primary)]">{product.title}</h3>
                    <span className={`badge ${statusBadge[product.status] || 'badge-ghost'}`}>{product.status}</span>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Satıcı: {product.profiles?.full_name || 'Bilinmiyor'} &middot;
                    {product.product_variants?.length || 0} varyant &middot;
                    Stok: <span className="stat-number">{totalStock}</span>
                  </p>
                  <p className="text-[0.65rem] text-[var(--text-ghost)] font-mono-accent mt-0.5">
                    {new Date(product.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Link href={`/product/${product.slug}`} target="_blank" className="btn btn-sm btn-ghost">Önizle</Link>
                  {product.status !== 'active' && (
                    <form action={updateProductStatus}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="status" value="active" />
                      <button type="submit" className="btn btn-sm btn-success">Onayla</button>
                    </form>
                  )}
                  {product.status === 'active' && (
                    <form action={updateProductStatus}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="status" value="inactive" />
                      <button type="submit" className="btn btn-sm btn-danger">Deaktif</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {(!products || products.length === 0) && (
          <div className="neo rounded-2xl p-14 text-center">
            <h2 className="text-xl font-heading mb-2">Henüz Ürün Yok</h2>
          </div>
        )}
      </div>
    </div>
  );
}
