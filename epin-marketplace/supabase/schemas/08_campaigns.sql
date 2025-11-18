-- ============================================
-- CAMPAIGNS & GIVEAWAYS
-- ============================================

-- Campaigns
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50) NOT NULL, -- 'giveaway', 'discount', 'referral', 'stream'
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed', 'cancelled'
  -- Discount code fields (for campaign_type='discount')
  code VARCHAR(50) UNIQUE, -- Discount code (e.g., 'SAVE20', 'WELCOME10')
  discount_percentage DECIMAL(5,2), -- Percentage discount (e.g., 20.00 for 20%)
  discount_amount DECIMAL(10,2), -- Fixed amount discount
  currency VARCHAR(3) DEFAULT 'USD', -- Currency for discount_amount
  valid_from TIMESTAMPTZ, -- When discount code becomes valid
  valid_until TIMESTAMPTZ, -- When discount code expires
  -- Campaign timing
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  -- Flexible data
  requirements JSONB,
  rewards JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Giveaway entries
CREATE TABLE public.giveaway_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entry_method VARCHAR(50) NOT NULL, -- 'chat_command', 'follow', 'purchase', 'referral'
  is_winner BOOLEAN DEFAULT FALSE,
  prize_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

-- Referrals
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'rewarded'
  reward_amount DECIMAL(10,2) DEFAULT 0,
  reward_currency VARCHAR(3) DEFAULT 'TRY',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_campaigns_creator_id ON public.campaigns(creator_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_code ON public.campaigns(code) WHERE code IS NOT NULL;
CREATE INDEX idx_campaigns_type ON public.campaigns(campaign_type);
CREATE INDEX idx_giveaway_entries_campaign_id ON public.giveaway_entries(campaign_id);
CREATE INDEX idx_giveaway_entries_user_id ON public.giveaway_entries(user_id);
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON public.referrals(referred_id);

-- Comments
COMMENT ON TABLE public.campaigns IS 'Marketing campaigns and giveaways';
COMMENT ON TABLE public.giveaway_entries IS 'User entries in giveaway campaigns';
COMMENT ON TABLE public.referrals IS 'Referral system tracking';

