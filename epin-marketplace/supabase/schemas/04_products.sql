-- ============================================
-- PRODUCTS TABLES
-- ============================================
-- Products, product variants, attributes, and variant attributes

-- Products table (base product/template)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  image_url TEXT,
  -- Game-specific metadata
  digital_content JSONB,
  delivery_method public.delivery_type,
  average_delivery_time INTERVAL,
  status public.product_status DEFAULT 'draft',
  seo_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Variants table
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., "850 VP", "1 Month Subscription"
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  stock_quantity INTEGER DEFAULT 0,
  status public.product_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attributes table (for reusable properties)
CREATE TABLE public.attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL -- e.g., "Delivery Speed", "Region"
);

-- Linking attributes to product variants (many-to-many)
CREATE TABLE public.product_variant_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL,
  attribute_id UUID REFERENCES public.attributes(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL, -- e.g., "Instant", "Turkey"
  UNIQUE(variant_id, attribute_id)
);

-- Indexes
CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_image_url ON public.products(image_url) WHERE image_url IS NOT NULL;
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variant_attributes_variant_id ON public.product_variant_attributes(variant_id);
CREATE INDEX idx_product_variant_attributes_attribute_id ON public.product_variant_attributes(attribute_id);

-- Comments
COMMENT ON TABLE public.products IS 'Base product templates';
COMMENT ON TABLE public.product_variants IS 'Specific product variants with pricing and stock';
COMMENT ON TABLE public.attributes IS 'Reusable product attributes';
COMMENT ON TABLE public.product_variant_attributes IS 'Many-to-many relationship between variants and attributes';
COMMENT ON COLUMN public.products.image_url IS 'URL of the product image';

