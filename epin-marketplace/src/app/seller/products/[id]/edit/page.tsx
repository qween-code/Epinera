import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProductEditForm from '@/components/seller/ProductEditForm';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/seller/products');
  }

  // Fetch product with variants
  const { data: product, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_variants (*)
    `
    )
    .eq('id', params.id)
    .single();

  if (error || !product) {
    redirect('/seller/products?error=not-found');
  }

  // Verify ownership
  if (product.seller_id !== user.id) {
    redirect('/seller/products?error=unauthorized');
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <ProductEditForm
      product={product}
      variants={product.product_variants}
      categories={categories || []}
    />
  );
}
