-- Custom enum type for order status
CREATE TYPE public.order_status AS ENUM ('pending_payment', 'processing', 'completed', 'failed', 'refunded', 'disputed');

-- Orders table to store overall order information
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  status order_status DEFAULT 'pending_payment',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table to store individual items within an order
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_per_item DECIMAL(10, 2) NOT NULL, -- Price at the time of purchase
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX ON public.orders (user_id);
CREATE INDEX ON public.order_items (order_id);
CREATE INDEX ON public.order_items (variant_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies for Orders
-- Users can view their own orders
CREATE POLICY "Users can view their own orders."
  ON public.orders FOR SELECT
  USING ( auth.uid() = user_id );

-- Users can create orders for themselves
CREATE POLICY "Users can create their own orders."
  ON public.orders FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Policies for Order Items
-- Users can view items belonging to their own orders
CREATE POLICY "Users can view items in their own orders."
  ON public.order_items FOR SELECT
  USING ( auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_id) );

-- Users can insert items into their own orders
CREATE POLICY "Users can insert items into their own orders."
  ON public.order_items FOR INSERT
  WITH CHECK ( auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_id) );
