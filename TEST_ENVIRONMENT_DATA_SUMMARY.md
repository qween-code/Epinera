# Test Ortamı Veri Özeti

Bu döküman, test ortamında oluşturulan tüm test verilerinin kapsamlı özetini içerir.

## 📊 Genel İstatistikler

| Veri Tipi | Miktar | Açıklama |
|-----------|--------|----------|
| **Kullanıcılar** | 36 | Admin, Sellers, Buyers, Creators |
| **Kategoriler** | 20+ | Ana ve alt kategoriler |
| **Ürünler** | 50+ | Aktif test ürünleri |
| **Ürün Varyantları** | 200+ | Farklı paket seçenekleri |
| **Kampanyalar** | 20+ | Giveaway, Discount, Referral, Stream |
| **Çekiliş Katılımları** | 100+ | Aktif çekiliş katılımları |
| **Siparişler** | 100+ | Farklı durumlarda siparişler |
| **Cüzdan İşlemleri** | 200+ | Deposit, Purchase, Payout, Refund |
| **Yorumlar** | 150+ | Ürün ve satıcı yorumları |
| **Referanslar** | 50+ | Kullanıcı referansları |
| **Başarılar** | 30+ | Gamification başarıları |
| **Kullanıcı Başarıları** | 100+ | Kullanıcı başarı ilerlemeleri |
| **Forum Kategorileri** | 10+ | Forum kategorileri |
| **Forum Gönderileri** | 50+ | Topluluk gönderileri |
| **Bildirimler** | 200+ | Sistem bildirimleri |
| **Mesajlar** | 100+ | Kullanıcı mesajları |
| **Denetim Kayıtları** | 100+ | Sistem denetim kayıtları |

---

## 👥 Test Kullanıcıları

### Admin Kullanıcısı
- **Email**: `turhanhamza@gmail.com`
- **Password**: `dodo6171`
- **Role**: `admin`
- **Açıklama**: Ana admin kullanıcısı

### Test Satıcılar (10 adet)
- **Email Pattern**: `test-seller-{1-10}@epinmarketplace.com`
- **Password**: `test123456`
- **Role**: `seller`
- **Tier Dağılımı**:
  - Premium Sellers: 3 adet (test-seller-1, 2, 3)
  - Verified Sellers: 4 adet (test-seller-4, 5, 6, 7)
  - Standard Sellers: 3 adet (test-seller-8, 9, 10)

### Test Alıcılar (20 adet)
- **Email Pattern**: `test-buyer-{1-20}@epinmarketplace.com`
- **Password**: `test123456`
- **Role**: `buyer`
- **Tier Dağılımı**:
  - VIP Buyers: 5 adet (test-buyer-1 through 5)
  - Premium Buyers: 5 adet (test-buyer-6 through 10)
  - Standard Buyers: 10 adet (test-buyer-11 through 20)

### Test İçerik Üreticileri / Influencer'lar (5 adet)
- **Email Pattern**: `test-creator-{1-5}@epinmarketplace.com`
- **Password**: `test123456`
- **Role**: `creator`
- **Tier Dağılımı**:
  - Top Influencers: 2 adet (test-creator-1, 2)
  - Mid-Tier Creators: 2 adet (test-creator-3, 4)
  - Starter Creators: 1 adet (test-creator-5)
- **Platformlar**: Twitch, YouTube, Instagram

---

## 🎮 Test Kategorileri

### Ana Kategoriler (15 adet)
1. **Test Steam Games** - Steam oyun ürünleri
2. **Test Valorant Points** - Valorant in-game para birimi
3. **Test League of Legends** - LoL ürünleri
4. **Test CS2 Skins** - Counter-Strike 2 skin'leri
5. **Test Fortnite V-Bucks** - Fortnite para birimi
6. **Test PlayStation Network** - PSN hediye kartları
7. **Test Xbox Live** - Xbox Live hediye kartları
8. **Test Nintendo eShop** - Nintendo eShop kodları
9. **Test PUBG Mobile UC** - PUBG Mobile UC
10. **Test Mobile Legends** - Mobile Legends elmasları
11. **Test World of Warcraft** - WoW oyun zamanı ve eşyaları
12. **Test Final Fantasy XIV** - FFXIV abonelik ve eşyaları
13. **Test Gift Cards** - Genel hediye kartları
14. **Test Game Keys** - Oyun aktivasyon anahtarları
15. **Test In-Game Items** - Çeşitli in-game eşyalar

