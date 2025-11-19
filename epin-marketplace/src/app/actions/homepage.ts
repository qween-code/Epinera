'use server';

import { createClient } from '@/utils/supabase/server';

// Get categories for homepage
export async function getHomepageCategories() {
  const supabase = await createClient();
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .is('parent_id', null)
    .order('name', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories || [];
}

// Get flash deals (active campaigns with products)
export async function getFlashDeals() {
  const supabase = await createClient();
  
  const now = new Date().toISOString();
  
  // Get active discount campaigns (if campaigns table exists)
  let campaigns = [];
  try {
    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, name, description, discount_percentage, discount_amount, end_date, metadata')
      .eq('campaign_type', 'discount')
      .eq('status', 'active')
      .lte('start_date', now)
      .gte('end_date', now)
      .order('end_date', { ascending: true })
      .limit(5);

    if (campaignsError && campaignsError.code !== 'PGRST205') {
      // Only log non-table-not-found errors
      console.error('Error fetching campaigns:', campaignsError);
    }
    
    campaigns = campaignsData || [];
  } catch (error: any) {
    // Table doesn't exist, continue without campaigns
    if (error?.code !== 'PGRST205') {
      console.error('Error fetching campaigns:', error);
    }
  }

  // Get products associated with these campaigns
  // For now, we'll get featured products with discounts
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      id,
      title,
      slug,
      product_variants (
        id,
        name,
        price,
        currency
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(10);

  if (productsError) {
    console.error('Error fetching products:', productsError);
    return [];
  }

  // Try to get image_url separately if column exists
  let productsWithImages: any[] = [];
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
    } catch (error) {
      // image_url column doesn't exist, use products without images
      productsWithImages = products.map(p => ({ ...p, image_url: null }));
    }
  }

  // Combine campaigns with products
  const productsToUse = productsWithImages.length > 0 ? productsWithImages : (products || []);
  const deals = productsToUse.slice(0, 2).map((product, index) => {
    const variant = product.product_variants?.[0];
    const campaign = campaigns?.[index % campaigns.length];
    
    if (!variant) return null;

    const originalPrice = parseFloat(variant.price.toString());
    let discountedPrice = originalPrice;
    
    if (campaign) {
      if (campaign.discount_percentage) {
        discountedPrice = originalPrice * (1 - campaign.discount_percentage / 100);
      } else if (campaign.discount_amount) {
        discountedPrice = Math.max(0, originalPrice - parseFloat(campaign.discount_amount.toString()));
      }
    }

    // Calculate time left until campaign end
    const endDate = campaign?.end_date ? new Date(campaign.end_date) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    const timeLeft = endDate.getTime() - Date.now();
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    const timeLeftStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      platform: variant.name,
      price: discountedPrice,
      originalPrice: originalPrice,
      image: product.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      timeLeft: timeLeftStr,
    };
  }).filter(Boolean);

  return deals;
}

// Get AI recommendations (featured products)
export async function getAIRecommendations() {
  const supabase = await createClient();
  
  // First get products without image_url to avoid column error
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      slug,
      product_variants (
        id,
        name,
        price,
        currency
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }

  // Try to get image_url separately if column exists
  let productsWithImages: any[] = [];
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
      productsWithImages = products.map(p => ({ ...p, image_url: null }));
    }
  }

  return productsWithImages.map((product) => {
    const variant = product.product_variants?.[0];
    if (!variant) return null;

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: parseFloat(variant.price.toString()),
      currency: variant.currency || 'USD',
      image: product.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
      aiRecommended: Math.random() > 0.7, // Random for now, can be improved with ML
    };
  }).filter(Boolean);
}

// Get community feed (recent forum posts and reviews)
export async function getCommunityFeed() {
  const supabase = await createClient();
  
  // Get recent forum posts
  const { data: posts, error: postsError } = await supabase
    .from('forum_posts')
    .select(`
      id,
      title,
      content,
      created_at,
      profiles!forum_posts_author_id_fkey (
        full_name,
        avatar_url
      )
    `)
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get recent reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select(`
      id,
      comment,
      created_at,
      products!reviews_product_id_fkey (
        title,
        slug
      ),
      profiles!reviews_reviewer_id_fkey (
        full_name,
        avatar_url
      )
    `)
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })
    .limit(5);

  const feedItems = [];

  // Add posts to feed
  if (posts && !postsError) {
    posts.forEach((post: any) => {
      feedItems.push({
        id: `post-${post.id}`,
        type: 'post',
        user: post.profiles?.full_name || 'Anonymous',
        action: 'started a new discussion',
        target: '',
        excerpt: post.content?.substring(0, 100) || post.title,
        time: post.created_at, // Store timestamp for sorting
        timeAgo: getTimeAgo(post.created_at),
        avatar: post.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        link: `/community/post/${post.id}`,
      });
    });
  }

  // Add reviews to feed
  if (reviews && !reviewsError) {
    reviews.forEach((review: any) => {
      feedItems.push({
        id: `review-${review.id}`,
        type: 'review',
        user: review.profiles?.full_name || 'Anonymous',
        action: 'just reviewed',
        target: review.products?.title || 'a product',
        excerpt: review.comment?.substring(0, 100) || '',
        time: review.created_at, // Store timestamp for sorting
        timeAgo: getTimeAgo(review.created_at),
        avatar: review.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        link: review.products?.slug ? `/product/${review.products.slug}` : '#',
      });
    });
  }

  // Sort by created_at timestamp (most recent first)
  return feedItems
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .map(item => ({
      ...item,
      time: item.timeAgo || item.time, // Use timeAgo for display
    }))
    .slice(0, 5);
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const then = new Date(dateString);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

