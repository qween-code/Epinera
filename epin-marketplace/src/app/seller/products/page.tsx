'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductTable from '@/components/seller/ProductTable';

export default function SellerProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push('/login?redirect=/seller/products');
          return;
        }

        setUser(currentUser);

        // Fetch seller's products with variants
        let query = supabase
          .from('products')
          .select(
            `
            id,
            title,
            slug,
            image_url,
            status,
            created_at,
            product_variants (
              id,
              name,
              price,
              currency,
              stock_quantity,
              status,
              sku
            )
          `
          )
          .eq('seller_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,product_variants.sku.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          // Transform products to include variant data
          const transformedProducts = (data || []).map((product: any) => {
            const variants = product.product_variants || [];
            const firstVariant = variants[0] || {};
            const totalStock = variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0);

            return {
              id: product.id,
              title: product.title,
              image_url: product.image_url,
              sku: firstVariant.sku || `PRD-${product.id.slice(0, 8).toUpperCase()}`,
              stock: totalStock,
              price: parseFloat(firstVariant.price?.toString() || '0'),
              currency: firstVariant.currency || 'USD',
              status: product.status,
            };
          });

          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, searchQuery]);

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/seller/products/${productId}/edit`);
  };

  const handleView = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      window.open(`/product/${product.slug}`, '_blank');
    }
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // TODO: Implement delete
      console.log('Delete product:', productId);
    }
  };

  const handleImportCSV = () => {
    // TODO: Implement CSV import
    console.log('Import CSV');
  };

  const handleExportListings = () => {
    // TODO: Implement export
    console.log('Export listings');
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
        <div className="flex-1 p-8">
          <div className="text-center text-slate-900 dark:text-white/50">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      <main className="flex-1 p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              My Products
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleImportCSV}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="truncate">Import via CSV</span>
              </button>
              <button
                onClick={handleExportListings}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="truncate">Export Listings</span>
              </button>
            </div>
          </div>

          {/* ToolBar & SearchBar */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-slate-500 dark:text-[#90b8cb] flex border-y border-l border-slate-200/20 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-y border-r border-slate-200/20 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 focus:border-primary h-full placeholder:text-slate-500 dark:placeholder:text-[#90b8cb] px-4 text-base font-normal leading-normal"
                    placeholder="Search by product name or SKU"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <Link
              href="/seller/products/new"
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-5 hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                add
              </span>
              <span className="truncate">Add New Product</span>
            </Link>
          </div>

          {/* Product Table */}
          <ProductTable
            products={products}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}
