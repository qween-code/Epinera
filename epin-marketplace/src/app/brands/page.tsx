'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        // Fetch brands from categories or create a brands table
        // For now, we'll use categories as brands
        const { data: categories, error } = await supabase
          .from('categories')
          .select('id, name, slug, description')
          .is('parent_id', null)
          .order('name', { ascending: true });

        if (error) throw error;

        // Map categories to brands format
        const brandsData = (categories || []).map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&size=128&background=0ba3ea&color=fff`,
          productCount: 0, // Will be fetched separately
        }));

        // Fetch product counts for each brand
        for (const brand of brandsData) {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', brand.id)
            .eq('status', 'active');
          brand.productCount = count || 0;
        }

        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [supabase]);

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
            <span className="text-black dark:text-white text-sm font-medium leading-normal">Brands</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Brands
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                Discover products from your favorite brands
              </p>
            </div>
          </div>

          {/* Brands Grid */}
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              Loading brands...
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              No brands found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/category/${brand.slug}`}
                  className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-6 hover:border-primary transition-colors"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div
                      className="size-24 rounded-lg bg-center bg-no-repeat bg-cover"
                      style={{ backgroundImage: `url('${brand.logo}')` }}
                    />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-black dark:text-white text-lg font-bold leading-tight">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">
                          {brand.description}
                        </p>
                      )}
                      <p className="text-primary text-sm font-medium leading-normal mt-2">
                        {brand.productCount} {brand.productCount === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

