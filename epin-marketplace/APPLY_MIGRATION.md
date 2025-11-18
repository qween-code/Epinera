# Migration Uygulama Talimatları

## Discount Code Fields Migration

Yeni oluşturulan migration dosyası: `supabase/migrations/20251202000001_add_discount_code_fields.sql`

### Yöntem 1: Supabase Dashboard SQL Editor (Önerilen)

1. Supabase Dashboard'a git: https://supabase.com/dashboard
2. Proje seç: `Epinera` (qioaeiqrwjcbbbavhack)
3. SQL Editor'e git
4. Aşağıdaki SQL'i çalıştır:

```sql
-- Add discount code fields to campaigns table
ALTER TABLE public.campaigns
ADD COLUMN IF NOT EXISTS code VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS valid_from TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS valid_until TIMESTAMPTZ;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaigns_code ON public.campaigns(code) WHERE code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON public.campaigns(campaign_type);

-- Add comments
COMMENT ON COLUMN public.campaigns.code IS 'Discount code (e.g., SAVE20, WELCOME10)';
COMMENT ON COLUMN public.campaigns.discount_percentage IS 'Percentage discount (e.g., 20.00 for 20%)';
COMMENT ON COLUMN public.campaigns.discount_amount IS 'Fixed amount discount';
COMMENT ON COLUMN public.campaigns.currency IS 'Currency for discount_amount';
COMMENT ON COLUMN public.campaigns.valid_from IS 'When discount code becomes valid';
COMMENT ON COLUMN public.campaigns.valid_until IS 'When discount code expires';
```

5. Migration history'yi güncelle (opsiyonel):

```sql
INSERT INTO supabase_migrations.schema_migrations (version, name, inserted_at)
VALUES ('20251202000001', 'add_discount_code_fields', NOW())
ON CONFLICT (version) DO NOTHING;
```

### Yöntem 2: Supabase CLI (Docker Gerekli)

Docker Desktop çalışıyorsa:

```bash
# Migration repair yap (eski migration'ları işaretle)
npx supabase migration repair --status applied 20251114135606 20251114140000 20251114171749 20251114174940 20251115184800 20251116000001 20251116000002 20251116194545 20251116195949 20251117000001 20251118000001 20251118000002 20251118000003 20251130000001 20251201000001

# Yeni migration'ı push et
npx supabase db push --linked
```

## Doğrulama

Migration başarılı olduktan sonra:

```sql
-- Campaigns tablosunda yeni kolonları kontrol et
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'campaigns'
  AND column_name IN ('code', 'discount_percentage', 'discount_amount', 'currency', 'valid_from', 'valid_until');

-- Index'leri kontrol et
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'campaigns'
  AND indexname IN ('idx_campaigns_code', 'idx_campaigns_type');
```

## Test Discount Code Oluşturma

Migration sonrası test discount code oluştur:

```sql
INSERT INTO public.campaigns (
  name,
  description,
  campaign_type,
  status,
  code,
  discount_percentage,
  currency,
  valid_from,
  valid_until
) VALUES (
  'Test Welcome Discount',
  '10% off for new users',
  'discount',
  'active',
  'WELCOME10',
  10.00,
  'USD',
  NOW(),
  NOW() + INTERVAL '30 days'
);
```

