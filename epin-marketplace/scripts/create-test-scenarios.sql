-- Kapsamlı Test Senaryoları için Test Verileri
-- Bu script gerçek hayat senaryolarını test etmek için gerekli verileri oluşturur

-- ============================================
-- 1. TEST KAMPANYALARI (İndirim Kodları)
-- ============================================

-- WELCOME20 - %20 indirim, min $50, max 100 kullanım
INSERT INTO campaigns (
  id,
  name,
  description,
  campaign_type,
  status,
  code,
  discount_percentage,
  discount_amount,
  currency,
  min_purchase_amount,
  max_uses,
  current_uses,
  valid_from,
  valid_until,
  metadata
) VALUES (
  gen_random_uuid(),
  'Welcome Campaign - Test',
  'Yeni kullanıcılar için %20 indirim',
  'discount',
  'active',
  'WELCOME20',
  20,
  NULL,
  'USD',
  50.00,
  100,
  0,
  NOW(),
  NOW() + INTERVAL '30 days',
  '{"is_test": true, "description": "Test welcome campaign"}'::jsonb
) ON CONFLICT DO NOTHING;

-- FLASH30 - %30 flash sale, Steam kategorisi
INSERT INTO campaigns (
  id,
  name,
  description,
  campaign_type,
  status,
  code,
  discount_percentage,
  discount_amount,
  currency,
  valid_from,
  valid_until,
  metadata
) VALUES (
  gen_random_uuid(),
  'Flash Sale Steam - Test',
  'Steam ürünlerinde %30 indirim',
  'discount',
  'active',
  'FLASH30',
  30,
  NULL,
  'USD',
  NOW(),
  NOW() + INTERVAL '24 hours',
  '{"is_test": true, "category": "steam", "flash_sale": true}'::jsonb
) ON CONFLICT DO NOTHING;

-- BONUS10 - $10 sabit indirim
INSERT INTO campaigns (
  id,
  name,
  description,
  campaign_type,
  status,
  code,
  discount_percentage,
  discount_amount,
  currency,
  min_purchase_amount,
  max_uses,
  current_uses,
  valid_from,
  valid_until,
  metadata
) VALUES (
  gen_random_uuid(),
  'Bonus $10 - Test',
  '$10 sabit indirim kampanyası',
  'discount',
  'active',
  'BONUS10',
  NULL,
  10.00,
  'USD',
  25.00,
  50,
  0,
  NOW(),
  NOW() + INTERVAL '7 days',
  '{"is_test": true, "fixed_amount": true}'::jsonb
) ON CONFLICT DO NOTHING;

-- ============================================
-- 2. TEST GİVEAWAY KAMPANYALARI
-- ============================================

-- Live Stream Giveaway
INSERT INTO campaigns (
  id,
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
SELECT 
  gen_random_uuid(),
  p.id,
  'Live Stream Giveaway - Test',
  'Canlı yayın çekilişi',
  'giveaway',
  'active',
  NOW(),
  NOW() + INTERVAL '7 days',
  '{"entry_methods": ["follow", "share", "chat_command"]}'::jsonb,
  '{"prizes": [{"type": "wallet_credit", "amount": 100, "currency": "USD", "quantity": 1}]}'::jsonb,
  '{"is_test": true, "giveaway_type": "live_stream", "platform": "twitch"}'::jsonb
FROM profiles p
WHERE p.role = 'creator' AND p.email LIKE '%test%' OR p.email LIKE '%creator%'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Milestone Giveaway
INSERT INTO campaigns (
  id,
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
SELECT 
  gen_random_uuid(),
  p.id,
  'Milestone Giveaway - Test',
  '1000 follower milestone çekilişi',
  'giveaway',
  'active',
  NOW(),
  NOW() + INTERVAL '14 days',
  '{"milestone": 1000, "entry_methods": ["follow", "purchase"]}'::jsonb,
  '{"prizes": [{"type": "product", "product_id": null, "quantity": 5, "value": 20}]}'::jsonb,
  '{"is_test": true, "giveaway_type": "milestone", "milestone_count": 1000}'::jsonb
FROM profiles p
WHERE p.role = 'creator' AND (p.email LIKE '%test%' OR p.email LIKE '%creator%')
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. TEST REFERRAL KODLARI
-- ============================================

-- Test kullanıcıları için referral kodları oluştur
INSERT INTO referrals (
  user_id,
  referral_code,
  total_invites,
  successful_signups,
  total_rewards,
  metadata
)
SELECT 
  p.id,
  UPPER('REF' || SUBSTRING(p.id::text, 1, 8)),
  0,
  0,
  0.00,
  '{"is_test": true}'::jsonb
FROM profiles p
WHERE p.role = 'buyer' AND (p.email LIKE '%test%' OR p.email LIKE '%buyer%')
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. TEST ÜRÜNLER (Kampanyalara uygun)
-- ============================================

-- Steam Wallet ürünleri (Flash Sale için)
INSERT INTO products (
  id,
  title,
  slug,
  description,
  category_id,
  seller_id,
  base_price,
  currency,
  stock_quantity,
  image_url,
  metadata
)
SELECT 
  gen_random_uuid(),
  'Steam Wallet $50 - Test',
  'steam-wallet-50-test',
  'Steam Wallet $50 test ürünü',
  c.id,
  p.id,
  50.00,
  'USD',
  100,
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
  '{"is_test": true, "category": "steam"}'::jsonb
FROM categories c, profiles p
WHERE c.slug = 'steam' AND p.role = 'seller' AND (p.email LIKE '%test%' OR p.email LIKE '%seller%')
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. TEST WALLET BAKİYELERİ
-- ============================================

-- Test kullanıcıları için wallet'lar oluştur/güncelle
INSERT INTO wallets (
  user_id,
  currency,
  balance,
  escrow_balance,
  bonus_balance,
  frozen_balance
)
SELECT 
  p.id,
  'USD',
  100.00,  -- Başlangıç bakiyesi
  0.00,
  0.00,
  0.00
FROM profiles p
WHERE p.role = 'buyer' AND (p.email LIKE '%test%' OR p.email LIKE '%buyer%')
ON CONFLICT (user_id, currency) 
DO UPDATE SET 
  balance = wallets.balance + 100.00;

-- ============================================
-- 6. TEST ACHIEVEMENTS
-- ============================================

-- Test achievements
INSERT INTO achievements (
  id,
  name,
  description,
  icon_url,
  points_reward,
  badge_tier,
  requirements,
  metadata
) VALUES 
(
  gen_random_uuid(),
  'First Purchase - Test',
  'İlk alışverişinizi tamamlayın',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100',
  10,
  'bronze',
  '{"type": "purchase_count", "value": 1}'::jsonb,
  '{"is_test": true}'::jsonb
),
(
  gen_random_uuid(),
  'Power Buyer - Test',
  '10 alışveriş tamamlayın',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100',
  50,
  'silver',
  '{"type": "purchase_count", "value": 10}'::jsonb,
  '{"is_test": true}'::jsonb
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. NOTIFICATION TEMPLATES (Test için)
-- ============================================

-- Test bildirimleri için örnekler
-- (Notifications tablosu zaten var, burada sadece örnek)

-- ============================================
-- SONUÇ
-- ============================================

SELECT 
  'Test verileri başarıyla oluşturuldu!' as message,
  (SELECT COUNT(*) FROM campaigns WHERE metadata->>'is_test' = 'true') as test_campaigns,
  (SELECT COUNT(*) FROM referrals WHERE metadata->>'is_test' = 'true') as test_referrals,
  (SELECT COUNT(*) FROM wallets WHERE balance > 0) as wallets_with_balance;

