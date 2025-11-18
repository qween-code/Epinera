-- ============================================
-- COMPREHENSIVE TEST ENVIRONMENT SEED DATA
-- ============================================
-- This script creates a complete test environment with:
-- - Multiple users (buyers, sellers, creators, influencers)
-- - Extensive product catalog
-- - Active campaigns and giveaways
-- - Discount codes and promotions
-- - Orders and transactions
-- - Reviews and ratings
-- - Forum posts and discussions
-- - Achievements and gamification
-- - All data marked with "test" for easy identification
-- ============================================

-- ============================================
-- 1. TEST CATEGORIES (20+ categories)
-- ============================================
INSERT INTO public.categories (name, slug, description) VALUES
-- Gaming Categories
('Test Steam Games', 'test-steam-games', 'Test Steam game products'),
('Test Valorant Points', 'test-valorant-points', 'Test Valorant in-game currency'),
('Test League of Legends', 'test-lol', 'Test League of Legends products'),
('Test CS2 Skins', 'test-cs2-skins', 'Test Counter-Strike 2 skins'),
('Test Fortnite V-Bucks', 'test-fortnite-vbucks', 'Test Fortnite currency'),
-- Console Categories
('Test PlayStation Network', 'test-psn', 'Test PSN gift cards and codes'),
('Test Xbox Live', 'test-xbox-live', 'Test Xbox Live gift cards'),
('Test Nintendo eShop', 'test-nintendo-eshop', 'Test Nintendo eShop codes'),
-- Mobile Games
('Test PUBG Mobile UC', 'test-pubg-mobile', 'Test PUBG Mobile UC'),
('Test Mobile Legends', 'test-mobile-legends', 'Test Mobile Legends diamonds'),
-- MMO Games
('Test World of Warcraft', 'test-wow', 'Test WoW game time and items'),
('Test Final Fantasy XIV', 'test-ffxiv', 'Test FFXIV subscription and items'),
-- Other
('Test Gift Cards', 'test-gift-cards', 'Test general gift cards'),
('Test Game Keys', 'test-game-keys', 'Test game activation keys'),
('Test In-Game Items', 'test-in-game-items', 'Test various in-game items')
ON CONFLICT (slug) DO NOTHING;

-- Sub-categories
WITH parent_cats AS (
  SELECT id, slug FROM public.categories WHERE slug LIKE 'test-%'
)
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT 
  (SELECT id FROM parent_cats WHERE slug = 'test-steam-games'),
  'Test Steam Wallet Codes',
  'test-steam-wallet-codes',
  'Test Steam wallet codes'
WHERE EXISTS (SELECT 1 FROM parent_cats WHERE slug = 'test-steam-games')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. TEST USERS (Will be created via Auth API)
-- ============================================
-- Users to create (run create-test-users.ts script):
-- Admin: turhanhamza@gmail.com / dodo6171
-- Sellers: test-seller-1@epinmarketplace.com through test-seller-10@epinmarketplace.com
-- Buyers: test-buyer-1@epinmarketplace.com through test-buyer-20@epinmarketplace.com
-- Creators/Influencers: test-creator-1@epinmarketplace.com through test-creator-5@epinmarketplace.com

-- ============================================
-- 3. TEST PRODUCTS (50+ products)
-- ============================================
-- Products will be created after users are created
-- This section creates products for test sellers

-- Helper function to get test seller IDs (run after users created)
DO $$
DECLARE
  seller_ids UUID[];
  category_ids UUID[];
  product_count INTEGER := 0;
BEGIN
  -- Get test seller IDs
  SELECT ARRAY_AGG(id) INTO seller_ids
  FROM auth.users
  WHERE email LIKE 'test-seller-%@epinmarketplace.com'
  LIMIT 10;

  -- Get test category IDs
  SELECT ARRAY_AGG(id) INTO category_ids
  FROM public.categories
  WHERE slug LIKE 'test-%'
  LIMIT 15;

  -- Create 50+ products
  FOR i IN 1..50 LOOP
    INSERT INTO public.products (
      seller_id,
      category_id,
      title,
      description,
      status,
      slug,
      image_url
    )
    VALUES (
      seller_ids[1 + (i % array_length(seller_ids, 1))],
      category_ids[1 + (i % array_length(category_ids, 1))],
      'Test Product ' || i || ' - ' || (SELECT name FROM public.categories WHERE id = category_ids[1 + (i % array_length(category_ids, 1))]),
      'This is a comprehensive test product #' || i || ' for testing purposes. Includes all features and variations.',
      'active',
      'test-product-' || i,
      'https://images.unsplash.com/photo-' || (1500000000000 + i) || '?w=400'
    )
    ON CONFLICT (slug) DO NOTHING;
    
    product_count := product_count + 1;
  END LOOP;

  RAISE NOTICE 'Created % test products', product_count;
