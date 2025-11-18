# Supabase CLI ve Stripe CLI Workflow

Bu döküman, Supabase CLI ve Stripe CLI kullanarak projeyi geliştirme ve test etme sürecini açıklar.

## 📋 Mevcut Durum

### ✅ Tamamlanan İşlemler

1. **Database Alignment**
   - Tüm database işlemleri declarative schema ile uyumlu
   - Cart operations düzeltildi
   - Wallet transactions düzeltildi
   - Discount codes schema hazır

2. **Migration Hazırlığı**
   - `20251202000001_add_discount_code_fields.sql` oluşturuldu
   - Migration remote'a push edilmeyi bekliyor

3. **Stripe Integration**
   - Webhook handler hazır (`src/app/api/webhooks/stripe/route.ts`)
   - Payment intent creation hazır
   - Test senaryoları hazır

## 🚀 Hemen Yapılacaklar

### 1. Migration Uygulama (Supabase)

**Yöntem: Supabase Dashboard SQL Editor (Önerilen)**

1. https://supabase.com/dashboard → Proje: `Epinera`
2. SQL Editor'e git
3. `APPLY_MIGRATION.md` dosyasındaki SQL'i çalıştır

**Alternatif: Migration Repair + Push (Docker Gerekli)**

```bash
# Eski migration'ları işaretle
npx supabase migration repair --status applied 20251114135606 20251114140000 20251114171749 20251114174940 20251115184800 20251116000001 20251116000002 20251116194545 20251116195949 20251117000001 20251118000001 20251118000002 20251118000003 20251130000001 20251201000001

# Yeni migration'ı push et
npx supabase db push --linked
```

### 2. Stripe CLI Kurulumu

**Windows Kurulum:**

```powershell
# Otomatik kurulum script'i çalıştır
powershell -ExecutionPolicy Bypass -File scripts/setup-stripe-cli.ps1

# Veya manuel:
# 1. https://github.com/stripe/stripe-cli/releases
# 2. Windows x86_64 ZIP indir
# 3. Aç ve stripe.exe'yi PATH'e ekle
```

**Login:**

```bash
stripe login
# Tarayıcı açılacak, Stripe hesabınıza login olun
```

### 3. Test Senaryolarını Çalıştırma

**Stripe Test Senaryoları:**

```powershell
# Test script'i çalıştır
powershell -ExecutionPolicy Bypass -File scripts/run-stripe-tests.ps1
```

**Manuel Test:**

```bash
# 1. Payment Intent oluştur
stripe payment_intents create --amount=5000 --currency=usd --description="Test deposit 50 USD"

# 2. Customer oluştur
stripe customers create --email="test@epinmarketplace.com"

# 3. Webhook event trigger
stripe trigger payment_intent.succeeded

# 4. Webhook listener (ayrı terminal)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 🧪 Kapsamlı Test Senaryoları

### Senaryo 1: Bakiye Yükleme ve Satın Alma

1. **Development server başlat:**
   ```bash
   npm run dev
   ```

2. **Webhook listener başlat (yeni terminal):**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **Tarayıcıda test:**
   - `/wallet/deposit` sayfasına git
   - 50 USD seç
   - Test kartı kullan: `4242 4242 4242 4242`
   - CVV: `123`, Expiry: `12/34`
   - Ödeme yap

4. **Doğrulama:**
   - Supabase'de `wallet_transactions` tablosunda transaction görünmeli
   - `wallets.balance` artmalı
   - Webhook log'larında `payment_intent.succeeded` görünmeli

### Senaryo 2: Discount Code ile Satın Alma

1. **Test discount code oluştur (Supabase SQL Editor):**
   ```sql
   INSERT INTO public.campaigns (
     name, description, campaign_type, status,
     code, discount_percentage, currency,
     valid_from, valid_until
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

2. **Sepete ürün ekle ve checkout:**
   - Ürün seç
   - Sepete ekle
   - Checkout sayfasında discount code: `WELCOME10`
   - %10 indirim uygulanmalı

### Senaryo 3: Seller Payout

1. **Seller olarak login:**
   - Test seller hesabı: `test-seller-001@epinmarketplace.com`

2. **Payout iste:**
   - `/seller/wallet` sayfasına git
   - Payout amount: 100 USD
   - Payout request oluştur

3. **Stripe Transfer (test):**
   ```bash
   # Test transfer oluştur (webhook trigger)
   stripe trigger transfer.paid
   ```

## 📊 Monitoring ve Debugging

### Supabase Logs

```bash
# Supabase project logs
npx supabase projects list
# Dashboard'dan logs görüntüle
```

### Stripe Logs

```bash
# Stripe events görüntüle
stripe events list --limit=10

# Specific event detayı
stripe events retrieve <event_id>
```

### Webhook Debugging

```bash
# Webhook listener verbose mode
stripe listen --forward-to localhost:3000/api/webhooks/stripe --print-json

# Webhook test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger transfer.created
stripe trigger transfer.paid
```

## 🔧 Troubleshooting

### Migration Push Hatası

**Problem:** "Remote migration versions not found in local migrations directory"

**Çözüm:**
1. Migration repair yap (yukarıdaki komut)
2. Veya migration'ı doğrudan SQL Editor'de çalıştır

### Stripe CLI Bulunamıyor

**Problem:** `stripe: command not found`

**Çözüm:**
1. `scripts/setup-stripe-cli.ps1` çalıştır
2. Veya manuel PATH'e ekle
3. Yeni terminal aç

### Webhook Çalışmıyor

**Problem:** Webhook events gelmiyor

**Çözüm:**
1. Webhook listener çalışıyor mu kontrol et
2. `STRIPE_WEBHOOK_SECRET` environment variable doğru mu?
3. Stripe Dashboard'da webhook endpoint doğru mu?

## 📝 Sonraki Adımlar

1. ✅ Migration'ı uygula (`APPLY_MIGRATION.md`)
2. ✅ Stripe CLI kur ve login ol
3. ✅ Development server başlat
4. ✅ Webhook listener başlat
5. ✅ Test senaryolarını çalıştır
6. ✅ Production deployment hazırlığı

---

*Son Güncelleme: Database Alignment Sonrası*

