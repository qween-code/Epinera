# Deployment Seçenekleri

Bu döküman, test ortamını deploy etmek için seçenekleri ve adımları içerir.

## 🎯 Deployment Seçenekleri

### Seçenek 1: Vercel (Önerilen - Production-like)

**Avantajlar:**
- ✅ Production ortamına en yakın
- ✅ Otomatik CI/CD
- ✅ Kolay environment variable yönetimi
- ✅ Otomatik SSL
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Kolay rollback

**Dezavantajlar:**
- ⚠️ Ücretsiz plan limitleri
- ⚠️ Build süresi limitleri

**Kurulum:**
```bash
# 1. Vercel CLI kurulumu
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
cd epin-marketplace
vercel

# 4. Environment variables ekle
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add PAYMENT_ENVIRONMENT
```

### Seçenek 2: Local Development (Geliştirme için)

**Avantajlar:**
- ✅ Hızlı iterasyon
- ✅ Debug kolaylığı
- ✅ Ücretsiz
- ✅ Tam kontrol

**Dezavantajlar:**
- ⚠️ Production ortamından farklı
- ⚠️ Public URL gerektirir (webhook için)

**Kurulum:**
```bash
# 1. Dependencies yükle
cd epin-marketplace
npm install

# 2. Environment variables ayarla
cp .env.example .env.local
# .env.local dosyasını düzenle

# 3. Development server başlat
npm run dev

# 4. Stripe webhook için ngrok (opsiyonel)
ngrok http 3000
# Stripe Dashboard'da webhook URL'i güncelle
```

---

## 🛠️ Stripe CLI Kurulumu

### Windows
```powershell
# Scoop ile
scoop install stripe

# Veya manuel
# https://github.com/stripe/stripe-cli/releases
# stripe.exe'yi PATH'e ekle
```

### macOS
```bash
brew install stripe/stripe-cli/stripe
```

### Linux
```bash
# Debian/Ubuntu
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_*_linux_x86_64.tar.gz
tar -xvf stripe_*_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### Kullanım
```bash
# 1. Login
stripe login

# 2. Webhook forwarding (local development)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 3. Test webhook gönder
stripe trigger payment_intent.succeeded

# 4. Events listele
stripe events list
```

---

## 🗄️ Supabase CLI Kurulumu

### Windows
```powershell
# Scoop ile
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Veya npm ile
npm install -g supabase
```

### macOS
```bash
brew install supabase/tap/supabase
```

### Linux
```bash
# npm ile
npm install -g supabase
```

### Kullanım
```bash
# 1. Login
supabase login

# 2. Projeyi link et
cd epin-marketplace
supabase link --project-ref your-project-ref

# 3. Migration'ları push et
supabase db push

# 4. Seed data çalıştır
supabase db reset --seed

# 5. Local development (opsiyonel)
supabase start
```

---

## 🚀 Hızlı Başlangıç: Test Ortamı Kurulumu

### Adım 1: Dependencies Yükle
```bash
cd epin-marketplace
npm install
```

### Adım 2: Environment Variables
```bash
# .env.local dosyası oluştur
cp .env.example .env.local

# Düzenle:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - STRIPE_SECRET_KEY (test key)
# - STRIPE_PUBLISHABLE_KEY (test key)
# - PAYMENT_ENVIRONMENT=test
```

### Adım 3: Test Kullanıcıları Oluştur
```bash
npm run seed:users
```

### Adım 4: Test Verileri Seed Et
1. Supabase Dashboard → SQL Editor
2. `supabase/seed_comprehensive_test_data.sql` dosyasını çalıştır

### Adım 5: Stripe Webhook (Local)
```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: Stripe webhook forwarding
npm run stripe:listen
```

### Adım 6: Uygulamayı Başlat
```bash
npm run dev
```

---

## 🌐 Vercel Deployment

### İlk Deploy
```bash
cd epin-marketplace
vercel
```

### Environment Variables (Vercel Dashboard)
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Aşağıdaki değişkenleri ekle:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `PAYMENT_ENVIRONMENT=test`
   - `NEXT_PUBLIC_APP_URL` (Vercel URL'i)

### Stripe Webhook (Production)
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Webhook signing secret'i kopyala ve Vercel environment variables'a ekle

### Supabase Migration (Production)
```bash
# Supabase Dashboard → SQL Editor
# Tüm migration dosyalarını sırayla çalıştır:
# 1. 20251114135606_create_initial_schema.sql
# 2. 20251114171749_add_product_schema.sql
# 3. ... (diğer migration'lar)
# 4. seed_comprehensive_test_data.sql
```

---

## 🔄 Local vs Vercel Karşılaştırması

| Özellik | Local | Vercel |
|---------|-------|--------|
| **Hız** | ⚡ Çok Hızlı | 🚀 Hızlı |
| **Debug** | ✅ Kolay | ⚠️ Zor |
| **Production-like** | ❌ Hayır | ✅ Evet |
| **Public URL** | ⚠️ ngrok gerekir | ✅ Otomatik |
| **Webhook** | ⚠️ ngrok gerekir | ✅ Doğrudan |
| **Maliyet** | ✅ Ücretsiz | ✅ Ücretsiz (limitli) |
| **CI/CD** | ❌ Yok | ✅ Otomatik |
| **SSL** | ⚠️ Manuel | ✅ Otomatik |

---

## 💡 Öneri

**Geliştirme Aşaması:**
- ✅ Local development kullan
- ✅ Stripe CLI ile webhook forwarding
- ✅ Supabase CLI ile migration yönetimi

**Test/Staging:**
- ✅ Vercel'de test deployment
- ✅ Production-like ortam
- ✅ Gerçek webhook testleri

**Production:**
- ✅ Vercel production deployment
- ✅ Production Stripe keys
- ✅ Production Supabase project

---

## 📝 Checklist

### Local Setup
- [ ] Dependencies yüklendi
- [ ] `.env.local` oluşturuldu ve dolduruldu
- [ ] Test kullanıcıları oluşturuldu
- [ ] Test verileri seed edildi
- [ ] Stripe CLI kuruldu ve login yapıldı
- [ ] Supabase CLI kuruldu ve link edildi
- [ ] Development server çalışıyor
- [ ] Stripe webhook forwarding aktif

### Vercel Deployment
- [ ] Vercel CLI kuruldu
- [ ] Vercel'de login yapıldı
- [ ] Proje deploy edildi
- [ ] Environment variables eklendi
- [ ] Stripe webhook URL'i güncellendi
- [ ] Supabase migration'ları uygulandı
- [ ] Test verileri seed edildi
- [ ] Webhook test edildi

---

*Son Güncelleme: Sprint 43 Sonrası*