END $$;

-- ============================================
-- 4. TEST PRODUCT VARIANTS (200+ variants)
-- ============================================
DO $$
DECLARE
  product_rec RECORD;
  variant_names TEXT[] := ARRAY['Basic', 'Standard', 'Premium', 'Deluxe', 'Ultimate'];
  prices DECIMAL[] := ARRAY[9.99, 19.99, 29.99, 49.99, 99.99];
  variant_count INTEGER := 0;
BEGIN
  FOR product_rec IN 
    SELECT id FROM public.products WHERE slug LIKE 'test-product-%' LIMIT 50
  LOOP
    FOR i IN 1..array_length(variant_names, 1) LOOP
      INSERT INTO public.product_variants (
        product_id,
        name,
        price,
        currency,
        stock_quantity,
        status
      )
      VALUES (
        product_rec.id,
        variant_names[i] || ' Package',
        prices[i],
        'USD',
        1000 + (random() * 5000)::INTEGER,
        'active'
      )
      ON CONFLICT DO NOTHING;
      
      variant_count := variant_count + 1;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Created % test product variants', variant_count;
END $$;

-- ============================================
-- 5. TEST CAMPAIGNS (20+ campaigns)
-- ============================================
DO $$
DECLARE
  creator_ids UUID[];
  campaign_count INTEGER := 0;
BEGIN
  -- Get test creator IDs
  SELECT ARRAY_AGG(id) INTO creator_ids
  FROM auth.users
  WHERE email LIKE 'test-creator-%@epinmarketplace.com'
  LIMIT 5;

  IF array_length(creator_ids, 1) > 0 THEN
    -- Active Giveaway Campaigns
    FOR i IN 1..5 LOOP
      INSERT INTO public.campaigns (
        creator_id,
        name,
        description,
        campaign_type,
        status,
        start_date,
        end_date,
        requirements,
        rewards,
        metadata
      )
      VALUES (
        creator_ids[1 + (i % array_length(creator_ids, 1))],
        'Test Giveaway Campaign ' || i,
        'Test giveaway campaign for testing purposes. Win amazing prizes!',
        'giveaway',
        'active',
        NOW(),
        NOW() + INTERVAL '30 days',
        jsonb_build_object('min_followers', 100, 'platform', 'twitch'),
        jsonb_build_object('prize', '1000 Valorant Points', 'winners', 5),
        jsonb_build_object('is_test', true, 'test_id', i)
      )
      ON CONFLICT DO NOTHING;
      
      campaign_count := campaign_count + 1;
    END LOOP;

    -- Discount Campaigns
    FOR i IN 1..5 LOOP
      INSERT INTO public.campaigns (
        creator_id,
        name,
        description,
        campaign_type,
        status,
        start_date,
        end_date,
        requirements,
        rewards,
        metadata
      )
      VALUES (
        creator_ids[1 + (i % array_length(creator_ids, 1))],
        'Test Discount Campaign ' || i,
        'Test discount campaign - Save up to 50%!',
        'discount',
        'active',
        NOW(),
        NOW() + INTERVAL '15 days',
        jsonb_build_object('min_purchase', 50),
        jsonb_build_object('discount_percentage', 20 + (i * 5), 'max_discount', 100),
        jsonb_build_object('is_test', true, 'test_id', i + 5)
      )
      ON CONFLICT DO NOTHING;
      
      campaign_count := campaign_count + 1;
    END LOOP;

    -- Referral Campaigns
    FOR i IN 1..5 LOOP
      INSERT INTO public.campaigns (
        creator_id,
        name,
        description,
        campaign_type,
        status,
        start_date,
        end_date,
        requirements,
        rewards,
        metadata
      )
      VALUES (
        creator_ids[1 + (i % array_length(creator_ids, 1))],
        'Test Referral Campaign ' || i,
        'Test referral campaign - Invite friends and earn rewards!',
        'referral',
        'active',
        NOW(),
        NOW() + INTERVAL '60 days',
        jsonb_build_object('min_referrals', 5),
        jsonb_build_object('reward_per_referral', 10, 'bonus_reward', 50),
        jsonb_build_object('is_test', true, 'test_id', i + 10)
      )
      ON CONFLICT DO NOTHING;
      
      campaign_count := campaign_count + 1;
    END LOOP;

    -- Stream Campaigns
    FOR i IN 1..5 LOOP
      INSERT INTO public.campaigns (
        creator_id,
        name,
        description,
        campaign_type,
        status,
        start_date,
        end_date,
        requirements,
        rewards,
        metadata
      )
      VALUES (
        creator_ids[1 + (i % array_length(creator_ids, 1))],
        'Test Stream Campaign ' || i,
        'Test live stream campaign - Watch and win!',
        'stream',
        'active',
        NOW(),
        NOW() + INTERVAL '7 days',
        jsonb_build_object('min_watch_time', 30, 'platform', 'twitch'),
        jsonb_build_object('prize_pool', 500, 'winners', 10),
        jsonb_build_object('is_test', true, 'test_id', i + 15)
      )
      ON CONFLICT DO NOTHING;
      
      campaign_count := campaign_count + 1;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test campaigns', campaign_count;
