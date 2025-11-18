-- ============================================
-- CATEGORIES TABLE
-- ============================================
-- Product categories with hierarchical support

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- Comments
COMMENT ON TABLE public.categories IS 'Product categories with hierarchical support';
COMMENT ON COLUMN public.categories.parent_id IS 'For sub-categories';

