-- ============================================
-- WALLET SYSTEM
-- ============================================
-- Multi-currency wallet system

-- Multi-currency wallet system
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- Indexes
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX idx_wallets_currency ON public.wallets(currency);
CREATE INDEX idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_status ON public.wallet_transactions(status);

-- Comments
COMMENT ON TABLE public.wallets IS 'Multi-currency user wallets';
COMMENT ON TABLE public.wallet_transactions IS 'Wallet transaction history';

