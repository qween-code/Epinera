'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Header from '@/components/layout/Header';

interface Product {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  description?: string;
  price: number;
  currency: string;
  seller?: {
    name: string;
    rating: number;
  };
  platform?: string;
  deliveryTime?: string;
  features?: string[];
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = searchParams.get('ids')?.split(',') || [];
      if (productIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            title,
            slug,
            image_url,
            description,
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
          .in('id', productIds)
          .eq('status', 'active');

        if (error) throw error;

        const processedProducts = (data || []).map((product: any) => {
          const variant = product.product_variants?.[0];
          return {
            id: product.id,
            title: product.title,
            slug: product.slug,
            image_url: product.image_url || 'https://via.placeholder.com/300',
            description: product.description,
            price: variant ? parseFloat(variant.price) : 0,
            currency: variant?.currency || 'USD',
            seller: {
              name: product.profiles?.full_name || 'Unknown Seller',
              rating: 4.8, // TODO: Fetch from reviews
            },
            platform: 'PC', // TODO: Get from product data
            deliveryTime: 'Instant',
            features: [], // TODO: Get from product attributes
          };
        });

        setProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const removeProduct = (productId: string) => {
    const newProducts = products.filter((p) => p.id !== productId);
    setProducts(newProducts);
    const ids = newProducts.map((p) => p.id).join(',');
    router.push(`/compare${ids ? `?ids=${ids}` : ''}`);
  };

  const addProduct = () => {
    // TODO: Implement product search/selection modal
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
        <Header />
        <main className="px-4 sm:px-10 lg:px-20 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
        <Header />
        <main className="px-4 sm:px-10 lg:px-20 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">No products to compare</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Add products to compare their features</p>
              <Link href="/products" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Browse Products
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const comparisonFields = [
    { key: 'price', label: 'Price' },
    { key: 'platform', label: 'Platform' },
    { key: 'seller', label: 'Seller' },
    { key: 'rating', label: 'Seller Rating' },
    { key: 'deliveryTime', label: 'Delivery Time' },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
      <Header />
      <main className="px-4 sm:px-10 lg:px-20 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Link className="text-gray-500 dark:text-gray-400 hover:text-primary text-base font-medium leading-normal" href="/">
              Home
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-base font-medium leading-normal">/</span>
            <Link className="text-gray-500 dark:text-gray-400 hover:text-primary text-base font-medium leading-normal" href="/search">
              Search Results
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-base font-medium leading-normal">/</span>
            <span className="text-black dark:text-white text-base font-medium leading-normal">Compare Products</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              Compare Products
            </h1>
          </div>

          {/* Highlight Differences Toggle */}
          <div className="mb-6 @container">
            <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-lg border border-gray-200 dark:border-white/10 bg-white/30 dark:bg-white/5 p-5 @[480px]:flex-row @[480px]:items-center">
              <div className="flex flex-col gap-1">
                <p className="text-black dark:text-white text-base font-bold leading-tight">Highlight Differences</p>
                <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                  Visually emphasize the rows where the product attributes are different.
                </p>
              </div>
              <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-gray-200 dark:bg-white/10 p-0.5 has-[:checked]:justify-end has-[:checked]:bg-primary">
                <div className="h-full w-[27px] rounded-full bg-white" style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px' }}></div>
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                  className="invisible absolute"
                />
              </label>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/10 bg-background-light dark:bg-background-dark">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-200/30 dark:bg-white/5">
                      <th
                        className="sticky left-0 bg-gray-200/30 dark:bg-background-dark z-10 px-4 py-3 text-left text-black dark:text-white w-56 min-w-56 text-sm font-medium leading-normal"
                        scope="col"
                      >
                        Feature
                      </th>
                      {products.map((product) => (
                        <th key={product.id} className="px-4 py-3 text-left w-64 min-w-64 text-black dark:text-white text-sm font-medium leading-normal" scope="col">
                          <div className="relative">
                            <div
                              className="bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg mb-2"
                              style={{ backgroundImage: `url(${product.image_url})` }}
                            ></div>
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="absolute top-2 right-2 flex items-center justify-center size-7 rounded-full bg-black/50 text-white hover:bg-black/70"
                            >
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                            <p className="font-bold">{product.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {product.price} {product.currency}
                            </p>
                          </div>
                        </th>
                      ))}
                      {products.length < 4 && (
                        <th className="px-4 py-3 text-left w-64 min-w-64 text-sm font-medium leading-normal" scope="col">
                          <div
                            onClick={addProduct}
                            className="flex items-center justify-center flex-col h-full aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-4xl">add_circle</span>
                            <p className="mt-2 text-sm">Add another item</p>
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFields.map((field) => {
                      const values = products.map((p) => {
                        if (field.key === 'seller') return p.seller?.name || 'N/A';
                        if (field.key === 'rating') return p.seller?.rating || 0;
                        return (p as any)[field.key] || 'N/A';
                      });
                      const allSame = values.every((v) => v === values[0]);
                      const shouldHighlight = highlightDifferences && !allSame;

                      return (
                        <tr
                          key={field.key}
                          className={`border-b border-gray-200 dark:border-white/10 ${shouldHighlight ? 'bg-yellow-100/10 dark:bg-yellow-900/10' : ''}`}
                        >
                          <td className="sticky left-0 bg-gray-200/30 dark:bg-background-dark z-10 px-4 py-3 text-black dark:text-white text-sm font-medium">
                            {field.label}
                          </td>
                          {products.map((product, idx) => {
                            let value: string | number = 'N/A';
                            if (field.key === 'seller') value = product.seller?.name || 'N/A';
                            else if (field.key === 'rating') value = product.seller?.rating || 0;
                            else value = (product as any)[field.key] || 'N/A';

                            return (
                              <td key={product.id} className="px-4 py-3 text-black dark:text-white text-sm">
                                {field.key === 'rating' ? (
                                  <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-yellow-400 text-base">star</span>
                                    <span>{value}</span>
                                  </div>
                                ) : (
                                  value
                                )}
                              </td>
                            );
                          })}
                          {products.length < 4 && <td className="px-4 py-3"></td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