### Alt Kategoriler
- Test Steam Wallet Codes (Steam Games altında)

---

## 🛍️ Test Ürünleri

### Ürün İstatistikleri
- **Toplam Ürün**: 50+ adet
- **Durum**: Tümü `active`
- **Slug Pattern**: `test-product-{1-50}`
- **Satıcı Dağılımı**: 10 test satıcı arasında dağıtılmış
- **Kategori Dağılımı**: 15 kategori arasında dağıtılmış

### Ürün Varyantları
- **Toplam Varyant**: 200+ adet (her ürün için 4-5 varyant)
- **Varyant Tipleri**:
  - Basic Package: $9.99
  - Standard Package: $19.99
  - Premium Package: $29.99
  - Deluxe Package: $49.99
  - Ultimate Package: $99.99
- **Stok Miktarı**: 1000-6000 arası rastgele
- **Para Birimi**: USD

---

## 🎯 Test Kampanyaları

### Giveaway Kampanyaları (5 adet)
- **Durum**: `active`
- **Tip**: `giveaway`
- **Süre**: 30 gün
- **Ödüller**: Valorant Points, Steam Wallet, vb.
- **Kazanan Sayısı**: 5'er kişi
- **Gereksinimler**: Minimum 100 takipçi, Twitch platformu

### Discount Kampanyaları (5 adet)
- **Durum**: `active`
- **Tip**: `discount`
- **Süre**: 15 gün
- **İndirim Oranı**: %20-50 arası
- **Minimum Alışveriş**: $50
- **Maksimum İndirim**: $100

### Referral Kampanyaları (5 adet)
- **Durum**: `active`
- **Tip**: `referral`
- **Süre**: 60 gün
- **Minimum Referans**: 5 kişi
- **Referans Başına Ödül**: $10
- **Bonus Ödül**: $50

### Stream Kampanyaları (5 adet)
- **Durum**: `active`
- **Tip**: `stream`
- **Süre**: 7 gün
- **Minimum İzleme Süresi**: 30 dakika
- **Platform**: Twitch
- **Ödül Havuzu**: $500
- **Kazanan Sayısı**: 10 kişi

---

## 🎁 Çekiliş Katılımları

- **Toplam Katılım**: 100+ adet
- **Katılım Yöntemleri**:
  - Stream Watch: 25 adet
  - Social Share: 25 adet
  - Purchase: 25 adet
  - Referral: 25 adet
- **Durum Dağılımı**:
  - Winner: 10 adet (%10)
  - Pending: 90 adet (%90)

---

## 📦 Test Siparişleri

- **Toplam Sipariş**: 100+ adet
- **Sipariş Durumları**:
  - Completed: 40 adet (%40)
  - Processing: 10 adet (%10)
  - Pending: 10 adet (%10)
  - Delivered: 40 adet (%40)
- **Ödeme Durumları**:
  - Paid: 80 adet (completed/delivered siparişler)
  - Pending: 20 adet (pending/processing siparişler)
- **Teslimat Durumları**:
  - Delivered: 80 adet
  - Processing: 10 adet
  - Pending: 10 adet

---

## 💰 Cüzdan İşlemleri

- **Toplam İşlem**: 200+ adet
- **İşlem Tipleri**:
  - Deposit: 40 adet (%20)
  - Purchase: 40 adet (%20)
  - Payout: 40 adet (%20)
  - Refund: 40 adet (%20)
  - Bonus: 40 adet (%20)
- **İşlem Durumları**:
  - Completed: 160 adet (%80)
  - Pending: 20 adet (%10)
  - Failed: 20 adet (%10)
