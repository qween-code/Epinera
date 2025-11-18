# Kapsamlı Gerçek Hayat Test Senaryoları

Bu döküman, platformun tüm özelliklerini kapsayan gerçek hayat senaryolarını içerir.

## 🎯 Test Senaryoları Kategorileri

1. **Kullanıcı Yolculuğu Senaryoları**
2. **Ödeme ve Bakiye Senaryoları**
3. **Kampanya ve İndirim Senaryoları**
4. **Çekiliş ve Giveaway Senaryoları**
5. **Satıcı İşlem Senaryoları**
6. **Creator İşlem Senaryoları**
7. **Admin Yönetim Senaryoları**

---

## 1. 👤 Kullanıcı Yolculuğu Senaryoları

### Senaryo 1.1: Yeni Kullanıcı Kaydı ve İlk Alışveriş

**Adımlar:**
1. ✅ Kullanıcı kaydı (Email/Google OAuth)
2. ✅ Email doğrulama
3. ✅ Profil tamamlama (onboarding)
4. ✅ İlk ürün arama
5. ✅ Ürün detay sayfası inceleme
6. ✅ Sepete ekleme
7. ✅ Bakiye yükleme (Stripe ile)
8. ✅ Checkout işlemi
9. ✅ Sipariş onayı
10. ✅ Ürün teslimi

**Test Verileri:**
- Kullanıcı: `test-buyer-001@epinmarketplace.com`
- Ürün: Steam Wallet $20
- Bakiye: $50 yükleme
- Sipariş: $20 + $4 KDV = $24

### Senaryo 1.2: VIP Kullanıcı Deneyimi

**Adımlar:**
1. ✅ VIP statüsüne sahip kullanıcı
2. ✅ VIP indirimleri görüntüleme
3. ✅ Özel kampanyalara erişim
4. ✅ Hızlı checkout
5. ✅ Öncelikli destek

**Test Verileri:**
- Kullanıcı: `test-vip@epinmarketplace.com`
- VIP Tier: Gold
- İndirim: %10 VIP indirimi

---

## 2. 💳 Ödeme ve Bakiye Senaryoları

### Senaryo 2.1: Stripe ile Bakiye Yükleme

**Adımlar:**
1. ✅ Wallet deposit sayfasına git
2. ✅ Miktar seç ($50)
3. ✅ Stripe ödeme formunu doldur
4. ✅ Test kartı ile ödeme: `4242 4242 4242 4242`
5. ✅ Webhook ile bakiye güncelleme kontrolü
6. ✅ Transaction history'de görünme

**Stripe CLI Komutları:**
```bash
# Payment Intent oluştur
stripe payment_intents create --amount=5000 --currency=usd --description="Test deposit $50"

# Webhook test
stripe trigger payment_intent.succeeded
```

**Beklenen Sonuç:**
- `wallets.balance` += 50.00
- `wallet_transactions` tablosuna kayıt
- Notification oluşturulması

### Senaryo 2.2: Yetersiz Bakiye Senaryosu

**Adımlar:**
1. ✅ Kullanıcı bakiyesi: $10
2. ✅ Sepet toplamı: $50
3. ✅ Checkout denemesi
4. ✅ Yetersiz bakiye uyarısı
5. ✅ Deposit sayfasına yönlendirme
6. ✅ Bakiye yükleme
7. ✅ Tekrar checkout

**Test Verileri:**
- Mevcut bakiye: $10
- Sepet: $50
- Yüklenecek: $50

### Senaryo 2.3: Seller Payout İşlemi

**Adımlar:**
1. ✅ Seller hesabında escrow balance: $100
2. ✅ Payout isteği
3. ✅ Stripe Transfer oluşturma
4. ✅ Frozen balance kontrolü
5. ✅ Transfer webhook kontrolü
6. ✅ Balance güncelleme

**Stripe CLI Komutları:**
```bash
# Transfer oluştur
stripe transfers create --amount=10000 --currency=usd --destination=acct_xxxxx

# Webhook test
stripe trigger transfer.paid
```

---

## 3. 🎁 Kampanya ve İndirim Senaryoları

