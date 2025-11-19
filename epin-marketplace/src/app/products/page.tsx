import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

type ProductsPageProps = {
  searchParams: Promise<{
    deals?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const supabase = await createClient()
  const params = await searchParams;
  const showDeals = params?.deals === 'true';
  
  let query = supabase
    .from('products')
    .select(`
      id,
      title,
      slug,
      description,
      status,
      category_id,
      seller_id,
      created_at,
      updated_at,
      categories:category_id (
        id,
        name,
        slug
      ),
      product_variants (
        id,
        name,
        price,
        currency,
        stock_quantity
      )
    `)
    .eq('status', 'active');

  // If deals filter is active, get products with active discount campaigns
  if (showDeals) {
    const now = new Date().toISOString();
    try {
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id')
        .eq('campaign_type', 'discount')
        .eq('status', 'active')
        .lte('start_date', now)
        .gte('end_date', now);
      // Campaigns table might not exist, continue without it
    } catch (error: any) {
      if (error?.code !== 'PGRST205') {
        console.error('Error fetching campaigns:', error);
      }
    }
    
    // For now, just show recent products as deals
    // In production, link products to campaigns
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: products, error } = await query.limit(50);

  // Try to get image_url separately if column exists
  let productsWithImages: any[] = products || [];
  if (products && products.length > 0) {
    try {
      const { data: productsWithImageData } = await supabase
        .from('products')
        .select('id, image_url')
        .in('id', products.map(p => p.id));
      
      const imageMap = new Map((productsWithImageData || []).map(p => [p.id, p.image_url]));
      productsWithImages = products.map(p => ({
        ...p,
        image_url: imageMap.get(p.id) || null
      }));
    } catch (error: any) {
      // image_url column doesn't exist, use products without images
      if (error?.code !== '42703') {
        console.error('Error fetching image_url:', error);
      }
      productsWithImages = products.map(p => ({ ...p, image_url: null }));
    }
  }

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{showDeals ? 'Flash Deals' : 'Products'}</h1>
            <p className="text-gray-400">{showDeals ? 'Limited time offers and discounts' : 'Browse our collection of digital products'}</p>
          </div>
          {showDeals && (
            <Link
              href="/products"
              className="text-primary hover:underline text-sm font-medium"
            >
              View All Products
            </Link>
          )}
        </div>
        
        {!productsWithImages || productsWithImages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-400 mb-6">
              {error 
                ? 'Error loading products. Please check your database connection.'
                : 'Products will appear here once they are added to the database.'}
            </p>
            <p className="text-sm text-gray-500">
              Run the seed script in Supabase SQL Editor: <code className="bg-gray-800 px-2 py-1 rounded">supabase/seed_comprehensive_test_data.sql</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsWithImages.map((product: any) => {
              const minPrice = product.product_variants && product.product_variants.length > 0
                ? Math.min(...product.product_variants.map((v: any) => parseFloat(v.price)))
                : null
              
              return (
                <Link 
                  href={`/product/${product.slug || product.id}`} 
                  key={product.id}
                  className="group"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-200 hover:shadow-xl hover:scale-105">
                    <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🎮
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        {product.categories && (
                          <span className="text-xs text-blue-400 font-medium">
                            {Array.isArray(product.categories) 
                              ? product.categories[0]?.name 
                              : (product.categories as any)?.name || 'Uncategorized'}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {product.title}
                      </h2>
                      {product.description && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        {minPrice !== null ? (
                          <div>
                            <span className="text-2xl font-bold text-green-400">
                              ${minPrice.toFixed(2)}
                            </span>
                            {product.product_variants && product.product_variants.length > 1 && (
                              <span className="text-xs text-gray-500 ml-1">
                                from
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">Price on request</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {product.product_variants?.length || 0} variant{product.product_variants?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
