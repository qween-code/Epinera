-- Test Environment Seed Data
-- This script seeds test data for development and testing purposes
-- All test data includes "test" in the name or description

-- ============================================
-- 1. ADMIN USER CREATION
-- ============================================
-- Admin user will be created via Supabase Auth UI or CLI
-- Email: turhanhamza@gmail.com
-- Password: dodo6171
-- Role: admin (set in profiles.metadata)

-- ============================================
-- 2. TEST CATEGORIES
-- ============================================
INSERT INTO public.categories (name, slug, description) VALUES
('Test Gaming Category', 'test-gaming', 'Test category for gaming products'),
('Test Digital Goods', 'test-digital-goods', 'Test category for digital goods'),
('Test Gift Cards', 'test-gift-cards', 'Test category for gift cards')
ON CONFLICT (slug) DO NOTHING;

-- Test Sub-categories
WITH test_gaming AS (
  SELECT id FROM public.categories WHERE slug = 'test-gaming'
)
INSERT INTO public.categories (parent_id, name, slug, description) VALUES
((SELECT id FROM test_gaming), 'Test Steam Wallet', 'test-steam-wallet', 'Test Steam wallet codes'),
((SELECT id FROM test_gaming), 'Test Valorant Points', 'test-valorant-points', 'Test Valorant points')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. TEST USERS (via auth.users - will be created via Supabase Auth)
-- ============================================
-- Note: Users should be created via Supabase Auth API
-- Test users to create:
-- 1. Admin: turhanhamza@gmail.com / dodo6171
-- 2. Test Seller: test-seller@epinmarketplace.com / test123456
-- 3. Test Buyer: test-buyer@epinmarketplace.com / test123456
-- 4. Test Creator: test-creator@epinmarketplace.com / test123456

-- ============================================
-- 4. TEST PROFILES
-- ============================================
-- Profiles will be created automatically via trigger when users sign up
-- Or manually after user creation:

-- Example profile update for admin user (run after user creation):
-- UPDATE public.profiles 
-- SET 
--   full_name = 'Test Admin User',
--   role = 'admin',
--   metadata = jsonb_build_object('is_admin', true, 'is_test', true)
-- WHERE email = 'turhanhamza@gmail.com';

-- ============================================
-- 5. TEST PRODUCTS
-- ============================================
-- Test products with "test" in title
INSERT INTO public.products (seller_id, category_id, title, description, status, slug, image_url)
SELECT
  (SELECT id FROM auth.users WHERE email = 'test-seller@epinmarketplace.com' LIMIT 1),
  c.id,
  'Test Steam Wallet Code - $20',
  'Test Steam wallet code for testing purposes. This is a test product.',
  'active',
  'test-steam-wallet-20',
  'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400'
FROM public.categories c WHERE c.slug = 'test-steam-wallet'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (seller_id, category_id, title, description, status, slug, image_url)
SELECT
  (SELECT id FROM auth.users WHERE email = 'test-seller@epinmarketplace.com' LIMIT 1),
  c.id,
  'Test Valorant Points - 1000 VP',
  'Test Valorant points for testing purposes. This is a test product.',
  'active',
  'test-valorant-points-1000',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400'
FROM public.categories c WHERE c.slug = 'test-valorant-points'
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 6. TEST PRODUCT VARIANTS
-- ============================================
INSERT INTO public.product_variants (product_id, name, price, currency, stock_quantity, status)
SELECT
  p.id,
  'Test $20 Steam Code',
  20.00,
  'USD',
  1000,
  'active'
FROM public.products p WHERE p.slug = 'test-steam-wallet-20'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_variants (product_id, name, price, currency, stock_quantity, status)
SELECT
  p.id,
  'Test 1000 VP',
  10.00,
  'USD',
  1000,
  'active'
FROM public.products p WHERE p.slug = 'test-valorant-points-1000'
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. TEST WALLETS
-- ============================================
-- Wallets will be created automatically when users make their first transaction
-- Or manually:

-- Test wallet for test buyer
-- INSERT INTO public.wallets (user_id, currency, balance, escrow_balance, bonus_balance, frozen_balance)
-- SELECT
--   id,
--   'USD',
--   1000.00, -- Test balance
--   0,
--   0,
--   0
-- FROM auth.users WHERE email = 'test-buyer@epinmarketplace.com'
-- ON CONFLICT DO NOTHING;

-- ============================================
-- 8. TEST CAMPAIGNS
-- ============================================
INSERT INTO public.campaigns (
  creator_id,
  title,
  description,
  campaign_type,
  status,
  budget,
  start_date,
  end_date,
  metadata
)
SELECT
  (SELECT id FROM auth.users WHERE email = 'test-creator@epinmarketplace.com' LIMIT 1),
  'Test Campaign - Summer Sale',
  'Test campaign for summer sale testing',
  'promotion',
  'active',
  1000.00,
  NOW(),
  NOW() + INTERVAL '30 days',
  jsonb_build_object('is_test', true, 'test_environment', true)
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'test-creator@epinmarketplace.com')
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. TEST NOTIFICATIONS
-- ============================================
INSERT INTO public.notifications (user_id, type, title, message, link, is_read, metadata)
SELECT
  id,
  'order_confirmed',
  'Test Order Confirmed',
  'Your test order has been confirmed. This is a test notification.',
  '/orders/test-order-id',
  false,
  jsonb_build_object('is_test', true)
FROM auth.users WHERE email = 'test-buyer@epinmarketplace.com'
LIMIT 5
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. TEST REVIEWS
-- ============================================
INSERT INTO public.reviews (
  user_id,
  product_id,
  seller_id,
  rating,
  comment,
  status,
  metadata
)
SELECT
  (SELECT id FROM auth.users WHERE email = 'test-buyer@epinmarketplace.com' LIMIT 1),
  p.id,
  p.seller_id,
  5,
  'Test review - Great test product!',
  'approved',
  jsonb_build_object('is_test', true)
FROM public.products p WHERE p.slug LIKE 'test-%'
LIMIT 2
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTES
-- ============================================
-- 1. Admin user must be created via Supabase Auth UI or CLI first
-- 2. Test users should be created via Supabase Auth API
-- 3. All test data includes "test" in name, slug, or description
-- 4. Test data can be easily identified and cleaned up
-- 5. Run this script after migrations and user creation