### Senaryo 3.1: İndirim Kodu Kullanımı

**Adımlar:**
1. ✅ Kampanya oluştur (Admin)
   - Kod: `WELCOME20`
   - İndirim: %20
   - Min. tutar: $50
   - Max. kullanım: 100
2. ✅ Kullanıcı sepete ürün ekler ($60)
3. ✅ İndirim kodunu girer
4. ✅ İndirim uygulanır ($12)
5. ✅ Final tutar: $48 + KDV
6. ✅ Checkout tamamlanır
7. ✅ Kampanya kullanım sayısı güncellenir

**Test Verileri:**
- Kampanya: `WELCOME20`
- İndirim: %20
- Sepet: $60
- İndirim: $12
- Final: $48 + $9.60 KDV = $57.60

### Senaryo 3.2: Flash Sale Kampanyası

**Adımlar:**
1. ✅ Admin flash sale kampanyası oluşturur
   - Süre: 24 saat
   - İndirim: %30
   - Ürünler: Steam kategorisi
2. ✅ Homepage'de flash deals görünür
3. ✅ Kullanıcı flash sale ürünü seçer
4. ✅ İndirimli fiyat görünür
5. ✅ Sepete ekler
6. ✅ Checkout'ta indirim uygulanır

**Test Verileri:**
- Kampanya: Flash Sale Steam
- İndirim: %30
- Ürün: Steam Wallet $50
- İndirimli: $35

### Senaryo 3.3: Referral Program

**Adımlar:**
1. ✅ Kullanıcı referral link'i alır
2. ✅ Link'i paylaşır
3. ✅ Yeni kullanıcı kayıt olur (referral link ile)
4. ✅ Her iki kullanıcıya da bonus verilir
5. ✅ Bonus bakiyeye eklenir

**Test Verileri:**
- Referrer: `test-user-001@epinmarketplace.com`
- Referee: `test-user-002@epinmarketplace.com`
- Bonus: $5 her kullanıcıya

---

## 4. 🎰 Çekiliş ve Giveaway Senaryoları

### Senaryo 4.1: Creator Giveaway Oluşturma

**Adımlar:**
1. ✅ Creator hesabına giriş
2. ✅ Giveaway oluştur sayfası
3. ✅ Giveaway detayları:
   - Tip: Live Stream
   - Ödül: Steam Wallet $100
   - Katılım koşulları: Follow + Share
   - Bitiş: 7 gün sonra
4. ✅ Giveaway yayınlanır
5. ✅ Kullanıcılar katılır
6. ✅ Bitiş sonrası kazanan seçilir
7. ✅ Ödül otomatik dağıtılır

**Test Verileri:**
- Creator: `test-creator@epinmarketplace.com`
- Ödül: Steam Wallet $100
- Katılımcı: 50 kullanıcı
- Kazanan: 1 kullanıcı

### Senaryo 4.2: Milestone Giveaway

**Adımlar:**
1. ✅ Creator milestone belirler (10K followers)
2. ✅ Milestone'a ulaşınca giveaway başlar
3. ✅ Otomatik bildirim gönderilir
4. ✅ Kullanıcılar katılır
5. ✅ Kazanan seçilir

**Test Verileri:**
- Milestone: 1000 followers
- Ödül: 5x Steam Wallet $20
- Kazanan: 5 kullanıcı

---

## 5. 🏪 Satıcı İşlem Senaryoları

### Senaryo 5.1: Ürün Ekleme ve Yönetimi

**Adımlar:**
1. ✅ Seller dashboard'a giriş
2. ✅ Yeni ürün ekle
3. ✅ Ürün detayları:
   - İsim: "Steam Wallet $50"
   - Kategori: Steam
   - Fiyat: $45
   - Stok: 100
   - Açıklama ve görseller
4. ✅ Ürün yayınla
5. ✅ Ürün listing'de görünür
6. ✅ Sipariş gelir
7. ✅ Siparişi işleme al
8. ✅ Teslim et

**Test Verileri:**
- Seller: `test-seller@epinmarketplace.com`
- Ürün: Steam Wallet $50
- Fiyat: $45
- Stok: 100

