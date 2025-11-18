# Epinera Master Guide

Bu döküman, projenin tüm önemli bilgilerini tek bir yerde toplar.

## 📚 İçindekiler

1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Proje Yapısı](#proje-yapısı)
3. [Stripe Entegrasyonu](#stripe-entegrasyonu)
4. [Test Ortamı](#test-ortamı)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Hızlı Başlangıç

### 1. Kurulum

```bash
cd epin-marketplace
npm install
```

### 2. Environment Variables

`.env.local` dosyası oluştur:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYMENT_ENVIRONMENT=test

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Veritabanı Kurulumu

Supabase SQL Editor'de migration'ları çalıştır:
- `supabase/migrations/` klasöründeki tüm SQL dosyaları
- `supabase/seed_comprehensive_test_data.sql` (test verileri)

### 4. Development Server

```bash
npm run dev
```

### 5. Stripe Webhook (Ayrı Terminal)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📁 Proje Yapısı

```
epin-marketplace/
├── src/
│   ├── app/              # Next.js App Router sayfaları
│   ├── components/       # React component'leri
│   ├── lib/              # Utility fonksiyonları
│   └── utils/            # Helper fonksiyonları
├── supabase/
│   ├── migrations/       # Veritabanı migration'ları
│   └── seed_*.sql        # Test verileri
├── scripts/              # Utility script'leri
└── public/              # Static dosyalar
```

---

## 💳 Stripe Entegrasyonu

### Stripe CLI Kurulumu

**Windows:**
```powershell
# GitHub'dan indir
# https://github.com/stripe/stripe-cli/releases
# stripe.exe'yi PATH'e ekle
```

**Login:**
```bash
stripe login
```

### Test İşlemleri

**Payment Intent:**
```bash
stripe payment_intents create --amount=2000 --currency=usd
```

**Customer:**
```bash
stripe customers create --email="test@example.com"
```

**Webhook Test:**
```bash
stripe trigger payment_intent.succeeded
```

### Bakiye Sistemi

**Önemli:** Platformun kendi bakiye sistemi var (`wallets` tablosu). Stripe sadece:
- ✅ Deposit için kullanılır (kullanıcı bakiye yükler)
- ✅ Payout için kullanılır (seller'a para çekimi)

**İşlem Akışı:**
1. Kullanıcı deposit yapar → Stripe Payment Intent
2. Webhook: `payment_intent.succeeded` → `wallets.balance` artar
3. Kullanıcı ürün satın alır → `wallets.balance` düşer (Stripe kullanılmaz)
4. Seller payout ister → Stripe Transfer → `wallets.frozen_balance` düşer

---

## 🧪 Test Ortamı

### Test Kullanıcıları

```bash
npm run seed:users
```

### Test Verileri

Supabase SQL Editor'de:
```sql
-- Test kategoriler, ürünler, kampanyalar, vb.
-- supabase/seed_comprehensive_test_data.sql
```

### Test Senaryoları

Detaylı senaryolar için: `COMPREHENSIVE_TEST_SCENARIOS.md`

**Ana Senaryolar:**
1. Kullanıcı yolculuğu (kayıt → alışveriş)
2. Bakiye yükleme (Stripe)
3. İndirim kodları
4. Kampanyalar
5. Çekilişler
6. Seller işlemleri
7. Creator işlemleri
8. Admin yönetimi

---

## 🚢 Deployment

### Vercel (Önerilen)

```bash
npm i -g vercel
vercel login
cd epin-marketplace
vercel
```

**Environment Variables:**
Vercel Dashboard → Project → Settings → Environment Variables

**Stripe Webhook:**
Stripe Dashboard → Webhooks → Add endpoint
URL: `https://your-app.vercel.app/api/webhooks/stripe`

### Local Production Build

```bash
npm run build
npm start
```

---

## 🛠️ Troubleshooting

### Stripe CLI Bulunamıyor

```bash
# Windows: PATH'e ekle
# macOS: brew install stripe/stripe-cli/stripe
# Linux: apt-get install stripe
```

### Webhook Çalışmıyor

1. `stripe listen` çalışıyor mu?
2. `STRIPE_WEBHOOK_SECRET` `.env.local`'de var mı?
3. Development server çalışıyor mu?

### Supabase Bağlantı Sorunu

1. `.env.local` dosyası doğru mu?
2. Supabase projesi aktif mi?
3. RLS policies doğru mu?

### Build Hataları

```bash
# Dependencies temizle
rm -rf node_modules package-lock.json
npm install

# TypeScript kontrolü
npm run lint
```

---

## 📖 Ek Dökümanlar

- **Sayfa İmplementasyon Analizi**: `MODULE_BASED_ANALYSIS.md`
- **Test Senaryoları**: `COMPREHENSIVE_TEST_SCENARIOS.md`
- **Production Deployment**: `PRODUCTION_DEPLOYMENT_GUIDE.md`

---

*Son Güncelleme: Sprint 43 Sonrası*