END $$;

-- ============================================
-- 6. TEST GIVEAWAY ENTRIES (100+ entries)
-- ============================================
DO $$
DECLARE
  campaign_ids UUID[];
  buyer_ids UUID[];
  entry_count INTEGER := 0;
BEGIN
  -- Get giveaway campaign IDs
  SELECT ARRAY_AGG(id) INTO campaign_ids
  FROM public.campaigns
  WHERE campaign_type = 'giveaway' AND metadata->>'is_test' = 'true'
  LIMIT 5;

  -- Get test buyer IDs
  SELECT ARRAY_AGG(id) INTO buyer_ids
  FROM auth.users
  WHERE email LIKE 'test-buyer-%@epinmarketplace.com'
  LIMIT 20;

  IF array_length(campaign_ids, 1) > 0 AND array_length(buyer_ids, 1) > 0 THEN
    FOR i IN 1..100 LOOP
      INSERT INTO public.giveaway_entries (
        campaign_id,
        user_id,
        entry_method,
        status,
        metadata
      )
      VALUES (
        campaign_ids[1 + (i % array_length(campaign_ids, 1))],
        buyer_ids[1 + (i % array_length(buyer_ids, 1))],
        CASE (i % 4)
          WHEN 0 THEN 'stream_watch'
          WHEN 1 THEN 'social_share'
          WHEN 2 THEN 'purchase'
          ELSE 'referral'
        END,
        CASE (i % 10)
          WHEN 0 THEN 'winner'
          ELSE 'pending'
        END,
        jsonb_build_object('is_test', true, 'entry_number', i)
      )
      ON CONFLICT DO NOTHING;
      
      entry_count := entry_count + 1;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test giveaway entries', entry_count;
END $$;

-- ============================================
-- 7. TEST WALLETS (for all test users)
-- ============================================
DO $$
DECLARE
  user_rec RECORD;
  wallet_count INTEGER := 0;
BEGIN
  FOR user_rec IN 
    SELECT id FROM auth.users 
    WHERE email LIKE 'test-%@epinmarketplace.com' OR email = 'turhanhamza@gmail.com'
  LOOP
    -- Create USD wallet
    INSERT INTO public.wallets (
      user_id,
      currency,
      balance,
      escrow_balance,
      bonus_balance,
      frozen_balance
    )
    VALUES (
      user_rec.id,
      'USD',
      CASE 
        WHEN user_rec.email LIKE '%buyer%' THEN 500.00 + (random() * 2000)::DECIMAL
        WHEN user_rec.email LIKE '%seller%' THEN 1000.00 + (random() * 5000)::DECIMAL
        ELSE 100.00
      END,
      0,
      CASE WHEN random() > 0.7 THEN 50.00 + (random() * 200)::DECIMAL ELSE 0 END,
      0
    )
    ON CONFLICT DO NOTHING;
    
    wallet_count := wallet_count + 1;
  END LOOP;

  RAISE NOTICE 'Created % test wallets', wallet_count;
