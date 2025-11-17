import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import Breadcrumbs from '@/components/product/Breadcrumbs';
import SellerInfoBlock from '@/components/product/SellerInfoBlock';
import ProductTabs from '@/components/product/ProductTabs';
import ReviewsSection from '@/components/product/ReviewsSection';
import RelatedProducts from '@/components/product/RelatedProducts';
import AddToCartButton from '@/components/cart/AddToCartButton';
import ProductPageHeader from '@/components/shared/ProductPageHeader';
import { getProductImage } from '@/lib/constants/images';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const supabase = await createClient();

  // Fetch product with all related data
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      slug,
      seller_id,
      category_id,
      categories (
        id,
        name,
        slug,
        parent_id,
        parent:categories!parent_id (
          id,
          name,
          slug
        )
      ),
      seller:profiles!seller_id (
        id,
        full_name,
        avatar_url
      ),
      product_variants (
        id,
        name,
        price,
        currency,
        stock_quantity,
        status
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !product) {
    notFound();
  }

  // Get seller stats (mock data for now, will be replaced with real query later)
  const sellerData = Array.isArray(product.seller) ? product.seller[0] : product.seller;
  const seller = {
    id: (sellerData as any)?.id || product.seller_id,
    name: (sellerData as any)?.full_name || 'Unknown Seller',
    avatar: (sellerData as any)?.avatar_url,
    rating: 4.9,
    salesCount: 25000,
    isVerified: true,
    deliveryTime: 'Instant Delivery',
  };

  // Build breadcrumbs
  const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;
  const parentCategory = (category as any)?.parent && Array.isArray((category as any).parent) 
    ? (category as any).parent[0] 
    : (category as any)?.parent;
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(parentCategory
      ? [{ label: parentCategory.name, href: `/category/${parentCategory.slug}` }]
      : []),
    ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
    { label: product.title },
  ];

  // Get product images - using real images from Unsplash
  const baseImage = getProductImage(product.title);
  const productImages = [
    baseImage,
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
  ];

  // Get lowest price variant
  const variants = product.product_variants || [];
  const activeVariants = variants.filter((v: any) => v.status === 'active');
  const lowestPriceVariant = activeVariants.length > 0
    ? activeVariants.reduce((min: any, v: any) =>
        parseFloat(v.price) < parseFloat(min.price) ? v : min
      )
    : null;

  const currentPrice = lowestPriceVariant
    ? parseFloat(lowestPriceVariant.price)
    : 0;
  const originalPrice = currentPrice * 1.5; // Mock discount
  const discount = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Mock reviews data (will be replaced with real query later)
  const reviewsData = {
    averageRating: 4.8,
    totalReviews: 1283,
    ratingBreakdown: {
      5: 1090,
      4: 128,
      3: 38,
      2: 12,
      1: 15,
    },
    reviews: [
      {
        id: '1',
        reviewer: {
          name: 'GamerAli',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GamerAli',
        },
        rating: 5,
        comment:
          'Super fast delivery! Got my code instantly and it worked perfectly. The seller is legit and the process was secured with blockchain verification which gave me peace of mind. Highly recommended!',
        date: '2 days ago',
      },
      {
        id: '2',
        reviewer: {
          name: 'ProPlayer92',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProPlayer92',
        },
        rating: 4,
        comment:
          'Good price and fast transaction. Would be 5 stars but the checkout process had a small glitch. Still, I got what I paid for.',
        date: '1 week ago',
      },
    ],
  };

  // Mock related products (will be replaced with real query later)
  const relatedProducts = [
    {
      id: '1',
      title: 'Season 4 Battle Pass',
      game: 'Cybernetic Heroes',
      price: 19.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      slug: 'season-4-battle-pass',
    },
    {
      id: '2',
      title: 'Legendary Skin Pack',
      game: 'Cybernetic Heroes',
      price: 12.5,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
      slug: 'legendary-skin-pack',
    },
    {
      id: '3',
      title: '5000 Credits Pack',
      game: 'Cybernetic Heroes',
      price: 44.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
      slug: '5000-credits-pack',
    },
    {
      id: '4',
      title: 'Void Runners - Starter Pack',
      game: 'Void Runners',
      price: 7.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
      slug: 'void-runners-starter-pack',
    },
  ];

  // Tab content
  const tabs = [
    {
      id: 'description',
      label: 'Description',
      content: (
        <div>
          <p>
            {product.description ||
              'Unlock your full potential in Cybernetic Heroes with 1000 Credits. Use these credits to purchase exclusive in-game items, character skins, weapon upgrades, and season passes. This global key is valid for the PC version of the game and can be activated worldwide.'}
          </p>
          <h4 className="text-black dark:text-white font-bold pt-2">Activation Instructions:</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>Launch the Cybernetic Heroes game client on your PC.</li>
            <li>Navigate to the in-game store or marketplace.</li>
            <li>Select the "Redeem Code" option.</li>
            <li>Enter the key provided after your purchase and click "Submit".</li>
            <li>Your 1000 Credits will be instantly added to your account balance.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'features',
      label: 'Key Features',
      content: (
        <div>
          <ul className="list-disc list-inside space-y-2">
            <li>Instant digital delivery</li>
            <li>Global activation key</li>
            <li>Secure blockchain verification</li>
            <li>24/7 customer support</li>
            <li>Money-back guarantee</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Web3 Security',
      content: (
        <div>
          <p>
            All transactions are secured with blockchain technology. Your purchase is verified on-chain,
            ensuring authenticity and preventing fraud. We use industry-leading encryption to protect your
            personal information.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <ProductPageHeader />
        <main className="px-4 sm:px-10 lg:px-20 py-5">
          <div className="layout-content-container flex flex-col max-w-7xl mx-auto flex-1 gap-8">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbs} />

            {/* Main Product Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Media Gallery */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <ProductImageGallery images={productImages} productTitle={product.title} />
              </div>

              {/* Right Column: Purchase Info */}
              <div className="flex flex-col gap-6">
                {/* Product Title */}
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-black dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                    {product.title}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                    Sold by{' '}
                    <Link href={`/seller/${seller.id}`} className="text-primary hover:underline">
                      {seller.name}
                    </Link>
                  </p>
                </div>

                {/* Price and Actions */}
                <div className="p-6 bg-gray-100 dark:bg-white/5 rounded-xl flex flex-col gap-4">
                  <div className="flex items-baseline gap-3">
                    <h1 className="text-black dark:text-white text-4xl font-bold leading-tight tracking-[-0.015em]">
                      {lowestPriceVariant?.currency === 'USD' ? '$' : ''}
                      {currentPrice.toFixed(2)}
                      {lowestPriceVariant?.currency !== 'USD'
                        ? ` ${lowestPriceVariant?.currency || 'TRY'}`
                        : ''}
                    </h1>
                    {discount > 0 && (
                      <>
                        <span className="text-gray-500 dark:text-gray-400 text-lg line-through">
                          {lowestPriceVariant?.currency === 'USD' ? '$' : ''}
                          {originalPrice.toFixed(2)}
                        </span>
                        <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded">
                          -{discount}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Variant Selection */}
                  {activeVariants.length > 0 && (
                    <div className="flex flex-col gap-3 mt-2">
                      {activeVariants.length === 1 ? (
                        <>
                          <Link
                            href={`/checkout?product=${product.id}&variant=${activeVariants[0].id}`}
                            className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                          >
                            Buy Now
                          </Link>
                          <AddToCartButton
                            variantId={activeVariants[0].id}
                            variantName={activeVariants[0].name}
                            stockQuantity={activeVariants[0].stock_quantity}
                            className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-gray-200 dark:bg-white/10 text-black dark:text-white text-base font-bold leading-normal tracking-[0.015em]"
                          />
                        </>
                      ) : (
                        <div className="space-y-3">
                          {activeVariants.map((variant: any) => (
                            <div
                              key={variant.id}
                              className="p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <h3 className="text-lg font-medium text-black dark:text-white">
                                    {variant.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Stock: {variant.stock_quantity > 0 ? variant.stock_quantity : 'Out of Stock'}
                                  </p>
                                </div>
                                <p className="text-xl font-bold text-primary">
                                  {variant.currency === 'USD' ? '$' : ''}
                                  {parseFloat(variant.price).toFixed(2)}
                                  {variant.currency !== 'USD' ? ` ${variant.currency}` : ''}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Link
                                  href={`/checkout?product=${product.id}&variant=${variant.id}`}
                                  className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                                >
                                  Buy Now
                                </Link>
                                <AddToCartButton
                                  variantId={variant.id}
                                  variantName={variant.name}
                                  stockQuantity={variant.stock_quantity}
                                  className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-white/10 text-black dark:text-white text-sm font-bold leading-normal tracking-[0.015em]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary cursor-pointer mt-2 transition-colors">
                    <span className="material-symbols-outlined text-base">favorite_border</span>
                    <span className="text-sm font-medium">Add to Wishlist</span>
                  </div>
                </div>

                {/* Seller Information */}
                <SellerInfoBlock seller={seller} />
              </div>
            </div>

            {/* Tabbed Information Panel */}
            <ProductTabs tabs={tabs} defaultTab="description" />

            {/* Customer Reviews */}
            <ReviewsSection
              averageRating={reviewsData.averageRating}
              totalReviews={reviewsData.totalReviews}
              ratingBreakdown={reviewsData.ratingBreakdown}
              reviews={reviewsData.reviews}
            />

            {/* Related Products */}
            <RelatedProducts products={relatedProducts} />
          </div>
        </main>
      </div>
    </div>
  );
}
