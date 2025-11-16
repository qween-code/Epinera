import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import ProductDetails from './ProductDetails';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image Gallery Placeholder */}
        <div className="bg-gray-800 rounded-lg h-96 flex items-center justify-center">
          <span className="text-gray-500">Product Image Gallery</span>
        </div>

        <ProductDetails product={product} />
      </div>
    </div>
  );
}