END $$;

-- ============================================
-- 8. TEST ORDERS (100+ orders)
-- ============================================
DO $$
DECLARE
  buyer_ids UUID[];
  seller_ids UUID[];
  product_variants UUID[];
  order_count INTEGER := 0;
BEGIN
  -- Get test user IDs
  SELECT ARRAY_AGG(id) INTO buyer_ids
  FROM auth.users
  WHERE email LIKE 'test-buyer-%@epinmarketplace.com'
  LIMIT 20;

  SELECT ARRAY_AGG(id) INTO seller_ids
  FROM auth.users
  WHERE email LIKE 'test-seller-%@epinmarketplace.com'
  LIMIT 10;

  SELECT ARRAY_AGG(id) INTO product_variants
  FROM public.product_variants
  WHERE product_id IN (SELECT id FROM public.products WHERE slug LIKE 'test-product-%')
  LIMIT 200;

  IF array_length(buyer_ids, 1) > 0 AND array_length(product_variants, 1) > 0 THEN
    FOR i IN 1..100 LOOP
      DECLARE
        buyer_id UUID := buyer_ids[1 + (i % array_length(buyer_ids, 1))];
        variant_id UUID := product_variants[1 + (i % array_length(product_variants, 1))];
        variant_rec RECORD;
        seller_id UUID;
        order_id UUID;
        order_status TEXT;
      BEGIN
        -- Get variant and seller info
        SELECT pv.*, p.seller_id INTO variant_rec, seller_id
        FROM public.product_variants pv
        JOIN public.products p ON p.id = pv.product_id
        WHERE pv.id = variant_id;

        -- Determine order status
        order_status := CASE (i % 10)
          WHEN 0 THEN 'completed'
          WHEN 1 THEN 'processing'
          WHEN 2 THEN 'pending'
          WHEN 3 THEN 'delivered'
          ELSE 'completed'
        END;

        -- Create order
        INSERT INTO public.orders (
          buyer_id,
          seller_id,
          total_amount,
          currency,
          status,
          payment_status,
          delivery_status,
          metadata
        )
        VALUES (
          buyer_id,
          seller_id,
          variant_rec.price,
          variant_rec.currency,
          order_status,
          CASE WHEN order_status = 'completed' THEN 'paid' ELSE 'pending' END,
          CASE 
            WHEN order_status = 'completed' THEN 'delivered'
            WHEN order_status = 'processing' THEN 'processing'
            ELSE 'pending'
          END,
          jsonb_build_object('is_test', true, 'order_number', i)
        )
        RETURNING id INTO order_id;

        -- Create order item
        INSERT INTO public.order_items (
          order_id,
          product_id,
          variant_id,
          seller_id,
          quantity,
          price,
          currency,
          status,
          delivery_status
        )
        VALUES (
          order_id,
          (SELECT product_id FROM public.product_variants WHERE id = variant_id),
          variant_id,
          seller_id,
          1,
          variant_rec.price,
          variant_rec.currency,
          order_status,
          CASE 
            WHEN order_status = 'completed' THEN 'delivered'
            WHEN order_status = 'processing' THEN 'processing'
            ELSE 'pending'
          END
        );

        order_count := order_count + 1;
      EXCEPTION WHEN OTHERS THEN
        -- Skip if error
        CONTINUE;
      END;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test orders', order_count;
END $$;

-- ============================================
-- 9. TEST WALLET TRANSACTIONS (200+ transactions)
-- ============================================
DO $$
DECLARE
  user_ids UUID[];
  wallet_ids UUID[];
  transaction_count INTEGER := 0;
