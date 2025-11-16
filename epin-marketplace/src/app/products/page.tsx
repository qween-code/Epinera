import { createServerComponentClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function ProductsPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data: products } = await supabase.from('products').select()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Link href={`/product/${product.slug}`} key={product.id}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-48 mb-4 rounded"></div>
              <h2 className="text-xl font-semibold">{product.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
