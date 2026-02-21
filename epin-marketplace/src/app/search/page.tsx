'use client';

import { createClient } from '@/lib/supabase/client';
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

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { searchProducts(); }, [query, selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name, slug').is('parent_id', null);
    if (data) setCategories(data);
  };

  const searchProducts = async () => {
    setLoading(true);
    try {
      let queryBuilder = supabase.from('products').select(`id, title, slug, category_id, product_variants (price, currency)`).eq('status', 'active');
      if (query) queryBuilder = queryBuilder.ilike('title', `%${query}%`);
      if (selectedCategory) queryBuilder = queryBuilder.eq('category_id', selectedCategory);
      if (sortBy === 'created_at') queryBuilder = queryBuilder.order('created_at', { ascending: false });
      else if (sortBy === 'title') queryBuilder = queryBuilder.order('title', { ascending: true });

      const { data } = await queryBuilder;
      const processedProducts = (data || []).map((product) => {
        const variants = product.product_variants || [];
        const lowestPrice = variants.length > 0 ? Math.min(...variants.map((v: any) => parseFloat(v.price))) : undefined;
        return { id: product.id, title: product.title, slug: product.slug, lowest_price: lowestPrice, currency: variants[0]?.currency || 'TRY' };
      });
      if (sortBy === 'price_asc') processedProducts.sort((a, b) => (a.lowest_price || 0) - (b.lowest_price || 0));
      else if (sortBy === 'price_desc') processedProducts.sort((a, b) => (b.lowest_price || 0) - (a.lowest_price || 0));
      setProducts(processedProducts);
    } catch (err) { console.error('Search error:', err); }
    finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-heading mb-8"><span className="text-gradient">Urun Ara</span></h1>

        {/* Search Form */}
        <div className="neo rounded-xl p-6 mb-8">
          <form onSubmit={(e) => { e.preventDefault(); searchProducts(); }} className="space-y-4">
            <div>
              <label className="terminal-label block mb-2">// ARAMA</label>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Urun adi yazin..." className="input" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="terminal-label block mb-2">// KATEGORI</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input">
                  <option value="">Tum Kategoriler</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="terminal-label block mb-2">// SIRALAMA</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
                  <option value="created_at">En Yeni</option>
                  <option value="title">Isme Gore (A-Z)</option>
                  <option value="price_asc">Fiyat (Dusuk - Yuksek)</option>
                  <option value="price_desc">Fiyat (Yuksek - Dusuk)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full btn btn-primary justify-center py-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Ara
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[var(--text-tertiary)]">Araniyor...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="neo rounded-2xl p-14 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neo-inset flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--text-ghost)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-heading mb-2">Sonuc Bulunamadi</h2>
            <p className="text-sm text-[var(--text-tertiary)] mb-6">
              {query ? `"${query}" icin sonuc bulunamadi` : 'Arama yaparak urunleri kesfedin'}
            </p>
            <Link href="/" className="btn btn-primary">Ana Sayfaya Don</Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-[var(--text-tertiary)]">{products.length} urun bulundu</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
