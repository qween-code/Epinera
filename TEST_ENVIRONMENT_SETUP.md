# Test Ortamı Kurulum Rehberi

Bu döküman, test ortamını kurmak ve test verileri ile çalışmak için gerekli adımları içerir.

## 📋 İçindekiler

1. [Environment Variables](#environment-variables)
2. [Admin Kullanıcısı Oluşturma](#admin-kullanıcısı-oluşturma)
3. [Test Verileri Seed Etme](#test-verileri-seed-etme)
4. [Stripe Sandbox Kurulumu](#stripe-sandbox-kurulumu)
5. [Test Kartları](#test-kartları)
6. [Test Kullanıcıları](#test-kullanıcıları)

---

## 🔐 Environment Variables

### Test Ortamı (.env.local)

```env
# Supabase (Test)
NEXT_PUBLIC_SUPABASE_URL=https://your-test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key

# Stripe (Sandbox/Test)
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_test_webhook_secret
PAYMENT_ENVIRONMENT=test

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Ortamı (.env.production.local)

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
PAYMENT_ENVIRONMENT=production

# Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://epinmarketplace.com
```

---

## 👤 Admin Kullanıcısı Oluşturma

### Yöntem 1: Script ile (Önerilen)

```bash
cd epin-marketplace
npx tsx scripts/create-admin-user.ts
```

**Admin Bilgileri:**
- Email: `turhanhamza@gmail.com`
- Password: `dodo6171`
- Role: `admin`

### Yöntem 2: Supabase Dashboard

1. Supabase Dashboard → Authentication → Users
2. "Add User" butonuna tıkla
3. Email: `turhanhamza@gmail.com`
4. Password: `dodo6171`
5. Email Confirmed: ✅
6. User Metadata:
   ```json
   {
     "full_name": "Admin User",
     "role": "admin",
     "is_admin": true
   }
   ```
7. SQL Editor'de profile'ı güncelle:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin', metadata = '{"is_admin": true}'::jsonb
   WHERE id = (SELECT id FROM auth.users WHERE email = 'turhanhamza@gmail.com');
   ```

---

## 🌱 Test Verileri Seed Etme

### Yöntem 1: SQL Script (Önerilen)

1. Supabase Dashboard → SQL Editor
2. `supabase/seed_test_data.sql` dosyasını aç
3. SQL'i kopyala ve çalıştır

**Not:** Script şunları oluşturur:
- Test kategorileri (isminde "test" geçen)
- Test ürünler
- Test kampanyalar
- Test bildirimler
- Test yorumlar

### Yöntem 2: TypeScript Script

```bash
cd epin-marketplace
npx tsx scripts/seed-test-data.ts
```

**Not:** Bu script test kullanıcılarını da oluşturur.

---

## 💳 Stripe Sandbox Kurulumu

### 1. Stripe Test Hesabı Oluştur

1. [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) → Test Mode
2. API Keys bölümünden test key'leri kopyala
3. `.env.local` dosyasına ekle:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### 2. Webhook Kurulumu

**Test Ortamı:**
1. Stripe Dashboard → Developers → Webhooks
2. "Add endpoint" butonuna tıkla
3. Endpoint URL: `http://localhost:3000/api/webhooks/stripe` (local) veya `https://your-test-domain.com/api/webhooks/stripe`
4. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Webhook signing secret'i kopyala ve `.env.local`'e ekle:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

**Production Ortamı:**
1. Aynı adımları production webhook URL'i ile tekrarla
2. Production key'leri kullan

### 3. Test Kartları

Stripe test modunda aşağıdaki kartlar kullanılabilir:

| Senaryo | Kart Numarası | Sonuç |
|---------|--------------|-------|
| Başarılı Ödeme | `4242 4242 4242 4242` | ✅ Başarılı |
| 3D Secure Gerekli | `4000 0025 0000 3155` | 🔐 3D Secure |
| Reddedildi | `4000 0000 0000 0002` | ❌ Reddedildi |
| Yetersiz Bakiye | `4000 0000 0000 9995` | 💰 Yetersiz Bakiye |

**Test Kart Detayları:**
- **Expiry**: Herhangi bir gelecek tarih (örn: `12/34`)
- **CVC**: Herhangi bir 3 haneli sayı (örn: `123`)
- **ZIP**: Herhangi bir 5 haneli sayı (örn: `12345`)

---

## 👥 Test Kullanıcıları

Test verileri seed edildiğinde aşağıdaki kullanıcılar oluşturulur:

| Email | Password | Role | Açıklama |
|-------|----------|------|----------|
| `turhanhamza@gmail.com` | `dodo6171` | Admin | Admin kullanıcısı |
| `test-seller@epinmarketplace.com` | `test123456` | Seller | Test satıcı |
| `test-buyer@epinmarketplace.com` | `test123456` | Buyer | Test alıcı |
| `test-creator@epinmarketplace.com` | `test123456` | Creator | Test içerik üreticisi |

**Not:** Test kullanıcıları `seed-test-data.ts` script'i ile oluşturulur.

---

## 🔄 Test'ten Production'a Geçiş

### 1. Environment Variables

`.env.local` → `.env.production.local`:
- Test key'leri → Production key'leri
- `PAYMENT_ENVIRONMENT=test` → `PAYMENT_ENVIRONMENT=production`
- Test Supabase URL → Production Supabase URL

### 2. Stripe Webhook

1. Production webhook URL'ini Stripe Dashboard'da güncelle
2. Production webhook secret'ı `.env.production.local`'e ekle

### 3. Admin Kullanıcısı

Production'da da aynı script ile admin kullanıcısı oluştur:
```bash
# Production environment variables ile
NEXT_PUBLIC_SUPABASE_URL=https://production-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=production-service-key \
npx tsx scripts/create-admin-user.ts
```

### 4. Test Verilerini Temizle

Production'da test verilerini temizlemek için:
```sql
-- Test kategorileri
DELETE FROM public.categories WHERE slug LIKE 'test-%';

-- Test ürünler
DELETE FROM public.products WHERE slug LIKE 'test-%';

-- Test kampanyalar
DELETE FROM public.campaigns WHERE metadata->>'is_test' = 'true';

-- Test bildirimler
DELETE FROM public.notifications WHERE metadata->>'is_test' = 'true';

-- Test yorumlar
DELETE FROM public.reviews WHERE metadata->>'is_test' = 'true';
```

---

## ✅ Test Checklist

- [ ] Environment variables test değerlerine ayarlandı
- [ ] Admin kullanıcısı oluşturuldu
- [ ] Test verileri seed edildi
- [ ] Stripe test key'leri eklendi
- [ ] Webhook test modunda çalışıyor
- [ ] Test kartları ile ödeme test edildi
- [ ] Test kullanıcıları ile giriş yapılabiliyor

---

## 🐛 Sorun Giderme

### Stripe Webhook Çalışmıyor

1. Webhook URL'inin doğru olduğundan emin ol
2. Webhook secret'ın `.env.local`'de olduğunu kontrol et
3. Stripe Dashboard → Webhooks → Test webhook gönder

### Test Kullanıcıları Oluşturulamıyor

1. `SUPABASE_SERVICE_ROLE_KEY` doğru mu kontrol et
2. Supabase Dashboard'da service role key'in aktif olduğunu kontrol et
3. Script'i manuel olarak çalıştır ve hata mesajlarını kontrol et

### Test Verileri Görünmüyor

1. SQL script'in başarıyla çalıştığını kontrol et
2. Supabase Dashboard → Table Editor'de verileri kontrol et
3. RLS policies'in test verilerine izin verdiğinden emin ol

---

*Son Güncelleme: Sprint 43 Sonrası*

