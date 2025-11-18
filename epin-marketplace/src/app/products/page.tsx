import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
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
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Products</h1>
        <p className="text-gray-400 mb-8">Browse our collection of digital products</p>
        
        {!products || products.length === 0 ? (
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
            {products.map((product) => {
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