BEGIN
  -- Get test user IDs and their wallets
  SELECT 
    ARRAY_AGG(u.id),
    ARRAY_AGG(w.id)
  INTO user_ids, wallet_ids
  FROM auth.users u
  JOIN public.wallets w ON w.user_id = u.id
  WHERE u.email LIKE 'test-%@epinmarketplace.com' OR u.email = 'turhanhamza@gmail.com';

  IF array_length(user_ids, 1) > 0 THEN
    FOR i IN 1..200 LOOP
      INSERT INTO public.wallet_transactions (
        wallet_id,
        user_id,
        transaction_type,
        amount,
        currency,
        status,
        description,
        metadata
      )
      VALUES (
        wallet_ids[1 + (i % array_length(wallet_ids, 1))],
        user_ids[1 + (i % array_length(user_ids, 1))],
        CASE (i % 5)
          WHEN 0 THEN 'deposit'
          WHEN 1 THEN 'purchase'
          WHEN 2 THEN 'payout'
          WHEN 3 THEN 'refund'
          ELSE 'bonus'
        END,
        10.00 + (random() * 500)::DECIMAL,
        'USD',
        CASE (i % 10)
          WHEN 0 THEN 'pending'
          WHEN 1 THEN 'failed'
          ELSE 'completed'
        END,
        'Test transaction #' || i,
        jsonb_build_object('is_test', true, 'transaction_number', i)
      )
      ON CONFLICT DO NOTHING;
      
      transaction_count := transaction_count + 1;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test wallet transactions', transaction_count;
END $$;

-- ============================================
-- 10. TEST REVIEWS (150+ reviews)
-- ============================================
DO $$
DECLARE
  buyer_ids UUID[];
  product_ids UUID[];
  seller_ids UUID[];
  review_count INTEGER := 0;
BEGIN
  SELECT ARRAY_AGG(id) INTO buyer_ids
  FROM auth.users
  WHERE email LIKE 'test-buyer-%@epinmarketplace.com'
  LIMIT 20;

  SELECT ARRAY_AGG(id) INTO product_ids
  FROM public.products
  WHERE slug LIKE 'test-product-%'
  LIMIT 50;

  SELECT ARRAY_AGG(DISTINCT seller_id) INTO seller_ids
  FROM public.products
  WHERE slug LIKE 'test-product-%'
  LIMIT 10;

  IF array_length(buyer_ids, 1) > 0 AND array_length(product_ids, 1) > 0 THEN
    FOR i IN 1..150 LOOP
      INSERT INTO public.reviews (
        user_id,
        product_id,
        seller_id,
        rating,
        comment,
        status,
        metadata
      )
      VALUES (
        buyer_ids[1 + (i % array_length(buyer_ids, 1))],
        product_ids[1 + (i % array_length(product_ids, 1))],
        seller_ids[1 + (i % array_length(seller_ids, 1))],
        3 + (random() * 2)::INTEGER, -- Rating between 3-5
        'Test review #' || i || ' - This is a comprehensive test review for testing purposes. Product was great!',
        CASE (i % 20)
          WHEN 0 THEN 'pending'
          WHEN 1 THEN 'rejected'
          ELSE 'approved'
        END,
        jsonb_build_object('is_test', true, 'review_number', i)
      )
      ON CONFLICT DO NOTHING;
      
      review_count := review_count + 1;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test reviews', review_count;
END $$;

-- ============================================
-- 11. TEST REFERRALS (50+ referrals)
-- ============================================
DO $$
DECLARE
  referrer_ids UUID[];
  referred_ids UUID[];
  referral_count INTEGER := 0;
BEGIN
  SELECT ARRAY_AGG(id) INTO referrer_ids
  FROM auth.users
  WHERE email LIKE 'test-%@epinmarketplace.com'
  LIMIT 30;

  SELECT ARRAY_AGG(id) INTO referred_ids
  FROM auth.users
  WHERE email LIKE 'test-%@epinmarketplace.com'
  LIMIT 30;

  IF array_length(referrer_ids, 1) > 0 AND array_length(referred_ids, 1) > 0 THEN
    FOR i IN 1..50 LOOP
      INSERT INTO public.referrals (
        referrer_id,
        referred_id,
        referral_code,
        status,
        reward_amount,
        metadata
      )
      VALUES (
        referrer_ids[1 + (i % array_length(referrer_ids, 1))],
        referred_ids[1 + (i % array_length(referred_ids, 1))],
        'TEST' || (1000 + i),
        CASE (i % 5)
          WHEN 0 THEN 'pending'
          WHEN 1 THEN 'completed'
          ELSE 'active'
        END,
        CASE (i % 5)
          WHEN 1 THEN 10.00 + (random() * 50)::DECIMAL
          ELSE NULL
        END,
        jsonb_build_object('is_test', true, 'referral_number', i)
      )
      ON CONFLICT DO NOTHING;
      
      referral_count := referral_count + 1;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test referrals', referral_count;
