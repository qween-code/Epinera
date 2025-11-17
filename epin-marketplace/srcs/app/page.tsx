import CategoryCarousel from '@/components/ui/CategoryCarousel';
import ProductGrid from '@/components/ui/ProductGrid';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('name, slug');

  // Fetch featured products (e.g., the 8 most recent)
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

  if (categoriesError || productsError) {
    console.error('Error fetching homepage data:', categoriesError || productsError);
    // Optionally render an error state
  }

  return (
    <div>
      <section>
        <h1 className="text-3xl font-bold mb-2">Welcome to the Marketplace!</h1>
        <p className="text-gray-400">Find the best deals for your favorite games.</p>
      </section>

      <section className="mt-8">
        <CategoryCarousel categories={categories || []} />
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <ProductGrid products={products || []} />
      </section>
    </div>
  );
}
