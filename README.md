# Epinera - Gaming Marketplace Platform

Dijital oyun ürünleri için modern bir e-ticaret platformu.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler

#### Kullanıcı Yönetimi
- ✅ Google OAuth ile giriş
- ✅ Email OTP (One-Time Password) ile giriş
- ✅ Otomatik profil oluşturma
- ✅ Rol bazlı erişim kontrolü (Alıcı, Satıcı, İçerik Üretici, Admin)
- ✅ KYC (Kimlik Doğrulama) sistemi

#### Ürün Kataloğu
- ✅ Dinamik ürün sayfaları
- ✅ Ürün varyantları sistemi (örn: farklı VP miktarları)
- ✅ Kategori ve alt-kategori yapısı
- ✅ SEO dostu URL'ler (slug)
- ✅ Stok takibi

#### Alışveriş Sepeti
- ✅ Gerçek zamanlı sepet yönetimi
- ✅ Context API ile global state yönetimi
- ✅ Miktar güncelleme
- ✅ Sepet özeti ve toplam hesaplama
- ✅ KDV hesaplaması (%20)

#### Ödeme ve Sipariş
- ✅ Checkout sayfası
- ✅ Sipariş oluşturma
- ✅ Sipariş detayları sayfası
- ✅ Sipariş geçmişi
- ✅ Teslimat bilgileri
- ✅ Ödeme yöntemi seçimi (Kredi Kartı, PayPal, Banka Havalesi)

#### Arama ve Keşif
- ✅ Ürün arama sayfası
- ✅ Kategoriye göre filtreleme
- ✅ Fiyat sıralaması (düşük-yüksek, yüksek-düşük)
- ✅ İsme göre sıralama
- ✅ En yeni ürünler

#### Satıcı Paneli
- ✅ Satıcı dashboard
- ✅ Ürün yönetimi
- ✅ Sipariş yönetimi
- ✅ Satış istatistikleri
- ✅ Gelir takibi

#### Admin Paneli
- ✅ Admin dashboard
- ✅ Kullanıcı yönetimi
- ✅ Ürün yönetimi
- ✅ Sipariş izleme
- ✅ KYC onayları
- ✅ Platform istatistikleri

## 🛠 Teknolojiler

- **Frontend Framework:** Next.js 16.0.3 (App Router)
- **UI Kütüphanesi:** React 19.2.0
- **Dil:** TypeScript 5
- **Stil:** Tailwind CSS 4
- **Backend/Veritabanı:** Supabase (PostgreSQL)
- **Kimlik Doğrulama:** Supabase Auth
- **Deployment:** Vercel Ready

## 📁 Proje Yapısı

```
epin-marketplace/
├── src/
│   ├── app/                      # Next.js App Router sayfaları
│   │   ├── admin/                # Admin paneli
│   │   ├── seller/               # Satıcı paneli
│   │   ├── cart/                 # Sepet sayfası
│   │   ├── checkout/             # Ödeme sayfası
│   │   ├── orders/               # Sipariş sayfaları
│   │   ├── search/               # Arama sayfası
│   │   ├── product/[slug]/       # Ürün detay sayfası
│   │   └── category/[slug]/      # Kategori sayfası
│   ├── components/
│   │   ├── cart/                 # Sepet bileşenleri
│   │   ├── layout/               # Layout bileşenleri
│   │   └── ui/                   # UI bileşenleri
│   └── lib/
│       ├── cart/                 # Sepet Context & Logic
│       └── supabase/             # Supabase istemcileri
├── supabase/
│   ├── migrations/               # Veritabanı migrasyonları
│   └── seed.sql                  # Test verisi
└── .claude/                      # Claude Code konfigürasyonu
```

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
cd epin-marketplace
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun:

```bash
cp .env.example .env.local
```

Supabase projenizi oluşturun ve aşağıdaki değerleri `.env.local` dosyasına ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Veritabanını Kurun

Supabase Studio'da SQL Editor'ü açın ve sırasıyla şu migration dosyalarını çalıştırın:

```bash
# 1. Temel şema
supabase/migrations/20251114135606_create_initial_schema.sql

# 2. Ürün şeması
supabase/migrations/20251114171749_add_product_schema.sql

# 3. Ürün varyantları
supabase/migrations/20251114174940_add_product_variants_schema.sql

# 4. Sepet ve siparişler
supabase/migrations/20251116000001_add_cart_and_orders.sql
```

### 4. Test Verilerini Yükleyin (Opsiyonel)

```sql
-- supabase/seed.sql dosyasını çalıştırın
```

### 5. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.


## 📊 Veritabanı Şeması

### Ana Tablolar

- **profiles** - Kullanıcı profilleri (rol, KYC durumu)
- **categories** - Ürün kategorileri (hiyerarşik yapı)
- **products** - Temel ürün bilgileri
- **product_variants** - Ürün varyantları (fiyat, stok)
- **cart_items** - Alışveriş sepeti öğeleri
- **orders** - Siparişler
- **order_items** - Sipariş detayları
- **attributes** - Ürün özellikleri

## 🔐 Güvenlik

- Row Level Security (RLS) tüm tablolarda aktif
- Rol bazlı erişim kontrolü
- Güvenli kimlik doğrulama (Supabase Auth)
- SQL injection koruması

## 🌐 Deployment

### Vercel'e Deploy

```bash
# Vercel CLI'yi kurun
npm i -g vercel

# Deploy edin
vercel
```

Ortam değişkenlerini Vercel dashboard'undan ekleyin.

## 📝 Yapılacaklar

### Öncelikli
- [ ] Ödeme gateway entegrasyonu (Stripe, iyzico)
- [ ] Gerçek ürün görselleri
- [ ] Email bildirimleri
- [ ] SMS doğrulama

### Gelecek Özellikler
- [ ] Kullanıcı değerlendirme sistemi
- [ ] Satıcı puanlama
- [ ] Canlı chat desteği
- [ ] Çoklu dil desteği
- [ ] Mobil uygulama
- [ ] AI destekli ürün önerileri (Serena entegrasyonu)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---
