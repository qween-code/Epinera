import CategoryCarousel from '@/components/ui/CategoryCarousel';
import ProductGrid from '@/components/ui/ProductGrid';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('name, slug');

  if (error) {
    console.error('Error fetching categories:', error);
    // You might want to render an error state here
  }

  return (
    <div>
      {/* Search Bar section can be added here later */}
      <section>
        <h1 className="text-3xl font-bold mb-2">Welcome to the Marketplace!</h1>
        <p className="text-gray-400">Find the best deals for your favorite games.</p>
      </section>

      <section className="mt-8">
        {/* Pass the fetched categories to the component */}
        <CategoryCarousel categories={categories || []} />
      </section>

      <section className="mt-8">
        <ProductGrid />
      </section>

      {/* Other sections like "Flash Deals", "For You", "Community" can be added here */}
    </div>
  );
}