- **Tutar Aralığı**: $10 - $500

---

## ⭐ Test Yorumları

- **Toplam Yorum**: 150+ adet
- **Rating Dağılımı**:
  - 5 Yıldız: 60 adet (%40)
  - 4 Yıldız: 60 adet (%40)
  - 3 Yıldız: 30 adet (%20)
- **Yorum Durumları**:
  - Approved: 135 adet (%90)
  - Pending: 7 adet (%5)
  - Rejected: 8 adet (%5)

---

## 🔗 Test Referansları

- **Toplam Referans**: 50+ adet
- **Referans Durumları**:
  - Active: 30 adet (%60)
  - Completed: 10 adet (%20)
  - Pending: 10 adet (%20)
- **Referans Kodu Formatı**: `TEST{1001-1050}`
- **Ödül Tutarı**: $10 - $60

---

## 🏆 Test Başarıları

- **Toplam Başarı**: 30 adet
- **Tier Dağılımı**:
  - Bronze: 6 adet
  - Silver: 6 adet
  - Gold: 6 adet
  - Platinum: 6 adet
  - Diamond: 6 adet
- **Puan Ödülleri**: 10 - 300 puan
- **Gereksinimler**: Satın alma sayısı bazlı (5 - 150)

---

## 👤 Kullanıcı Başarıları

- **Toplam Kullanıcı Başarı**: 100+ adet
- **Tamamlanma Durumu**:
  - Completed: 33 adet (%33)
  - In Progress: 67 adet (%67)
- **İlerleme**: 0-100% arası

---

## 📊 Kullanıcı İstatistikleri

Tüm test kullanıcıları için oluşturulan istatistikler:

- **XP Aralığı**: 0 - 10,000
- **Seviye Aralığı**: 1 - 50
- **Rozet Sayısı**: 0 - 20
- **Başarı Sayısı**: 0 - 15
- **Yazılan Yorum**: 0 - 50
- **Satın Alımlar** (Buyers): 0 - 100
- **Satışlar** (Sellers): 0 - 200
- **Toplam Harcama** (Buyers): $0 - $5,000
- **Toplam Kazanç** (Sellers): $0 - $10,000
- **Son Aktiflik**: Son 30 gün içinde

---

## 💬 Forum Verileri

### Forum Kategorileri
- **Toplam Kategori**: 10 adet
- **Slug Pattern**: `test-forum-category-{1-10}`
- **Durum**: Tümü aktif

### Forum Gönderileri
- **Toplam Gönderi**: 50+ adet
- **Gönderi Durumları**:
  - Published: 40 adet (%80)
  - Pending: 5 adet (%10)
  - Flagged: 5 adet (%10)

---

## 🔔 Test Bildirimleri

- **Toplam Bildirim**: 200+ adet
- **Bildirim Tipleri**:
  - Order Confirmed: 33 adet
  - Payment Received: 33 adet
  - New Message: 33 adet
  - Campaign Update: 33 adet
  - Achievement Unlocked: 33 adet
  - System Alert: 35 adet
- **Okunma Durumu**:
  - Read: 66 adet (%33)
  - Unread: 134 adet (%67)

---

## 💌 Test Mesajları

- **Toplam Mesaj**: 100+ adet
- **Mesaj Durumları**:
  - Read: 50 adet (%50)
  - Unread: 50 adet (%50)
- **Zaman Aralığı**: Son 48 saat içinde

---

## 📝 Denetim Kayıtları

- **Toplam Kayıt**: 100+ adet
- **İşlem Tipleri**:
  - Create: 11 adet
  - Update: 11 adet
  - Delete: 11 adet
  - Suspend: 11 adet
  - Verify: 11 adet
  - Refund: 11 adet
  - Data Export: 11 adet
  - Login: 11 adet
  - Logout: 12 adet
- **Kaynak Tipleri**: Product, Order, User, Campaign, Transaction
- **Zaman Aralığı**: Son 30 gün içinde

---