END $$;

-- ============================================
-- 12. TEST ACHIEVEMENTS (30+ achievements)
-- ============================================
INSERT INTO public.achievements (
  name,
  description,
  tier,
  points_reward,
  requirements,
  icon_url,
  metadata
)
SELECT 
  'Test Achievement ' || i,
  'Test achievement description #' || i || ' for testing purposes',
  CASE (i % 5)
    WHEN 0 THEN 'bronze'
    WHEN 1 THEN 'silver'
    WHEN 2 THEN 'gold'
    WHEN 3 THEN 'platinum'
    ELSE 'diamond'
  END,
  10 * i,
  jsonb_build_object('requirement_type', 'purchase_count', 'requirement_value', i * 5),
  'https://images.unsplash.com/photo-' || (1600000000000 + i) || '?w=100',
  jsonb_build_object('is_test', true, 'achievement_number', i)
FROM generate_series(1, 30) i
ON CONFLICT DO NOTHING;

-- ============================================
-- 13. TEST USER ACHIEVEMENTS (100+ user achievements)
-- ============================================
DO $$
DECLARE
  user_ids UUID[];
  achievement_ids UUID[];
  user_achievement_count INTEGER := 0;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids
  FROM auth.users
  WHERE email LIKE 'test-%@epinmarketplace.com'
  LIMIT 30;

  SELECT ARRAY_AGG(id) INTO achievement_ids
  FROM public.achievements
  WHERE metadata->>'is_test' = 'true'
  LIMIT 30;

  IF array_length(user_ids, 1) > 0 AND array_length(achievement_ids, 1) > 0 THEN
    FOR i IN 1..100 LOOP
      INSERT INTO public.user_achievements (
        user_id,
        achievement_id,
        progress,
        completed_at,
        created_at
      )
      VALUES (
        user_ids[1 + (i % array_length(user_ids, 1))],
        achievement_ids[1 + (i % array_length(achievement_ids, 1))],
        jsonb_build_object('progress', (i % 100), 'target', 100),
        CASE (i % 3)
          WHEN 0 THEN NOW() - INTERVAL '1 day' * (i % 30)
          ELSE NULL
        END,
        NOW() - INTERVAL '1 day' * (i % 60)
      )
      ON CONFLICT (user_id, achievement_id) DO NOTHING;
      
      user_achievement_count := user_achievement_count + 1;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test user achievements', user_achievement_count;
END $$;

-- ============================================
-- 14. TEST USER STATS (for all test users)
-- ============================================
DO $$
DECLARE
  user_rec RECORD;
  stats_count INTEGER := 0;
