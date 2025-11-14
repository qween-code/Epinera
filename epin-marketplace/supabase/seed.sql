-- This script will be run automatically by Supabase when the database is reset.
-- It's a great place to add some initial data for development.

-- Main Game Categories
INSERT INTO public.categories (name, slug) VALUES
('Valorant', 'valorant'),
('League of Legends', 'league-of-legends'),
('Knight Online', 'knight-online'),
('PUBG Mobile', 'pubg-mobile'),
('Steam', 'steam');

-- Example Sub-categories for Steam
-- Let's get the ID of the 'Steam' category first
WITH steam_cat AS (
  SELECT id FROM public.categories WHERE slug = 'steam'
)
INSERT INTO public.categories (parent_id, name, slug) VALUES
((SELECT id FROM steam_cat), 'Steam Cüzdan Kodu', 'steam-wallet-code'),
((SELECT id FROM steam_cat), 'Steam Oyunları', 'steam-games');

-- Example Sub-categories for Knight Online
WITH ko_cat AS (
  SELECT id FROM public.categories WHERE slug = 'knight-online'
)
INSERT INTO public.categories (parent_id, name, slug) VALUES
((SELECT id FROM ko_cat), 'Gold Bar', 'knight-online-gb'),
((SELECT id FROM ko_cat), 'Cash (NPoints)', 'knight-online-cash');

-- You can add more seed data for products and variants here as well
-- For now, we will keep it to categories.

INSERT INTO public.products (seller_id, category_id, title, description, status, slug)
SELECT
  (SELECT id FROM auth.users LIMIT 1), -- Assign to the first user as a placeholder seller
  c.id,
  'Valorant Points (VP)',
  'Tüm sunucularda geçerli Valorant Points.',
  'active',
  'valorant-points'
FROM public.categories c WHERE c.slug = 'valorant';

INSERT INTO public.product_variants (product_id, name, price, stock_quantity, status)
SELECT
  p.id,
  '850 VP',
  150.00,
  100,
  'active'
FROM public.products p WHERE p.slug = 'valorant-points';

INSERT INTO public.product_variants (product_id, name, price, stock_quantity, status)
SELECT
  p.id,
  '1450 VP',
  250.00,
  100,
  'active'
FROM public.products p WHERE p.slug = 'valorant-points';
