-- Custom enum types for orders
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'refunded');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE public.payment_method AS ENUM ('credit_card', 'paypal', 'bank_transfer', 'crypto');

-- Cart table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, variant_id)
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  payment_method payment_method,
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
  delivery_status order_status DEFAULT 'pending',
  digital_content_delivered JSONB, -- Actual codes/items delivered
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX ON public.cart_items (user_id);
CREATE INDEX ON public.cart_items (variant_id);
CREATE INDEX ON public.orders (buyer_id);
CREATE INDEX ON public.orders (status);
CREATE INDEX ON public.order_items (order_id);
CREATE INDEX ON public.order_items (seller_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Cart Policies
-- Users can view their own cart items
CREATE POLICY "Users can view their own cart."
  ON public.cart_items FOR SELECT
  USING ( auth.uid() = user_id );

-- Users can insert items into their own cart
CREATE POLICY "Users can add to their own cart."
  ON public.cart_items FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Users can update their own cart items
CREATE POLICY "Users can update their own cart."
  ON public.cart_items FOR UPDATE
  USING ( auth.uid() = user_id );

-- Users can delete from their own cart
CREATE POLICY "Users can delete from their own cart."
  ON public.cart_items FOR DELETE
  USING ( auth.uid() = user_id );

-- Orders Policies
-- Buyers can view their own orders
CREATE POLICY "Buyers can view their own orders."
  ON public.orders FOR SELECT
  USING ( auth.uid() = buyer_id );

-- Buyers can create orders
CREATE POLICY "Buyers can create orders."
  ON public.orders FOR INSERT
  WITH CHECK ( auth.uid() = buyer_id );

-- Buyers can update their pending orders
CREATE POLICY "Buyers can update their pending orders."
  ON public.orders FOR UPDATE
  USING ( auth.uid() = buyer_id AND status = 'pending' );

-- Order Items Policies
-- Buyers can view their order items
CREATE POLICY "Buyers can view their order items."
  ON public.order_items FOR SELECT
  USING ( auth.uid() IN (SELECT buyer_id FROM public.orders WHERE id = order_id) );

-- Sellers can view order items they need to fulfill
CREATE POLICY "Sellers can view their order items."
  ON public.order_items FOR SELECT
  USING ( auth.uid() = seller_id );

-- Sellers can update their order items (for delivery)
CREATE POLICY "Sellers can update their order items."
  ON public.order_items FOR UPDATE
  USING ( auth.uid() = seller_id );

-- Function to update cart item timestamp
CREATE OR REPLACE FUNCTION public.update_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cart_items_update_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cart_updated_at();
