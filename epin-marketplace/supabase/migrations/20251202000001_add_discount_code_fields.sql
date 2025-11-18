-- Add discount code fields to campaigns table
-- This migration adds the discount code functionality to campaigns

ALTER TABLE public.campaigns
ADD COLUMN IF NOT EXISTS code VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS valid_from TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS valid_until TIMESTAMPTZ;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaigns_code ON public.campaigns(code) WHERE code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON public.campaigns(campaign_type);

-- Add comments
COMMENT ON COLUMN public.campaigns.code IS 'Discount code (e.g., SAVE20, WELCOME10)';
COMMENT ON COLUMN public.campaigns.discount_percentage IS 'Percentage discount (e.g., 20.00 for 20%)';
COMMENT ON COLUMN public.campaigns.discount_amount IS 'Fixed amount discount';
COMMENT ON COLUMN public.campaigns.currency IS 'Currency for discount_amount';
COMMENT ON COLUMN public.campaigns.valid_from IS 'When discount code becomes valid';
COMMENT ON COLUMN public.campaigns.valid_until IS 'When discount code expires';

