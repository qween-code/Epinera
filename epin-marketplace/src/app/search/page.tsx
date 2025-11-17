'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
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
      if (sortBy === 'created_at') {
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
      } else if (sortBy === 'title') {
        queryBuilder = queryBuilder.order('title', { ascending: true });
      }

      const { data, error } = await queryBuilder;

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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ürün Ara</h1>

        {/* Search Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Arama</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ürün adı yazın..."
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sıralama</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created_at">En Yeni</option>
                  <option value="title">İsme Göre (A-Z)</option>
                  <option value="price_asc">Fiyat (Düşük - Yüksek)</option>
                  <option value="price_desc">Fiyat (Yüksek - Düşük)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Ara
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Aranıyor...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">Sonuç Bulunamadı</h2>
            <p className="text-gray-400 mb-6">
              {query ? `"${query}" için sonuç bulunamadı` : 'Arama yaparak ürünleri keşfedin'}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-400">
              {products.length} ürün bulundu
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
