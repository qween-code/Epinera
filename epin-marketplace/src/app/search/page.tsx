'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    searchProducts();
  }, [query, selectedCategory, sortBy, minPrice, maxPrice]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name, slug').is('parent_id', null);
    if (data) setCategories(data);
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
          image_url,
          category_id,
          product_variants (price, currency)
        `)
        .eq('status', 'active');

      // Full-text search using textSearch
      if (query && query.trim()) {
        queryBuilder = queryBuilder.textSearch('search_vector', query.trim(), {
          type: 'plain',
        });
      }

      // Category filter
      if (selectedCategory) {
        queryBuilder = queryBuilder.eq('category_id', selectedCategory);
      }

      // Sorting (price sorting done client-side after processing)
      if (sortBy === 'created_at') {
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
      } else if (sortBy === 'title') {
        queryBuilder = queryBuilder.order('title', { ascending: true });
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Search error:', error);
        setProducts([]);
        return;
      }

      // Process products and filter by price
      let processedProducts = (data || []).map((product) => {
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

      // Price filtering
      if (minPrice || maxPrice) {
        processedProducts = processedProducts.filter((product) => {
          if (!product.lowest_price) return false;
          const price = product.lowest_price;
          const min = minPrice ? parseFloat(minPrice) : 0;
          const max = maxPrice ? parseFloat(maxPrice) : Infinity;
          return price >= min && price <= max;
        });
      }

      // Price sorting (client-side)
      if (sortBy === 'price_asc') {
        processedProducts.sort((a, b) => (a.lowest_price || 0) - (b.lowest_price || 0));
      } else if (sortBy === 'price_desc') {
        processedProducts.sort((a, b) => (b.lowest_price || 0) - (a.lowest_price || 0));
      }

      setProducts(processedProducts);
    } catch (err) {
      console.error('Search error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'created_at') params.set('sort', sortBy);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.push(newURL, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
    searchProducts();
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSortBy('created_at');
    setMinPrice('');
    setMaxPrice('');
    router.push('/search');
  };

  const activeFiltersCount = [query, selectedCategory, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-heading">
            <span className="text-gradient">Ürün Ara</span>
          </h1>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-magenta hover:text-magenta/80 transition-colors"
            >
              Filtreleri Temizle ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Search Form */}
        <div className="neo rounded-xl p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Query */}
            <div>
              <label className="terminal-label block mb-2">// ARAMA</label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün adı, açıklama..."
                  className="input pr-10"
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="terminal-label block mb-2">// KATEGORI</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="terminal-label block mb-2">// MIN FİYAT</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="input"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="terminal-label block mb-2">// MAX FİYAT</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Sınırsız"
                  min="0"
                  step="0.01"
                  className="input"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="terminal-label block mb-2">// SIRALAMA</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
                  <option value="created_at">En Yeni</option>
                  <option value="title">İsme Göre (A-Z)</option>
                  <option value="price_asc">Fiyat (Düşük - Yüksek)</option>
                  <option value="price_desc">Fiyat (Yüksek - Düşük)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full btn btn-primary justify-center py-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Ara
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[var(--text-tertiary)]">Aranıyor...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="neo rounded-2xl p-14 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neo-inset flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--text-ghost)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-heading mb-2">Sonuç Bulunamadı</h2>
            <p className="text-sm text-[var(--text-tertiary)] mb-6">
              {query || activeFiltersCount > 0
                ? 'Farklı arama kriterleri deneyebilirsiniz'
                : 'Arama yaparak ürünleri keşfedin'}
            </p>
            {activeFiltersCount > 0 ? (
              <button onClick={clearFilters} className="btn btn-primary">
                Filtreleri Temizle
              </button>
            ) : (
              <Link href="/" className="btn btn-primary">
                Ana Sayfaya Dön
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-[var(--text-tertiary)]">
                <span className="stat-number">{products.length}</span> ürün bulundu
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
