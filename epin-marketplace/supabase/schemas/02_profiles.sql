-- ============================================
-- PROFILES TABLE
-- ============================================
-- User profiles extending auth.users

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT UNIQUE,
  role public.user_role NOT NULL DEFAULT 'buyer',
  kyc_status public.kyc_status NOT NULL DEFAULT 'not_started',

  CONSTRAINT phone_length CHECK (
    phone IS NULL OR char_length(phone) >= 10
  )
);

-- Indexes
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_kyc_status ON public.profiles(kyc_status);

-- Comments
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN public.profiles.role IS 'User role: buyer, seller, creator, or admin';
COMMENT ON COLUMN public.profiles.kyc_status IS 'KYC verification status';