### Senaryo 5.2: Satış Analizi ve Raporlama

**Adımlar:**
1. ✅ Seller analytics sayfası
2. ✅ Satış istatistikleri görüntüleme
3. ✅ Gelir grafikleri
4. ✅ En çok satan ürünler
5. ✅ Müşteri analizi
6. ✅ Rapor export

**Test Verileri:**
- Toplam satış: $1000
- Ürün sayısı: 50
- Müşteri sayısı: 25

---

## 6. 🎨 Creator İşlem Senaryoları

### Senaryo 6.1: Kampanya Oluşturma ve Yönetimi

**Adımlar:**
1. ✅ Creator dashboard'a giriş
2. ✅ Yeni kampanya oluştur
3. ✅ Kampanya detayları:
   - Platform: Twitch
   - Ürünler: Steam Wallet
   - Komisyon: %10
   - Bütçe: $500
4. ✅ Kampanya aktif edilir
5. ✅ Performans takibi
6. ✅ Gelir görüntüleme

**Test Verileri:**
- Creator: `test-creator@epinmarketplace.com`
- Platform: Twitch
- Komisyon: %10
- Satış: $1000
- Gelir: $100

### Senaryo 6.2: Audience Analytics

**Adımlar:**
1. ✅ Creator audience sayfası
2. ✅ Follower istatistikleri
3. ✅ Demografik analiz
4. ✅ Conversion rate
5. ✅ Top performing content

---

## 7. 👨‍💼 Admin Yönetim Senaryoları

### Senaryo 7.1: Kullanıcı Doğrulama

**Adımlar:**
1. ✅ Admin verification sayfası
2. ✅ Bekleyen doğrulamaları görüntüle
3. ✅ KYC belgelerini incele
4. ✅ Video KYC kontrolü
5. ✅ Onay/Red kararı
6. ✅ Kullanıcıya bildirim

**Test Verileri:**
- Kullanıcı: `test-seller-001@epinmarketplace.com`
- Tip: Seller Verification
- Durum: Pending → Approved

### Senaryo 7.2: Platform İstatistikleri

**Adımlar:**
1. ✅ Admin dashboard
2. ✅ Genel istatistikler:
   - Aktif kullanıcılar
   - Günlük satış
   - Gelir
   - Ortalama işlem değeri
3. ✅ Grafikler ve trendler
4. ✅ Sistem sağlığı

---

## 🧪 Test Senaryoları Çalıştırma

### Lokal Test Ortamı Kurulumu

```bash
# 1. Dependencies yükle
cd epin-marketplace
npm install

# 2. Environment variables
cp .env.local.example .env.local
# .env.local dosyasını düzenle

# 3. Development server
npm run dev

# 4. Stripe webhook forwarding (ayrı terminal)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Test Verileri Hazırlama

```bash
# Test kullanıcıları oluştur
npm run seed:users

# Test verileri seed et
# Supabase SQL Editor'de:
# supabase/seed_comprehensive_test_data.sql
```

### Senaryo Çalıştırma Checklist

- [ ] Development server çalışıyor
- [ ] Stripe webhook forwarding aktif
- [ ] Supabase bağlantısı çalışıyor
- [ ] Test kullanıcıları oluşturuldu
- [ ] Test verileri seed edildi
- [ ] Stripe test mode aktif

---

## 📊 Senaryo Sonuçları

Her senaryo çalıştırıldıktan sonra:

1. ✅ **Veritabanı Kontrolü**: İlgili tablolarda kayıtlar oluştu mu?
2. ✅ **Webhook Kontrolü**: Stripe webhook'ları çalıştı mı?
3. ✅ **Notification Kontrolü**: Kullanıcılara bildirimler gitti mi?
4. ✅ **Balance Kontrolü**: Bakiye güncellemeleri doğru mu?
5. ✅ **UI Kontrolü**: Sayfalar doğru görünüyor mu?
6. ✅ **Error Kontrolü**: Hata logları var mı?

---

*Son Güncelleme: Sprint 43 Sonrası*

