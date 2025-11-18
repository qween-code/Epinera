-- Custom enum types for products
CREATE TYPE public.product_status AS ENUM ('active', 'inactive', 'draft', 'deleted');
CREATE TYPE public.delivery_type AS ENUM ('in_game_mail', 'trade', 'guild_invite', 'other');

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.categories(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON COLUMN public.categories.parent_id IS 'For sub-categories';

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  stock_quantity INTEGER DEFAULT 0,
  -- Game-specific metadata can be stored here
  digital_content JSONB,
  delivery_method delivery_type,
  average_delivery_time INTERVAL,
  status product_status DEFAULT 'draft',
  seo_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX ON public.products (seller_id);
CREATE INDEX ON public.products (category_id);

-- Set up Row Level Security (RLS) for new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for Categories
-- Anyone can view categories
CREATE POLICY "Public categories are viewable by everyone."
  ON public.categories FOR SELECT
  USING ( true );

-- Policies for Products
-- Anyone can view active products
CREATE POLICY "Active products are viewable by everyone."
  ON public.products FOR SELECT
  USING ( status = 'active' );

-- Sellers can view their own products regardless of status
CREATE POLICY "Sellers can view their own products."
  ON public.products FOR SELECT
  USING ( auth.uid() = seller_id );

-- Sellers can insert new products
CREATE POLICY "Sellers can create products."
  ON public.products FOR INSERT
  WITH CHECK ( auth.uid() = seller_id );

-- Sellers can update their own products
CREATE POLICY "Sellers can update their own products."
  ON public.products FOR UPDATE
  USING ( auth.uid() = seller_id );
