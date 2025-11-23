-- REAL WORLD DATA SEED - EPIN MARKETPLACE
-- This script populates the database with extensive, realistic data mirroring itemsatis/hesap.com.tr

-- 1. CLEANUP
TRUNCATE TABLE public.categories CASCADE;
TRUNCATE TABLE public.products CASCADE;
-- We assume profiles exist or will be created.

-- 2. ROOT CATEGORIES (GAMES/PLATFORMS)
INSERT INTO public.categories (id, name, slug) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Valorant', 'valorant'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'League of Legends', 'league-of-legends'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'CS2 (Counter-Strike 2)', 'cs2'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Knight Online', 'knight-online'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Metin2', 'metin2'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'PUBG Mobile', 'pubg-mobile'),
('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Google Play', 'google-play'),
('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'Netflix', 'netflix'),
('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'Spotify', 'spotify');

-- 3. SUB-CATEGORIES (ITEM TYPES)
-- Valorant
INSERT INTO public.categories (parent_id, name, slug) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Valorant Points (VP)', 'valorant-vp'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Valorant Hesap Satış', 'valorant-account'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Random Hesap', 'valorant-random');

-- LoL
INSERT INTO public.categories (parent_id, name, slug) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Riot Points (RP)', 'lol-rp'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'LoL Hesap Satış', 'lol-account'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Elo Boost', 'lol-boost');

-- Knight Online
INSERT INTO public.categories (parent_id, name, slug) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Gold Bar (GB)', 'ko-gb'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Cash / Npoints', 'ko-cash'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Ring (Karakter)', 'ko-ring');

-- PUBG Mobile
INSERT INTO public.categories (parent_id, name, slug) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Unknown Cash (UC)', 'pubg-uc'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'PUBG Hesap', 'pubg-account');

-- 4. CREATE A DUMMY SELLER PROFILE IF NOT EXISTS
-- We try to insert a profile. If it fails (due to missing auth.user fk), we assume one exists.
-- Since we cannot write to auth.users here easily, we will use a subquery to pick ANY existing profile.
-- If NO profile exists, this seed will fail to insert products.
-- Prerequisite: User must sign up at least once to populate products in a real scenario,
-- or we rely on existing data.

-- 5. INSERT PRODUCTS & VARIANTS
-- Logic: Insert Product -> Get ID -> Insert Variant (Required by Schema)

DO $$
DECLARE
  v_seller_id UUID;
  v_cat_id UUID;
  v_prod_id UUID;
BEGIN
  -- Attempt to get a seller ID.
  -- If no profiles exist, we cannot proceed.
  SELECT id INTO v_seller_id FROM public.profiles LIMIT 1;

  IF v_seller_id IS NOT NULL THEN

    -- PRODUCT 1: Valorant 115 VP
    SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'valorant-vp';

    INSERT INTO public.products (seller_id, category_id, title, description, price, stock_quantity, status, delivery_method, digital_content)
    VALUES (v_seller_id, v_cat_id, 'Valorant 115 VP (TR)', 'TR sunucularında geçerli 115 Valorant Points. Anında teslimat.', 25.00, 999, 'active', 'instant', '{"code": "VP-115-TEST-CODE"}'::jsonb)
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_variants (product_id, name, price, stock_quantity, status)
    VALUES (v_prod_id, 'Standard', 25.00, 999, 'active');


    -- PRODUCT 2: Valorant 1450 VP
    INSERT INTO public.products (seller_id, category_id, title, description, price, stock_quantity, status, delivery_method, digital_content)
    VALUES (v_seller_id, v_cat_id, 'Valorant 1450 VP (TR)', 'TR sunucularında geçerli 1450 Valorant Points.', 250.00, 999, 'active', 'instant', '{"code": "VP-1450-REAL-DEAL"}'::jsonb)
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_variants (product_id, name, price, stock_quantity, status)
    VALUES (v_prod_id, 'Standard', 250.00, 999, 'active');


    -- PRODUCT 3: Random Account
    SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'valorant-random';

    INSERT INTO public.products (seller_id, category_id, title, description, price, stock_quantity, status, delivery_method, digital_content)
    VALUES (v_seller_id, v_cat_id, 'Valorant Random Hesap (10-100 Skin)', '10 ile 100 arası skin garantili hesap.', 49.90, 50, 'active', 'manual', '{"account": "user:pass"}'::jsonb)
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_variants (product_id, name, price, stock_quantity, status)
    VALUES (v_prod_id, 'Standard', 49.90, 50, 'active');

    -- PRODUCT 4: LoL RP
    SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'lol-rp';

    INSERT INTO public.products (seller_id, category_id, title, description, price, stock_quantity, status, delivery_method, digital_content)
    VALUES (v_seller_id, v_cat_id, '850 RP (TR)', 'League of Legends 850 RP Kodu.', 140.00, 500, 'active', 'instant', '{"code": "RP-850-LEGEND"}'::jsonb)
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_variants (product_id, name, price, stock_quantity, status)
    VALUES (v_prod_id, 'Standard', 140.00, 500, 'active');

  END IF;
END $$;
