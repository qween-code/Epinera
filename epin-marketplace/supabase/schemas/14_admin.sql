-- ============================================
-- ADMIN & SECURITY TABLES
-- ============================================

-- Escrow transactions
CREATE TABLE public.escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'TRY',
  status public.escrow_status NOT NULL DEFAULT 'initiated',
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

-- Disputes table
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  escrow_id UUID REFERENCES public.escrows(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dispute_type VARCHAR(50) NOT NULL, -- 'non_delivery', 'wrong_product', 'invalid_code', 'late_delivery', 'other'
  status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'under_review', 'resolved_buyer', 'resolved_seller', 'closed'
  buyer_claim TEXT,
  seller_response TEXT,
  evidence JSONB, -- Array of evidence URLs, screenshots, etc.
  ai_score DECIMAL(3,2), -- AI-generated dispute score (0-1)
  resolution VARCHAR(50), -- 'refund_buyer', 'favor_seller', 'partial_refund', 'no_action'
  resolved_by UUID REFERENCES public.profiles(id), -- Admin who resolved
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comprehensive audit trail
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type public.audit_action NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  additional_context JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  -- Alternative structure from production tables
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_type VARCHAR(20) NOT NULL, -- 'user', 'admin', 'system'
  action VARCHAR(100) NOT NULL,
  metadata JSONB
);

-- Security Alerts Table
CREATE TABLE public.security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.wallet_transactions(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- 'error', 'warning', 'info'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'info', -- 'critical', 'warning', 'info'
  status VARCHAR(20) NOT NULL DEFAULT 'unacknowledged', -- 'unacknowledged', 'acknowledged', 'resolved'
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Reviews Table
CREATE TABLE public.risk_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_id VARCHAR(50),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'blocked', 'cleared'
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Alerts Table
CREATE TABLE public.system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity VARCHAR(20) NOT NULL, -- 'critical', 'warning', 'info'
  alert_name VARCHAR(255) NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'unacknowledged', -- 'unacknowledged', 'acknowledged', 'resolved'
  acknowledged_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Conversations Table
CREATE TABLE public.support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open', -- 'open', 'closed'
  handled_by VARCHAR(20) NOT NULL DEFAULT 'ai', -- 'ai', 'agent'
  last_message TEXT,
  last_message_time TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gamification System
-- Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tier public.achievement_tier NOT NULL,
  icon_url TEXT,
  xp_reward INTEGER DEFAULT 0,
  badge_url TEXT,
  requirements JSONB, -- Achievement requirements
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress JSONB, -- Progress tracking
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User XP and levels
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- Indexes
CREATE INDEX idx_escrows_buyer_id ON public.escrows(buyer_id);
CREATE INDEX idx_escrows_seller_id ON public.escrows(seller_id);
CREATE INDEX idx_escrows_order_id ON public.escrows(order_id);
CREATE INDEX idx_escrows_status ON public.escrows(status);
CREATE INDEX idx_disputes_buyer_id ON public.disputes(buyer_id);
CREATE INDEX idx_disputes_seller_id ON public.disputes(seller_id);
CREATE INDEX idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX idx_disputes_status ON public.disputes(status);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_type ON public.audit_logs(action_type);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_security_alerts_user_id ON public.security_alerts(user_id);
CREATE INDEX idx_security_alerts_transaction_id ON public.security_alerts(transaction_id);
CREATE INDEX idx_security_alerts_type ON public.security_alerts(type);
CREATE INDEX idx_security_alerts_status ON public.security_alerts(status);
CREATE INDEX idx_security_alerts_created_at ON public.security_alerts(created_at DESC);
CREATE INDEX idx_risk_reviews_user_id ON public.risk_reviews(user_id);
CREATE INDEX idx_risk_reviews_status ON public.risk_reviews(status);
CREATE INDEX idx_risk_reviews_risk_score ON public.risk_reviews(risk_score DESC);
CREATE INDEX idx_risk_reviews_created_at ON public.risk_reviews(created_at DESC);
CREATE INDEX idx_system_alerts_severity ON public.system_alerts(severity);
CREATE INDEX idx_system_alerts_status ON public.system_alerts(status);
CREATE INDEX idx_system_alerts_created_at ON public.system_alerts(created_at DESC);
CREATE INDEX idx_support_conversations_user_id ON public.support_conversations(user_id);
CREATE INDEX idx_support_conversations_status ON public.support_conversations(status);
CREATE INDEX idx_support_conversations_created_at ON public.support_conversations(created_at DESC);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_stats_user_id ON public.user_stats(user_id);

-- Comments
COMMENT ON TABLE public.escrows IS 'Escrow transactions for order payments';
COMMENT ON TABLE public.disputes IS 'Order disputes between buyers and sellers';
COMMENT ON TABLE public.audit_logs IS 'Comprehensive audit trail';
COMMENT ON TABLE public.security_alerts IS 'Security alerts for users';
COMMENT ON TABLE public.risk_reviews IS 'Risk assessment reviews';
COMMENT ON TABLE public.system_alerts IS 'System-wide alerts';
COMMENT ON TABLE public.support_conversations IS 'Customer support conversations';
COMMENT ON TABLE public.achievements IS 'Gamification achievements';
COMMENT ON TABLE public.user_achievements IS 'User achievement progress';
COMMENT ON TABLE public.user_stats IS 'User statistics and XP';

