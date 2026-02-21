# Epinera - Gaming Marketplace

Türkiye'nin retro-futuristik gaming marketplace platformu. Valorant, League of Legends, PUBG, Steam ve daha fazlası için güvenli ve hızlı alışveriş deneyimi.

## 🎮 Özellikler

### ✅ Tamamlanan Özellikler

- 🔐 Kimlik Doğrulama (Google OAuth + Email OTP)
- 🛒 Alışveriş Sepeti (gerçek zamanlı)
- 🔍 Gelişmiş Arama (full-text search, fiyat filtresi)
- 💳 Stripe Ödeme Entegrasyonu
- 📦 Sipariş Takibi
- ➕ Satıcı Ürün Yönetimi
- 🖼️ Resim Yükleme (Supabase Storage)
- 📊 Satıcı Dashboard

## 🚀 Hızlı Başlangıç

### Kurulum

\`\`\`bash
# Bağımlılıkları yükle
npm install

# Stripe paketlerini yükle
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

# Ortam değişkenlerini ayarla
cp .env.example .env.local

# Geliştirme sunucusunu başlat
npm run dev
\`\`\`

### Gerekli Ortam Değişkenleri

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

## 📁 Proje Yapısı

\`\`\`
src/
├── app/                 # Next.js App Router
├── components/          # React bileşenleri
├── lib/                 # Yardımcı fonksiyonlar
└── ...
supabase/
└── migrations/          # DB migration'ları
\`\`\`

## 🗄️ Teknoloji Stack

- **Framework:** Next.js 16 (React 19)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Styling:** Tailwind CSS v4
- **Storage:** Supabase Storage

## 📝 Geliştirme Durumu

**Tamamlanan:** 3/7 faz (%43)

- ✅ Faz 1: Satıcı Ürün Yönetimi
- ✅ Faz 2: Gelişmiş Arama
- ✅ Faz 3: Stripe Ödeme
- ⏳ Faz 4: Admin Paneli
- ⏳ Faz 5: Design Polish
- ⏳ Faz 6: Ek Özellikler
- ⏳ Faz 7: Test Altyapısı

## 📄 Lisans

MIT License