## 🎯 Test Verileri Özellikleri

### Tanımlama
- Tüm test verileri **"test"** kelimesi içerir (slug, name, description)
- Metadata'da `is_test: true` flag'i mevcut
- Kolayca temizlenebilir (WHERE slug LIKE 'test-%' veya metadata->>'is_test' = 'true')

### Gerçekçilik
- Veriler gerçekçi aralıklarda (fiyatlar, stoklar, tarihler)
- İlişkiler doğru kurulmuş (foreign keys)
- Durumlar mantıklı dağıtılmış

### Kapsam
- Tüm önemli tablolar için test verisi
- Farklı senaryoları kapsar (başarılı, başarısız, bekleyen)
- Edge case'ler için örnekler

---

## 🚀 Kullanım

### Test Verilerini Oluşturma

1. **Kullanıcıları Oluştur:**
   ```bash
   npx tsx scripts/create-comprehensive-test-users.ts
   ```

2. **Test Verilerini Seed Et:**
   ```bash
   # Supabase SQL Editor'de çalıştır:
   supabase/seed_comprehensive_test_data.sql
   ```

3. **Ortamı Doğrula:**
   ```bash
   # Test verilerini kontrol et
   # Supabase Dashboard → Table Editor
   ```

### Test Verilerini Temizleme

```sql
-- Tüm test verilerini temizle
DELETE FROM public.audit_logs WHERE additional_context->>'is_test' = 'true';
DELETE FROM public.messages WHERE content LIKE 'Test message%';
DELETE FROM public.notifications WHERE metadata->>'is_test' = 'true';
DELETE FROM public.forum_posts WHERE metadata->>'is_test' = 'true';
DELETE FROM public.forum_categories WHERE slug LIKE 'test-forum-category-%';
DELETE FROM public.user_stats WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@epinmarketplace.com');
DELETE FROM public.user_achievements WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@epinmarketplace.com');
DELETE FROM public.achievements WHERE metadata->>'is_test' = 'true';
DELETE FROM public.referrals WHERE metadata->>'is_test' = 'true';
DELETE FROM public.reviews WHERE metadata->>'is_test' = 'true';
DELETE FROM public.wallet_transactions WHERE metadata->>'is_test' = 'true';
DELETE FROM public.orders WHERE metadata->>'is_test' = 'true';
DELETE FROM public.giveaway_entries WHERE metadata->>'is_test' = 'true';
DELETE FROM public.campaigns WHERE metadata->>'is_test' = 'true';
DELETE FROM public.product_variants WHERE product_id IN (SELECT id FROM public.products WHERE slug LIKE 'test-product-%');
DELETE FROM public.products WHERE slug LIKE 'test-product-%';
DELETE FROM public.categories WHERE slug LIKE 'test-%';
```

---

## 📋 Test Senaryoları

### Senaryo 1: Alıcı Satın Alma Akışı
1. `test-buyer-1@epinmarketplace.com` ile giriş yap
2. Test ürünlerden birini seç
3. Sepete ekle
4. Checkout yap
5. Test kartı ile ödeme yap (`4242 4242 4242 4242`)
6. Siparişi takip et

### Senaryo 2: Satıcı Ürün Yönetimi
1. `test-seller-1@epinmarketplace.com` ile giriş yap
2. Ürünler sayfasına git
3. Yeni ürün ekle
4. Siparişleri görüntüle
5. Sipariş durumunu güncelle

### Senaryo 3: İçerik Üreticisi Kampanya
1. `test-creator-1@epinmarketplace.com` ile giriş yap
2. Kampanyalar sayfasına git
3. Yeni giveaway kampanyası oluştur
4. Kampanya performansını görüntüle

### Senaryo 4: Admin Yönetimi
1. `turhanhamza@gmail.com` ile giriş yap
2. Admin dashboard'a git
3. Kullanıcıları görüntüle
4. Siparişleri görüntüle
5. Güvenlik uyarılarını kontrol et

---

*Son Güncelleme: Sprint 43 Sonrası*

