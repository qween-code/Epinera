'use client';

import { useWishlist } from '@/lib/wishlist/WishlistContext';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { items } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchWishlistProducts();
  }, [items]);

  const fetchWishlistProducts = async () => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('products')
      .select('id, title, slug, image_url, product_variants(price, currency)')
      .in('id', items);

    const processed = (data || []).map((product) => {
      const variants = product.product_variants || [];
      const lowestPrice = variants.length > 0 ? Math.min(...variants.map((v: any) => parseFloat(v.price))) : undefined;
      return { ...product, lowest_price: lowestPrice, currency: variants[0]?.currency || 'TRY' };
    });

    setProducts(processed);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-heading mb-8"><span className="text-gradient">İstek Listem</span></h1>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          </div>
        ) : products.length === 0 ? (
          <div className="neo rounded-2xl p-14 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neo-inset flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--neon-magenta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-heading mb-2">İstek Listeniz Boş</h2>
            <p className="text-sm text-[var(--text-tertiary)] mb-6">Beğendiğiniz ürünleri kalp ikonuna tıklayarak ekleyin</p>
            <Link href="/search" className="btn btn-primary">Ürünleri Keşfet</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
