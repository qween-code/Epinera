-- Advanced Schema for Epinera Platform
-- Based on PRD.md comprehensive requirements

-- ============================================
-- ENUMS
-- ============================================

-- Escrow status enum
CREATE TYPE escrow_status AS ENUM (
  'initiated',
  'payment_held',
  'awaiting_delivery',
  'delivered',
  'confirmed',
  'completed',
  'disputed',
  'under_review',
  'expired',
  'auto_refund'
);

-- Delivery status enum
CREATE TYPE delivery_status AS ENUM (
  'pending',
  'processing',
  'delivered',
  'confirmed',
  'failed',
  'cancelled'
);

-- Product status enum
CREATE TYPE product_status AS ENUM (
  'draft',
  'active',
  'inactive',
  'sold_out',
  'suspended'
);

-- Delivery type enum
CREATE TYPE delivery_type AS ENUM (
  'instant',
  'email',
  'in_game_mail',
  'trade',
  'guild_invite',
  'manual'
);

-- Moderation status enum
CREATE TYPE moderation_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'flagged'
);

-- Event type enum for analytics
CREATE TYPE event_type AS ENUM (
  'page_view',
  'product_view',
  'add_to_cart',
  'purchase',
  'search',
  'click',
  'scroll',
  'video_play',
  'form_submit',
  'login',
  'signup'
);

-- Audit action enum
CREATE TYPE audit_action AS ENUM (
  'create',
  'update',
  'delete',
  'suspend',
  'verify',
  'refund',
  'data_export',
  'login',
  'logout',
  'permission_change'
);

-- Achievement tier enum
CREATE TYPE achievement_tier AS ENUM (
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond'
);

-- ============================================
-- WALLET SYSTEM
-- ============================================

-- Multi-currency wallet system
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  currency VARCHAR(3) NOT NULL,
  balance DECIMAL(12,2) DEFAULT 0 CHECK (balance >= 0),
  escrow_balance DECIMAL(12,2) DEFAULT 0 CHECK (escrow_balance >= 0),
  bonus_balance DECIMAL(12,2) DEFAULT 0 CHECK (bonus_balance >= 0),
  frozen_balance DECIMAL(12,2) DEFAULT 0 CHECK (frozen_balance >= 0),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, currency)
);

-- Wallet transactions
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal', 'payment', 'refund', 'bonus', 'fee'
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  reference_id UUID, -- Reference to order, payment, etc.
  reference_type VARCHAR(50), -- 'order', 'payment', 'refund', etc.
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ESCROW SYSTEM
-- ============================================

-- Escrow transactions
CREATE TABLE escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'TRY',
  status escrow_status NOT NULL DEFAULT 'initiated',
  delivery_window_hours INTEGER DEFAULT 24,
  dispute_window_hours INTEGER DEFAULT 72,
  auto_release_hours INTEGER DEFAULT 168,
  seller_confirmed BOOLEAN DEFAULT FALSE,
  buyer_confirmed BOOLEAN DEFAULT FALSE,
  expiry_time TIMESTAMPTZ,
  dispute_window_end TIMESTAMPTZ,
  auto_release_time TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DISPUTE RESOLUTION
-- ============================================

-- Disputes table
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  escrow_id UUID REFERENCES escrows(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dispute_type VARCHAR(50) NOT NULL, -- 'non_delivery', 'wrong_product', 'invalid_code', 'late_delivery', 'other'
  status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'under_review', 'resolved_buyer', 'resolved_seller', 'closed'
  buyer_claim TEXT,
  seller_response TEXT,
  evidence JSONB, -- Array of evidence URLs, screenshots, etc.
  ai_score DECIMAL(3,2), -- AI-generated dispute score (0-1)
  resolution VARCHAR(50), -- 'refund_buyer', 'favor_seller', 'partial_refund', 'no_action'
  resolved_by UUID REFERENCES profiles(id), -- Admin who resolved
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

-- Comprehensive review system
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- Seller being reviewed
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[], -- Review photos
  helpful_votes INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT TRUE,
  sentiment_score DECIMAL(3,2), -- AI sentiment analysis (-1 to 1)
  moderation_status moderation_status DEFAULT 'pending',
  moderated_by UUID REFERENCES profiles(id),
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Review helpful votes
CREATE TABLE review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- ============================================
-- GAMIFICATION SYSTEM
-- ============================================

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tier achievement_tier NOT NULL,
  icon_url TEXT,
  xp_reward INTEGER DEFAULT 0,
  badge_url TEXT,
  requirements JSONB, -- Achievement requirements
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  progress JSONB, -- Progress tracking
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User XP and levels
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  badges_count INTEGER DEFAULT 0,
  achievements_count INTEGER DEFAULT 0,
  reviews_written INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  total_earned DECIMAL(12,2) DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMUNITY FEATURES
-- ============================================

-- Forum categories
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_id UUID REFERENCES forum_categories(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum posts
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES forum_categories(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  moderation_status moderation_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum replies
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  moderation_status moderation_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFERRAL SYSTEM
-- ============================================

-- Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'rewarded'
  reward_amount DECIMAL(10,2) DEFAULT 0,
  reward_currency VARCHAR(3) DEFAULT 'TRY',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANALYTICS & TRACKING
-- ============================================

-- User events tracking
CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id UUID,
  event_type event_type NOT NULL,
  event_data JSONB NOT NULL,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS
-- ============================================

-- Comprehensive audit trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action_type audit_action NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  additional_context JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAMPAIGNS & GIVEAWAYS
-- ============================================

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50) NOT NULL, -- 'giveaway', 'discount', 'referral', 'stream'
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed', 'cancelled'
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  requirements JSONB,
  rewards JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Giveaway entries
CREATE TABLE giveaway_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_method VARCHAR(50) NOT NULL, -- 'chat_command', 'follow', 'purchase', 'referral'
  is_winner BOOLEAN DEFAULT FALSE,
  prize_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Wallet indexes
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_currency ON wallets(currency);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_status ON wallet_transactions(status);

-- Escrow indexes
CREATE INDEX idx_escrows_buyer_id ON escrows(buyer_id);
CREATE INDEX idx_escrows_seller_id ON escrows(seller_id);
CREATE INDEX idx_escrows_order_id ON escrows(order_id);
CREATE INDEX idx_escrows_status ON escrows(status);

-- Dispute indexes
CREATE INDEX idx_disputes_buyer_id ON disputes(buyer_id);
CREATE INDEX idx_disputes_seller_id ON disputes(seller_id);
CREATE INDEX idx_disputes_order_id ON disputes(order_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- Review indexes
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_moderation_status ON reviews(moderation_status);

-- Gamification indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);

-- Community indexes
CREATE INDEX idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_author_id ON forum_posts(author_id);
CREATE INDEX idx_forum_replies_post_id ON forum_replies(post_id);

-- Analytics indexes
CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_event_type ON user_events(event_type);
CREATE INDEX idx_user_events_created_at ON user_events(created_at);

-- Audit indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_entries ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded)
-- Wallets: Users can view their own wallets
CREATE POLICY "Users can view own wallets" ON wallets
  FOR SELECT USING (auth.uid() = user_id);

-- Wallet transactions: Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Reviews: Public can view approved reviews
CREATE POLICY "Public can view approved reviews" ON reviews
  FOR SELECT USING (moderation_status = 'approved');

-- User stats: Users can view their own stats
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Forum posts: Public can view approved posts
CREATE POLICY "Public can view approved posts" ON forum_posts
  FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = author_id);

