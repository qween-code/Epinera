-- ============================================
-- ORDERS TABLES
-- ============================================
-- Orders and order items

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  status public.order_status DEFAULT 'pending',
  payment_status public.payment_status DEFAULT 'pending',
  payment_method public.payment_method,
  -- Checkout fields
  subtotal DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  delivery_info JSONB, -- Contact info, delivery preferences, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  delivery_status public.order_status DEFAULT 'pending',
  digital_content_delivered JSONB, -- Actual codes/items delivered
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_seller_id ON public.order_items(seller_id);
CREATE INDEX idx_order_items_variant_id ON public.order_items(variant_id);

-- Comments
COMMENT ON TABLE public.orders IS 'Customer orders';
COMMENT ON TABLE public.order_items IS 'Individual items within an order';
COMMENT ON COLUMN public.orders.discount_amount IS 'Discount amount applied to the order';
COMMENT ON COLUMN public.orders.tax_amount IS 'Tax amount for the order';
COMMENT ON COLUMN public.orders.shipping_address IS 'Shipping address information (JSONB)';
COMMENT ON COLUMN public.orders.billing_address IS 'Billing address information (JSONB)';
COMMENT ON COLUMN public.orders.notes IS 'Order notes or special instructions';
COMMENT ON COLUMN public.orders.subtotal IS 'Subtotal before discount and tax';

