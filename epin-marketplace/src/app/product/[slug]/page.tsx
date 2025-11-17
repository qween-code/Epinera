import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import Breadcrumbs from '@/components/product/Breadcrumbs';
import SellerInfoBlock from '@/components/product/SellerInfoBlock';
import ProductTabs from '@/components/product/ProductTabs';
import ReviewsSection from '@/components/product/ReviewsSection';
import RelatedProducts from '@/components/product/RelatedProducts';
import AddToCartButton from '@/components/cart/AddToCartButton';

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
  const seller = {
    id: product.seller?.id || product.seller_id,
    name: product.seller?.full_name || 'Unknown Seller',
    avatar: product.seller?.avatar_url,
    rating: 4.9,
    salesCount: 25000,
    isVerified: true,
    deliveryTime: 'Instant Delivery',
  };

  // Build breadcrumbs
  const category = product.categories;
  const parentCategory = category?.parent;
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(parentCategory
      ? [{ label: parentCategory.name, href: `/category/${parentCategory.slug}` }]
      : []),
    ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
    { label: product.title },
  ];

  // Get product images (mock for now, will be from product metadata later)
  const productImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAOTtC-A_rj0OtrEcnHfp1HKACHVi3VH_UXLJIiSZIej4LCgtwX1P_-waM39N4WAfUbh9lsbkxXp-7E9AyOkwsvx7UingnsMYAcN6wUYWcqcAlvvQ1AquBGHn6T2fEvW0-k5eKNO5l03oGJbm4FUgS5DtLWebdTKe5BBiVKJMB_QZoYL1fapnvv68KupL7jtgeoDljMnwUSQ1HdRjNXaJejKgyXZCdwBoLqYd4t-llwvOMUeyJRyP45uNufZz-7-Zn-TV9BcRCquTpG',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAUcypqnKOTPncF_r3Ddztq_KWsO2tyVJh-HVvhEfawV5fBx5Xu8Q47NwCMsCz1GwdBqupmOwtOJKKkYf7xsGFxQYl9kjxGAt85oyd7qzm02aVrCXLJn1yUI88Z03clz0Rk3TZh8SGfCPiqR7zZ9-807m6soDp64Pd_uVnQJTxDN_Fo5l_nS10dkp8FAw1WV5SwkGjCDId7HqwTTfEq-GCnR6ZqpMjFAwmJ8EyjQz2yATD148fM61X8s5HK1tdAWvvckY3xWqdGa1hn',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBfVDTMnguOfn1DUeaFijvKlb0H6ILzPpmy_16ABEto9etVzISG4-LONYHmf7WxUqUb_K6BQIco88mjtPXllZvEvhku8CNgT1Z1bGuG1qnnmrJ_yM65Xz-z2wQbg1DbVkskjAlmPdp8v6x4-VWzTAD9HyuySEKUdOE9ZU1y7CK-Q9sMDDEv1i3Ix9w3p-fifKiZugg7DcgE1EbPE2vjn7eSVbUgSX7FgQe4JKueEpBS-hR8ArYtce2MCe785ISr_EI8InL3SAGDj9my',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDsixYgUx20LYzryJIBBnyqCgAZ8r6kbUpjrhJaim4cH6XvausohLCcJOK4evqSGQ0QiEy8GgscU6HynBqtrWCKC2mCt72E7TfvJvtlCtEbbmHDPXxs9gnsV91FQc7kZp2QUXEsWsTH-Y1SvUXytLdXB2xMVLuGjZ39-hAk8RHjJ_xbgOhfJvvDKttZrqPFk2oI57J6JYYBGIBtT9x3CMZ2m-jZtzVOtp1BP2-qVzxPR5e9zxfjuwcsFfqBRViDIO2wH2jtFQWlsw2W',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJciT1N8Q327hCRSTpbtAr3CAd-8mvl07x8GqvQMkjLfN705_XJSKnU3NRM1Wyp_NEGxNHktJbVOXATUPUsuBNOWgi4WRDHVg20lYwu-yNWcc1WkP3DgEaVztJ4NrG4a-YGffYQ3kdsRaUVfwCo3WvG5mJ8oGVhxbdd8mCVJP9rQLCPsryTN8ywQZg_nLyT2GIEspOpAsW6K6M4MnODXIRP47qs7b54YZYwvhxCSJXTdcGWRVh7scGwREYF5kXkYGkSx8ooyJBkkLV',
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
          avatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCikSVGqVBvoLynMHpwNJnm-4r9liqH1oJhnraGHaOeCs7dfiUmGA0E1c5PY32Dkl7A_0gek1bN8T-t0spAEGWsnLDUvZ4dY1jtXd-hZpyb-d6yed9uHj2bE_ytX5bRhKKD3pjFrpXlgjS0YzMEJ0qPyzZoXONfolzP1GuXf7HACyKERCaAzRRz72x3z5r47S43aXT3kZ19TWhekBIrvwZtts4fH22mjv-YJ1oxGUU97l06tzteNsatDiuiUMAeTq6CrG0ulGBOZCYX',
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
          avatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuD6nDn3vX8-D5SRS-xfiSK7VbgaJO9WjQ6H3i-cdgZvewyr63O0ZusrDJIK1KvwBrTwu3wiZ6Ng07TKkINy1w1tUGjwn_ZJTW1xv_J1RDQnsb_EBBuldTxV9B94gSnQv4curSxBzU6egLNzj0NB_QZfdkv7tWQU8bH94xy2Dsnpn7oczLvCq-6CjT-vWEJi3cBa3BqXMFgKVi_mSTgbTRApY4wCU1-QaBL8K8JHB5KvdGKfkyIcAbPcZI7RHiDi-hZt2t4iHaHttp2w',
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
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA_PUKah0i3-HUJ4ii4rvfCwcne1ZahsCGaH60S1n0-2w57dvjRdUXJ6kqxX7Ix_VZ0kZtycXGNODL9DDKYMOv7XvXpwK2VDf0ujz6htOYg7CoQCB_VxQd5Tg9iX4xpcO-KZ7IB75CrrPEDP1qPf6khhJ_bQSEfMDQwJtdbR7Uc1i9Y1mEjHxpYhWY2wyLedJv-s1oNvcnfqLapmIcXJXUErktj7UNEdVxgz5gcTJEtgwRhZsFNccjKgetu5bfoK5HcHzygQbqvNO17',
      slug: 'season-4-battle-pass',
    },
    {
      id: '2',
      title: 'Legendary Skin Pack',
      game: 'Cybernetic Heroes',
      price: 12.5,
      currency: 'USD',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBWhddEOdatzsT8ft83Vqiae2ZCAHpsduqFaSNm7XlmNWeXyq_aGpuUMX-F0Jtxmh6cvXVeeBRFAPAVvEVgYtzzCqjNOXgH0zxcwPOlNj610Ahe5pTqW8byXkleatxNzqtYLfjlbIINOuQdu9idaURIKS6JMCWmcbLcTjSfnRPUh3TRokh2N6L_0UdHlqupuIY8VO2T4KkXq5NmxvI-18XCyT53-UYOCn5NCN-soaM4HrrFaC9TIaciVQp7h2Q8KtLDdH07m4HJCqo8',
      slug: 'legendary-skin-pack',
    },
    {
      id: '3',
      title: '5000 Credits Pack',
      game: 'Cybernetic Heroes',
      price: 44.99,
      currency: 'USD',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBkWzaS67aDq42t39Hco9cIC609juTY_SnbuQISyJBC_Vd9fmVaxk14NRCK2zhteRa573hvvn0Se2Sjde9fpmhoxLdGIT_NVlOhX-NaNmdA_KF9adXxDPA-5sKK_4GrtZTCb0jem5I-ZlqZ7sN03XZkYJHL-KZgn5PxCHNZkfQBcilXmFcG2J4Y3amAE4B9hO5yYoooNgZAE48uT_NcPNu-W6KE4SgjeRlY-1fUo2Jymcmjg6vfD-sPx8EeYQ90flGERdcf3jsutX-y',
      slug: '5000-credits-pack',
    },
    {
      id: '4',
      title: 'Void Runners - Starter Pack',
      game: 'Void Runners',
      price: 7.99,
      currency: 'USD',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAJQvp5l88WtzKqO5sHV6DJrPQikrs6Mb25rM3z7G1X7YpqgGwNVjxZOuqHYFpFdXkp9_iBxsSXZLOmPSWR0yV1K5__UKxSjLaTKXbajFzmqFPPGTrEscV5YHpopgaZXmI-F5cQZ0-DkUBdmsLdYUjXB7qoYAb0Q2KoXfMTBnX9sPbJF1Dy_5JhF0c-MH6Q3x4i8MkXpImSpXPr6iZvfHvk8Yg_D758_8DnfC2rKoDmT_Tvweh-MOq0ouI2K68lpX5IkO0L4qHUtzhe',
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
