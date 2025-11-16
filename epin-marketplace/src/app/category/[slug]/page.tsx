import ProductGrid from '@/components/ui/ProductGrid';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const supabase = await createClient();

  // Fetch the category details
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single();

  if (categoryError || !category) {
    notFound();
  }

  // Fetch products and their variants for the given category
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      title,
      categories!inner(slug),
      product_variants (
        price,
        currency
      )
    `)
    .eq('categories.slug', slug)
    .eq('status', 'active'); // Only show active products


  if (productsError) {
    console.error('Error fetching products for category:', productsError);
    return <p>Error loading products.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Category: {category.name}</h1>
      {/* The updated ProductGrid now receives products with their variants */}
      <ProductGrid products={products} />
    </div>
  );
}
