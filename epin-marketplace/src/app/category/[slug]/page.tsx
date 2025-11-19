import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CategoryFilters from '@/components/product/CategoryFilters';
import ProductCard from '@/components/ui/ProductCard';
import CategoryPageHeader from '@/components/product/CategoryPageHeader';

type CategoryPageProps = {
  params: {
    slug: string;
  };
  searchParams: {
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
  };
};

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;
  const supabase = await createClient();

  // Fetch the category
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id, parent:categories!parent_id(id, name, slug)')
    .eq('slug', slug)
    .single();

  if (categoryError || !category) {
    notFound();
  }

  // Fetch subcategories for filter
  const { data: subcategories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('parent_id', category.id)
    .order('name');

  // Build query (without image_url to avoid column error)
  let query = supabase
    .from('products')
    .select(`
      id,
      slug,
      title,
      status,
      seller_id,
      product_variants (
        id,
        name,
        price,
        currency
      ),
      profiles!seller_id (
        full_name,
        avatar_url
      )
    `)
    .eq('category_id', category.id)
    .eq('status', 'active');

  // Apply filters
  if (searchParams.minPrice) {
    query = query.gte('product_variants.price', searchParams.minPrice);
  }
  if (searchParams.maxPrice) {
    query = query.lte('product_variants.price', searchParams.maxPrice);
  }

  const { data: products, error: productsError } = await query.order('created_at', { ascending: false });

  if (productsError) {
    console.error('Error fetching products for category:', productsError);
  }

  // Try to get image_url separately if column exists
  let imageMap = new Map<string, string | null>();
  if (products && products.length > 0) {
    try {
      const { data: productsWithImages } = await supabase
        .from('products')
        .select('id, image_url')
        .in('id', products.map(p => p.id));
      
      (productsWithImages || []).forEach(p => {
        imageMap.set(p.id, p.image_url || null);
      });
    } catch (error: any) {
      // image_url column doesn't exist, continue without images
      if (error?.code !== '42703') {
        console.error('Error fetching image_url:', error);
      }
    }
  }

  // Process products
  const processedProducts = (products || []).map((product: any) => {
    const variants = product.product_variants || [];
    const lowestPrice = variants.length > 0
      ? Math.min(...variants.map((v: any) => parseFloat(v.price)))
      : undefined;
    const currency = variants[0]?.currency || 'USD';

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      image_url: imageMap.get(product.id) || 'https://via.placeholder.com/300',
      lowest_price: lowestPrice,
      currency,
      seller: {
        name: product.profiles?.full_name || 'Unknown Seller',
        rating: 4.8, // TODO: Fetch from reviews
      },
    };
  });

  // Sort products
  let sortedProducts = [...processedProducts];
  if (searchParams.sort === 'price_asc') {
    sortedProducts.sort((a, b) => (a.lowest_price || 0) - (b.lowest_price || 0));
  } else if (searchParams.sort === 'price_desc') {
    sortedProducts.sort((a, b) => (b.lowest_price || 0) - (a.lowest_price || 0));
  } else if (searchParams.sort === 'newest') {
    sortedProducts.sort((a, b) => (b as any).created_at?.localeCompare((a as any).created_at) || 0);
  }

  // Build breadcrumbs
  const parentCategory = Array.isArray(category.parent) ? category.parent[0] : category.parent;
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(parentCategory ? [{ label: parentCategory.name, href: `/category/${parentCategory.slug}` }] : []),
    { label: category.name },
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
  ];

  return (
    <div className="relative flex w-full flex-col bg-background-light dark:bg-background-dark font-display text-[#EAEAEA]">
      <CategoryPageHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 xl:w-1/5">
            <CategoryFilters categories={subcategories || []} />
          </aside>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-col gap-6">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap gap-2">
                {breadcrumbs.map((crumb, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="text-white/60 hover:text-white text-sm font-medium leading-normal transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-white text-sm font-medium leading-normal">{crumb.label}</span>
                    )}
                    {idx < breadcrumbs.length - 1 && (
                      <span className="text-white/60 text-sm font-medium leading-normal">/</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Page Heading */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                  {category.name}
                </h1>
                <p className="text-white/70 text-sm">
                  Showing 1-{Math.min(12, sortedProducts.length)} of {sortedProducts.length} results
                </p>
              </div>

              {/* Sorting Chips */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-white/80 text-sm font-medium">Sort by:</span>
                {sortOptions.map((option) => {
                  const isActive = searchParams.sort === option.value || (!searchParams.sort && option.value === 'popularity');
                  return (
                    <Link
                      key={option.value}
                      href={`/category/${slug}?sort=${option.value}`}
                      className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>

              {/* Product Grid */}
              {sortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🎮</div>
                  <h2 className="text-2xl font-bold mb-2 text-white">No products found</h2>
                  <p className="text-white/70 mb-8">Try adjusting your filters</p>
                  <Link href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                    Back to Home
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group relative flex flex-col overflow-hidden rounded-xl bg-white/5 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10"
                    >
                      <div className="aspect-square w-full overflow-hidden">
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundImage: `url(${product.image_url})` }}
                        ></div>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="font-bold text-white">{product.title}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm text-white/70">{product.seller.name}</p>
                          <div className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined !text-[16px] text-yellow-400">star</span>
                            <span className="text-xs font-medium text-white/90">{product.seller.rating}</span>
                          </div>
                        </div>
                        <p className="mt-4 text-xl font-bold text-primary">
                          ${product.lowest_price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-primary text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
