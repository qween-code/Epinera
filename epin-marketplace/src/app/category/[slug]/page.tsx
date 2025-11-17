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

  // First, fetch the category to get its ID
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();

  if (categoryError || !category) {
    notFound();
  }

  // Then fetch products for this category using the category_id
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
    .eq('category_id', category.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (productsError) {
    console.error('Error fetching products for category:', productsError);
    return <p className="text-center text-red-500">Ürünler yüklenirken hata oluştu.</p>;
  }

  // Process products to add lowest price
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
    <div className="py-8">
      <div className="container mx-auto px-6">
        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{category.name}</span>
          </h1>
          <p className="text-gray-400">
            {processedProducts.length} ürün bulundu
          </p>
        </div>

        {/* Products Grid */}
        {processedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold mb-2">Bu kategoride henüz ürün yok</h2>
            <p className="text-gray-400 mb-8">Yakında yeni ürünler eklenecek</p>
            <a href="/" className="btn btn-primary">
              Ana Sayfaya Dön
            </a>
          </div>
        ) : (
          <ProductGrid products={processedProducts} />
        )}
      </div>
    </div>
  );
}
