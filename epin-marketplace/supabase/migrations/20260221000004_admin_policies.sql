-- Admin RLS policies for full access to all tables

-- Admin can view all products regardless of status
CREATE POLICY "Admins can view all products."
  ON public.products FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can update any product
CREATE POLICY "Admins can update any product."
  ON public.products FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can delete any product
CREATE POLICY "Admins can delete any product."
  ON public.products FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can view all orders
CREATE POLICY "Admins can view all orders."
  ON public.orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can update any order
CREATE POLICY "Admins can update any order."
  ON public.orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can view all order items
CREATE POLICY "Admins can view all order items."
  ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles."
  ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can update any profile
CREATE POLICY "Admins can update any profile."
  ON public.profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can manage categories
CREATE POLICY "Admins can insert categories."
  ON public.categories FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update categories."
  ON public.categories FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete categories."
  ON public.categories FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
