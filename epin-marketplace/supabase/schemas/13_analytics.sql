-- ============================================
-- ANALYTICS & TRACKING
-- ============================================

-- User events tracking
CREATE TABLE public.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id UUID,
  event_type public.event_type NOT NULL,
  event_data JSONB NOT NULL,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX idx_user_events_created_at ON public.user_events(created_at);

-- Comments
COMMENT ON TABLE public.user_events IS 'User behavior tracking and analytics';

