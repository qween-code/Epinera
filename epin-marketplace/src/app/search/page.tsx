'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import CategoryPageHeader from '@/components/product/CategoryPageHeader';
import CategoryFilters from '@/components/product/CategoryFilters';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    searchProducts();
  }, [query, selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug')
      .is('parent_id', null);

    if (data) {
      setCategories(data);
    }
  };

  const searchProducts = async () => {
    setLoading(true);

    try {
      let queryBuilder = supabase
        .from('products')
        .select(`
          id,
          title,
          slug,
          category_id,
          product_variants (
            price,
            currency
          )
        `)
        .eq('status', 'active');

      // Search by title
      if (query) {
        queryBuilder = queryBuilder.ilike('title', `%${query}%`);
      }

      // Filter by category
      if (selectedCategory) {
        queryBuilder = queryBuilder.eq('category_id', selectedCategory);
      }

      // Sort
      if (sortBy === 'newest') {
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
      } else if (sortBy === 'title') {
        queryBuilder = queryBuilder.order('title', { ascending: true });
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      // Try to get image_url separately if column exists
      const imageMap = new Map<string, string | null>();
      if (data && data.length > 0) {
        try {
          const { data: productsWithImages } = await supabase
            .from('products')
            .select('id, image_url')
            .in('id', data.map(p => p.id));
          
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

      // Process products to add lowest price
      const processedProducts = (data || []).map((product: any) => {
        const variants = product.product_variants || [];
        const lowestPrice = variants.length > 0
          ? Math.min(...variants.map((v: any) => parseFloat(v.price)))
          : undefined;

        return {
          id: product.id,
          title: product.title,
          slug: product.slug,
          image_url: imageMap.get(product.id) || null,
          lowest_price: lowestPrice,
          currency: variants[0]?.currency || 'TRY',
        };
      });

      // Sort by price if selected
      if (sortBy === 'price_asc') {
        processedProducts.sort((a, b) => (a.lowest_price || 0) - (b.lowest_price || 0));
      } else if (sortBy === 'price_desc') {
        processedProducts.sort((a, b) => (b.lowest_price || 0) - (a.lowest_price || 0));
      }

      setProducts(processedProducts);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts();
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative flex w-full flex-col bg-background-light dark:bg-background-dark font-display text-[#EAEAEA]">
      <CategoryPageHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 xl:w-1/5">
            <CategoryFilters categories={categories} />
          </aside>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-col gap-6">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="text-white/60 hover:text-white text-sm font-medium leading-normal transition-colors"
                >
                  Home
                </Link>
                <span className="text-white/60 text-sm font-medium leading-normal">/</span>
                <span className="text-white text-sm font-medium leading-normal">
                  {query ? `Search: "${query}"` : 'Search Results'}
                </span>
              </div>

              {/* Page Heading */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                  {query ? `Search: "${query}"` : 'Search Results'}
                </h1>
                <p className="text-white/70 text-sm">
                  {loading ? 'Searching...' : `Showing 1-${Math.min(12, products.length)} of ${products.length} results`}
                </p>
              </div>

              {/* Sorting Chips */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-white/80 text-sm font-medium">Sort by:</span>
                {[
                  { value: 'popularity', label: 'Popularity' },
                  { value: 'price_asc', label: 'Price: Low to High' },
                  { value: 'price_desc', label: 'Price: High to Low' },
                  { value: 'newest', label: 'Newest' },
                ].map((option) => {
                  const isActive = sortBy === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="text-white/50">Searching...</div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-2xl font-bold mb-2 text-white">No results found</h2>
                  <p className="text-white/70 mb-8">
                    {query ? `No products found for "${query}"` : 'Start searching to discover products'}
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group relative flex flex-col overflow-hidden rounded-xl bg-white/5 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10"
                    >
                      <div className="aspect-square w-full overflow-hidden">
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${product.image_url || 'https://via.placeholder.com/300'})`,
                          }}
                        ></div>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="font-bold text-white">{product.title}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm text-white/70">Seller</p>
                          <div className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined !text-[16px] text-yellow-400">star</span>
                            <span className="text-xs font-medium text-white/90">4.8</span>
                          </div>
                        </div>
                        <p className="mt-4 text-xl font-bold text-primary">
                          ${product.lowest_price?.toFixed(2) || '0.00'} {product.currency || 'USD'}
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
