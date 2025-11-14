-- First, let's modify the existing products table to act as a "base product" or "template".
-- We will remove columns that are specific to a variant, like price and stock.
ALTER TABLE public.products DROP COLUMN price;
ALTER TABLE public.products DROP COLUMN currency;
ALTER TABLE public.products DROP COLUMN stock_quantity;
ALTER TABLE public.products ADD COLUMN slug TEXT UNIQUE; -- Add slug for URL friendly routes

-- Product Variants table
-- This table will hold the specific versions of a product (e.g., 850 VP, 1450 VP).
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., "850 VP", "1 Month Subscription"
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  stock_quantity INTEGER DEFAULT 0,
  status product_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attributes table (for reusable properties like "Instant Delivery", "TR Server")
CREATE TABLE public.attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL -- e.g., "Delivery Speed", "Region"
);

-- Linking attributes to product variants (many-to-many relationship)
-- This allows a variant to have multiple attributes (e.g., "Instant Delivery" and "TR Server").
CREATE TABLE public.product_variant_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL,
  attribute_id UUID REFERENCES public.attributes(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL, -- e.g., "Instant", "Turkey"
  UNIQUE(variant_id, attribute_id)
);

-- Indexes for performance
CREATE INDEX ON public.product_variants (product_id);
CREATE INDEX ON public.product_variant_attributes (variant_id);
CREATE INDEX ON public.product_variant_attributes (attribute_id);
CREATE INDEX ON public.products (slug); -- Index for the new slug column


-- Set up Row Level Security (RLS) for the new tables
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variant_attributes ENABLE ROW LEVEL SECURITY;

-- Policies for Product Variants
-- Anyone can view active variants
CREATE POLICY "Active product variants are viewable by everyone."
  ON public.product_variants FOR SELECT
  USING ( status = 'active' );

-- Sellers can manage their own product variants (complex join needed)
-- Note: This is a simplified policy. A more robust policy might use a function.
CREATE POLICY "Sellers can manage their own variants."
  ON public.product_variants FOR ALL
  USING ( auth.uid() IN (SELECT seller_id FROM public.products WHERE id = product_id) );

-- Policies for Attributes
-- Everyone can see all attributes.
CREATE POLICY "Attributes are public."
  ON public.attributes FOR SELECT
  USING ( true );

-- Policies for Variant Attributes
-- Everyone can see the attributes linked to a variant.
CREATE POLICY "Variant attributes are public."
  ON public.product_variant_attributes FOR SELECT
  USING ( true );