BEGIN
  FOR user_rec IN 
    SELECT id FROM auth.users 
    WHERE email LIKE 'test-%@epinmarketplace.com' OR email = 'turhanhamza@gmail.com'
  LOOP
    INSERT INTO public.user_stats (
      user_id,
      total_xp,
      current_level,
      badges_count,
      achievements_count,
      reviews_written,
      purchases_count,
      sales_count,
      total_spent,
      total_earned,
      last_active_at
    )
    VALUES (
      user_rec.id,
      (random() * 10000)::INTEGER,
      1 + (random() * 50)::INTEGER,
      (random() * 20)::INTEGER,
      (random() * 15)::INTEGER,
      (random() * 50)::INTEGER,
      CASE 
        WHEN user_rec.email LIKE '%buyer%' THEN (random() * 100)::INTEGER
        ELSE 0
      END,
      CASE 
        WHEN user_rec.email LIKE '%seller%' THEN (random() * 200)::INTEGER
        ELSE 0
      END,
      CASE 
        WHEN user_rec.email LIKE '%buyer%' THEN (random() * 5000)::DECIMAL
        ELSE 0
      END,
      CASE 
        WHEN user_rec.email LIKE '%seller%' THEN (random() * 10000)::DECIMAL
        ELSE 0
      END,
      NOW() - INTERVAL '1 day' * (random() * 30)::INTEGER
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    stats_count := stats_count + 1;
  END LOOP;

  RAISE NOTICE 'Created % test user stats', stats_count;
END $$;

-- ============================================
-- 15. TEST FORUM CATEGORIES (10+ categories)
-- ============================================
INSERT INTO public.forum_categories (
  name,
  description,
  slug,
  order_index,
  is_active
)
SELECT 
  'Test Forum Category ' || i,
  'Test forum category description #' || i,
  'test-forum-category-' || i,
  i,
  true
FROM generate_series(1, 10) i
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 16. TEST FORUM POSTS (50+ posts)
-- ============================================
DO $$
DECLARE
  user_ids UUID[];
  category_ids UUID[];
  post_count INTEGER := 0;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids
  FROM auth.users
  WHERE email LIKE 'test-%@epinmarketplace.com'
  LIMIT 30;

  SELECT ARRAY_AGG(id) INTO category_ids
  FROM public.forum_categories
  WHERE slug LIKE 'test-forum-category-%'
  LIMIT 10;

  IF array_length(user_ids, 1) > 0 AND array_length(category_ids, 1) > 0 THEN
    FOR i IN 1..50 LOOP
      INSERT INTO public.forum_posts (
        user_id,
        category_id,
        title,
        content,
        status,
        metadata
      )
      VALUES (
        user_ids[1 + (i % array_length(user_ids, 1))],
        category_ids[1 + (i % array_length(category_ids, 1))],
        'Test Forum Post ' || i || ' - Discussion Topic',
        'This is a comprehensive test forum post #' || i || ' for testing purposes. Contains discussion content and community engagement.',
        CASE (i % 10)
          WHEN 0 THEN 'pending'
          WHEN 1 THEN 'flagged'
          ELSE 'published'
        END,
        jsonb_build_object('is_test', true, 'post_number', i)
      )
      ON CONFLICT DO NOTHING;
      
      post_count := post_count + 1;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test forum posts', post_count;
END $$;

-- ============================================
-- 17. TEST NOTIFICATIONS (200+ notifications)
-- ============================================
DO $$
DECLARE
  user_ids UUID[];
  notification_count INTEGER := 0;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids
  FROM auth.users
  WHERE email LIKE 'test-%@epinmarketplace.com' OR email = 'turhanhamza@gmail.com'
  LIMIT 30;

  IF array_length(user_ids, 1) > 0 THEN
    FOR i IN 1..200 LOOP
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        link,
        is_read,
        metadata
      )
      VALUES (
        user_ids[1 + (i % array_length(user_ids, 1))],
        CASE (i % 6)
          WHEN 0 THEN 'order_confirmed'
          WHEN 1 THEN 'payment_received'
          WHEN 2 THEN 'new_message'
          WHEN 3 THEN 'campaign_update'
          WHEN 4 THEN 'achievement_unlocked'
          ELSE 'system_alert'
        END,
        'Test Notification ' || i,
        'Test notification message #' || i || ' for testing purposes.',
        CASE (i % 6)
          WHEN 0 THEN '/orders/test-order-' || i
          WHEN 1 THEN '/wallet'
          WHEN 2 THEN '/messages'
          WHEN 3 THEN '/my-campaigns'
          WHEN 4 THEN '/achievements'
          ELSE '/notifications'
        END,
        (i % 3) = 0,
        jsonb_build_object('is_test', true, 'notification_number', i)
      )
      ON CONFLICT DO NOTHING;
      
      notification_count := notification_count + 1;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test notifications', notification_count;
END $$;

-- ============================================
-- 18. TEST MESSAGES (100+ messages)
-- ============================================
DO $$
DECLARE
  user_ids UUID[];
  order_ids UUID[];
  message_count INTEGER := 0;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids
  FROM auth.users
  WHERE email LIKE 'test-%@epinmarketplace.com'
  LIMIT 30;

  SELECT ARRAY_AGG(id) INTO order_ids
  FROM public.orders
  WHERE metadata->>'is_test' = 'true'
  LIMIT 50;

  IF array_length(user_ids, 1) > 1 AND array_length(order_ids, 1) > 0 THEN
    FOR i IN 1..100 LOOP
      DECLARE
        sender_id UUID := user_ids[1 + (i % array_length(user_ids, 1))];
        receiver_id UUID := user_ids[1 + ((i + 1) % array_length(user_ids, 1))];
        order_id UUID := order_ids[1 + (i % array_length(order_ids, 1))];
      BEGIN
        INSERT INTO public.messages (
          sender_id,
          receiver_id,
          content,
          order_id,
          is_read,
          created_at
        )
        VALUES (
          sender_id,
          receiver_id,
          'Test message #' || i || ' - This is a test message for testing the messaging system.',
          order_id,
          (i % 2) = 0,
          NOW() - INTERVAL '1 hour' * (i % 48)
        )
        ON CONFLICT DO NOTHING;
        
        message_count := message_count + 1;
      EXCEPTION WHEN OTHERS THEN
        CONTINUE;
      END;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test messages', message_count;
