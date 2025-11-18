'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProductCard from '@/components/product/ProductCard';

export default function TopUpsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const supabase = createClient();

  useEffect(() => {
    const fetchTopUps = async () => {
      setLoading(true);
      try {
        // Fetch products from top-ups category
        let query = supabase
          .from('products')
          .select(`
            id,
            title,
            slug,
            image_url,
            category_id,
            product_variants (
              price,
              currency
            )
          `)
          .eq('status', 'active')
          .ilike('title', '%top-up%')
          .limit(50);

        // Sort
        if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'title') {
          query = query.order('title', { ascending: true });
        }

        const { data, error } = await query;

        if (error) throw error;

        // Process products to add lowest price
        const processedProducts = (data || []).map((product) => {
          const variants = product.product_variants || [];
          const lowestPrice = variants.length > 0
            ? Math.min(...variants.map((v: any) => parseFloat(v.price)))
            : undefined;

          return {
            id: product.id,
            title: product.title,
            slug: product.slug,
            image_url: product.image_url,
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
        console.error('Error fetching top-ups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUps();
  }, [supabase, sortBy]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <Header />
      <main className="px-4 sm:px-10 lg:px-20 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium leading-normal" href="/">
              Home
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
            <span className="text-black dark:text-white text-sm font-medium leading-normal">Top-ups</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Top-ups
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                Recharge your gaming accounts instantly
              </p>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSortBy('popularity')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'popularity'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'newest'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('price_asc')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'price_asc'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }`}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => setSortBy('price_desc')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'price_desc'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }`}
            >
              Price: High to Low
            </button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              Loading top-ups...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              No top-ups found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  slug={product.slug}
                  imageUrl={product.image_url}
                  price={product.lowest_price}
                  currency={product.currency}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

