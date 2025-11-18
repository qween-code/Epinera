# Epinera - Gaming Marketplace Platform

Dijital oyun ürünleri için modern bir e-ticaret platformu.

## 🚀 Hızlı Başlangıç

Detaylı kurulum için: [MASTER_GUIDE.md](./MASTER_GUIDE.md)

```bash
# 1. Dependencies yükle
npm install

# 2. Environment variables ayarla
cp .env.local.example .env.local
# .env.local dosyasını düzenle

# 3. Development server
npm run dev
```

## 📚 Dökümanlar

- **[MASTER_GUIDE.md](./MASTER_GUIDE.md)** - Tüm önemli bilgiler (kurulum, Stripe, test, deployment)
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Declarative schema yönetimi ve veritabanı yapısı
- **[COMPREHENSIVE_TEST_SCENARIOS.md](./COMPREHENSIVE_TEST_SCENARIOS.md)** - Kapsamlı test senaryoları
- **[MODULE_BASED_ANALYSIS.md](../MODULE_BASED_ANALYSIS.md)** - Sayfa implementasyon analizi
- **[PRODUCTION_DEPLOYMENT_GUIDE.md](../PRODUCTION_DEPLOYMENT_GUIDE.md)** - Production deployment rehberi

## 🛠 Teknolojiler

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL)
- **Payment**: Stripe
- **Deployment**: Vercel Ready

## 📁 Proje Yapısı

```
epin-marketplace/
├── src/app/              # Next.js sayfaları
├── src/components/       # React component'leri
├── supabase/
│   ├── schemas/          # Declarative schema dosyaları
│   ├── migrations/       # Otomatik oluşturulan migration'lar
│   └── seeds/            # Seed data dosyaları
└── scripts/             # Utility script'leri
```

## 🗄️ Veritabanı Yönetimi

Bu proje **Supabase Declarative Schema Management** kullanıyor:

- Tüm şema tanımları `supabase/schemas/` dizininde
- Migration'lar otomatik oluşturulur: `supabase db diff -f <name>`
- Detaylı bilgi: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

## ✅ Özellikler

- ✅ Kullanıcı yönetimi (OAuth, OTP)
- ✅ Ürün kataloğu ve arama
- ✅ Sepet ve checkout
- ✅ Stripe ödeme entegrasyonu
- ✅ Wallet sistemi
- ✅ Kampanya ve indirimler
- ✅ Çekilişler ve giveaway'ler
- ✅ Satıcı ve creator panelleri
- ✅ Admin yönetim paneli

## 🧪 Test

```bash
# Test kullanıcıları
npm run seed:users

# Test senaryoları için:
# COMPREHENSIVE_TEST_SCENARIOS.md
```

## 📖 Daha Fazla Bilgi

Detaylı bilgiler için [MASTER_GUIDE.md](./MASTER_GUIDE.md) dosyasına bakın.

---

*Son Güncelleme: Sprint 43 Sonrası*