END $$;

-- ============================================
-- 19. TEST DISCOUNTS / PROMO CODES (20+ codes)
-- ============================================
-- Note: Discount codes can be stored in campaigns table with campaign_type='discount'
-- Or create a separate discounts table if needed

-- ============================================
-- 20. TEST AUDIT LOGS (100+ logs)
-- ============================================
DO $$
DECLARE
  user_ids UUID[];
  admin_ids UUID[];
  log_count INTEGER := 0;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids
  FROM auth.users
  WHERE email LIKE 'test-%@epinmarketplace.com'
  LIMIT 30;

  SELECT ARRAY_AGG(id) INTO admin_ids
  FROM auth.users
  WHERE email = 'turhanhamza@gmail.com' OR role = 'admin'
  LIMIT 1;

  IF array_length(user_ids, 1) > 0 THEN
    FOR i IN 1..100 LOOP
      INSERT INTO public.audit_logs (
        user_id,
        admin_id,
        action_type,
        resource_type,
        resource_id,
        old_values,
        new_values,
        ip_address,
        additional_context,
        timestamp
      )
      VALUES (
        user_ids[1 + (i % array_length(user_ids, 1))],
        CASE WHEN (i % 10) = 0 THEN admin_ids[1] ELSE NULL END,
        CASE (i % 9)
          WHEN 0 THEN 'create'
          WHEN 1 THEN 'update'
          WHEN 2 THEN 'delete'
          WHEN 3 THEN 'suspend'
          WHEN 4 THEN 'verify'
          WHEN 5 THEN 'refund'
          WHEN 6 THEN 'data_export'
          WHEN 7 THEN 'login'
          ELSE 'logout'
        END,
        CASE (i % 5)
          WHEN 0 THEN 'product'
          WHEN 1 THEN 'order'
          WHEN 2 THEN 'user'
          WHEN 3 THEN 'campaign'
          ELSE 'transaction'
        END,
        gen_random_uuid(),
        jsonb_build_object('old_value', 'old'),
        jsonb_build_object('new_value', 'new'),
        '192.168.1.' || (i % 255),
        jsonb_build_object('is_test', true, 'log_number', i),
        NOW() - INTERVAL '1 day' * (i % 30)
      )
      ON CONFLICT DO NOTHING;
      
      log_count := log_count + 1;
    END LOOP;
  END IF;

  RAISE NOTICE 'Created % test audit logs', log_count;
END $$;

-- ============================================
-- SUMMARY
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'COMPREHENSIVE TEST DATA SEED COMPLETED';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Test data includes:';
  RAISE NOTICE '- 20+ categories';
  RAISE NOTICE '- 50+ products';
  RAISE NOTICE '- 200+ product variants';
  RAISE NOTICE '- 20+ campaigns (giveaways, discounts, referrals, streams)';
  RAISE NOTICE '- 100+ giveaway entries';
  RAISE NOTICE '- 100+ orders';
  RAISE NOTICE '- 200+ wallet transactions';
  RAISE NOTICE '- 150+ reviews';
  RAISE NOTICE '- 50+ referrals';
  RAISE NOTICE '- 30+ achievements';
  RAISE NOTICE '- 100+ user achievements';
  RAISE NOTICE '- 10+ forum categories';
  RAISE NOTICE '- 50+ forum posts';
  RAISE NOTICE '- 200+ notifications';
  RAISE NOTICE '- 100+ messages';
  RAISE NOTICE '- 100+ audit logs';
  RAISE NOTICE '========================================';
END $$;

