import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

interface RecommendedProductsProps {
    userId: string;
}

export default async function RecommendedProducts({ userId }: RecommendedProductsProps) {
    const supabase = await createClient();

    // Fetch recommended products (could be based on user's purchase history, browsing, etc.)
    // For now, just get popular/recent products
    const { data: products } = await supabase
        .from('products')
        .select(`
  id,
      title,
      slug,
      image_url,
      product_variants (
        price,
        currency
      )
    `)
        .eq('status', 'active')
        .limit(5);

    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-bold">Recommended</h2>
                <Link href="/products" className="text-primary hover:text-primary/80 text-sm font-medium">
                    View All
                </Link>
            </div>

            <div className="space-y-4">
                {products && products.length > 0 ? (
                    products.map((product: any) => {
                        const price = product.product_variants?.[0]?.price || '0.00';
                        const currency = product.product_variants?.[0]?.currency || 'USD';

                        return (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20"
                            >
                                <div
                                    className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                                    style={{
                                        backgroundImage: product.image_url
                                            ? `url('${product.image_url}')`
                                            : 'url(\"https://via.placeholder.com/150\")',
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm truncate">{product.title}</p>
                                    <p className="text-primary font-bold text-sm">
                                        ${parseFloat(price).toFixed(2)} {currency}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-white/40">chevron_right</span>
                            </Link>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <span className="material-symbols-outlined text-5xl text-white/20 mb-2">
                            shopping_bag
                        </span>
                        <p className="text-white/60 text-sm">No recommendations yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
