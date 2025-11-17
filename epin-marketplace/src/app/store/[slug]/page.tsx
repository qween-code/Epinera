'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import StorefrontHeader from '@/components/seller/StorefrontHeader';
import StorefrontBanner from '@/components/seller/StorefrontBanner';
import StorefrontProfile from '@/components/seller/StorefrontProfile';
import SellerInfoCard from '@/components/seller/SellerInfoCard';
import ProductTabs from '@/components/seller/ProductTabs';
import StorefrontProductCard from '@/components/seller/StorefrontProductCard';
import ReviewSummary from '@/components/seller/ReviewSummary';
import ReviewCard from '@/components/seller/ReviewCard';

export default function StorefrontPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();

        // Fetch store by slug (assuming slug is seller username or store name)
        // For now, we'll fetch by seller_id from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .ilike('full_name', `%${slug}%`)
          .single();

        if (!profile) {
          setLoading(false);
          return;
        }

        // Fetch seller's products
        const { data: productsData } = await supabase
          .from('products')
          .select(
            `
            id,
            title,
            slug,
            image_url,
            status,
            product_variants (
              id,
              name,
              price,
              currency
            )
          `
          )
          .eq('seller_id', profile.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (productsData) {
          const transformedProducts = productsData
            .map((product: any) => {
              const variant = product.product_variants?.[0];
              if (!variant) return null;

              return {
                id: product.id,
                title: product.title,
                imageUrl: product.image_url,
                platform: 'PC', // TODO: Get from product data
                price: parseFloat(variant.price.toString()),
                currency: variant.currency || 'USD',
                slug: product.slug,
                variantId: variant.id,
              };
            })
            .filter(Boolean);

          setProducts(transformedProducts);
        }

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select(
            `
            id,
            rating,
            comment,
            created_at,
            profiles!reviews_buyer_id_fkey (
              full_name,
              avatar_url
            )
          `
          )
          .eq('seller_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (reviewsData) {
          setReviews(
            reviewsData.map((review: any) => ({
              id: review.id,
              userName: review.profiles?.full_name || 'Anonymous',
              userAvatar: review.profiles?.avatar_url,
              rating: review.rating,
              comment: review.comment,
              date: review.created_at,
            }))
          );
        }

        // Calculate store stats
        const avgRating = reviewsData?.reduce((sum, r) => sum + r.rating, 0) / (reviewsData?.length || 1) || 4.8;
        const reviewCount = reviewsData?.length || 2451;

        setStore({
          id: profile.id,
          name: profile.full_name || 'Store',
          description: 'Your one-stop shop for all gaming needs!',
          logoUrl: profile.avatar_url,
          isVerified: true,
          rating: avgRating,
          reviewCount,
          productsSold: 15000,
          yearsOnPlatform: 3,
          followers: 5210,
        });
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const handleFollow = () => {
    // TODO: Implement follow functionality
    console.log('Follow store');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // TODO: Filter products by tab
  };

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/50">Loading store...</div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/50">Store not found</div>
        </div>
      </div>
    );
  }

  // Calculate rating breakdown
  const ratingBreakdown = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <StorefrontHeader />
        <main className="flex flex-1 justify-center py-5 sm:px-4 md:px-8">
          <div className="layout-content-container flex flex-col w-full max-w-7xl gap-8">
            <StorefrontBanner />
            <StorefrontProfile
              storeName={store.name}
              storeDescription={store.description}
              logoUrl={store.logoUrl}
              isVerified={store.isVerified}
              onFollow={handleFollow}
            />

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 px-4">
              {/* Left Sidebar / Seller Info */}
              <aside className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-4 sm:gap-6">
                <SellerInfoCard
                  rating={store.rating}
                  reviewCount={store.reviewCount}
                  description={store.description}
                  productsSold={store.productsSold}
                  yearsOnPlatform={store.yearsOnPlatform}
                  followers={store.followers}
                />
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Tabs */}
                <ProductTabs activeTab={activeTab} onTabChange={handleTabChange} />

                {/* ToolBar */}
                <div className="flex justify-between items-center gap-2 py-3">
                  <div className="flex-1 max-w-sm">
                    <label className="flex flex-col min-w-40 !h-10">
                      <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                        <div className="text-[#90b8cb] flex border-none bg-[#223d49] items-center justify-center pl-4 rounded-l-lg border-r-0">
                          <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#223d49] focus:border-none h-full placeholder:text-[#90b8cb] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                          placeholder="Search in this store..."
                          value=""
                        />
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[#90b8cb] text-sm hidden sm:inline">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="form-select bg-[#223d49] border-none text-white rounded-lg h-10 text-sm focus:ring-primary focus:border-primary"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 pt-4">
                  {products.map((product) => (
                    <StorefrontProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      imageUrl={product.imageUrl}
                      platform={product.platform}
                      price={product.price}
                      currency={product.currency}
                      slug={product.slug}
                      variantId={product.variantId}
                    />
                  ))}
                  {products.length === 0 && (
                    <div className="col-span-full text-center text-white/50 py-8">No products found</div>
                  )}
                </div>

                {/* Customer Reviews Section */}
                <div className="mt-12">
                  <h3 className="text-white font-bold text-2xl mb-6 pb-3 border-b border-[#315768]">
                    Customer Reviews
                  </h3>
                  <div className="flex flex-col md:flex-row gap-8">
                    <ReviewSummary
                      rating={store.rating}
                      reviewCount={store.reviewCount}
                      ratingBreakdown={ratingBreakdown}
                    />
                    <div className="flex-1 space-y-6">
                      {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                      {reviews.length === 0 && (
                        <div className="text-center text-white/50 py-8">No reviews yet</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

