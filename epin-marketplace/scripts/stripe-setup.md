# Stripe CLI Kurulum ve Bağlantı Rehberi

## 🚀 Hızlı Başlangıç

### 1. Stripe CLI Kurulumu

**Windows (Scoop):**
```powershell
scoop install stripe
```

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Debian/Ubuntu
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_*_linux_x86_64.tar.gz
tar -xvf stripe_*_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/

# veya npm ile
npm install -g stripe-cli
```

### 2. Stripe CLI Login

```bash
stripe login
```

Bu komut tarayıcınızı açacak ve Stripe hesabınıza giriş yapmanızı isteyecek.

### 3. Test Modunu Kontrol Et

```bash
# Mevcut modu kontrol et
stripe config --list

# Test modunda olduğundan emin ol
# Eğer production modundaysa:
stripe config --set test_mode true
```

### 4. Webhook Forwarding (Local Development)

```bash
# Terminal 1: Development server
cd epin-marketplace
npm run dev

# Terminal 2: Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Bu komut çıktısında bir webhook signing secret göreceksiniz:
```
> Ready! Your webhook signing secret is whsec_xxxxx
```

Bu secret'ı `.env.local` dosyasına ekleyin:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 5. Test Webhook Gönder

```bash
# Payment intent succeeded event
stripe trigger payment_intent.succeeded

# Payment intent failed event
stripe trigger payment_intent.payment_failed

# Transfer created event (payout)
stripe trigger transfer.created

# Transfer paid event
stripe trigger transfer.paid
```

## 🔍 Stripe Dashboard Kontrolleri

### Sandbox Ortamı

1. **Stripe Dashboard'a giriş yap**: https://dashboard.stripe.com/test
2. **API Keys kontrol et**:
   - Settings → API keys
   - Test mode'da olduğundan emin ol
   - `pk_test_...` ve `sk_test_...` key'leri kopyala

3. **Webhooks kontrol et**:
   - Developers → Webhooks
   - Local development için: `stripe listen` kullan
   - Production için: Vercel URL'i ekle

### Balance ve Payouts

**Önemli:** Stripe'ın kendi balance sistemi var ama bizim sistemimizde:
- ✅ Kullanıcılar **kendi bakiye sistemimizde** (wallets tablosu) bakiye yükler
- ✅ Ürün satın alımları **kendi bakiye sistemimizden** düşer
- ✅ Seller'lar payout istediğinde **Stripe'a transfer** yapılır

**Stripe Balance Kullanımı:**
- Stripe balance sadece **platform hesabı** için (bizim hesabımız)
- Kullanıcı bakiyeleri **kendi sistemimizde** tutulur
- Seller payout'ları için Stripe Transfer kullanılır

## 💳 Test Kartları

### Başarılı Ödemeler
```
Kart: 4242 4242 4242 4242
Expiry: Herhangi bir gelecek tarih (örn: 12/34)
CVC: Herhangi bir 3 haneli sayı (örn: 123)
ZIP: Herhangi bir 5 haneli sayı (örn: 12345)
```

### Senaryolar
- **Başarılı**: `4242 4242 4242 4242`
- **3D Secure**: `4000 0025 0000 3155`
- **Reddedildi**: `4000 0000 0000 0002`
- **Yetersiz Bakiye**: `4000 0000 0000 9995`

## 🔄 İşlem Akışı

### Deposit (Bakiye Yükleme)
1. Kullanıcı deposit sayfasında miktar girer
2. Stripe Payment Intent oluşturulur
3. Kullanıcı kart bilgilerini girer
4. Stripe ödemeyi işler
5. Webhook: `payment_intent.succeeded` → Bakiye **kendi sistemimize** eklenir
6. `wallets` tablosunda `balance` artar

### Purchase (Ürün Satın Alma)
1. Kullanıcı sepete ürün ekler
2. Checkout'ta **kendi bakiye sistemimizden** kontrol edilir
3. Yeterli bakiye varsa:
   - `wallets.balance` düşer
   - Sipariş oluşturulur
   - Seller'ın `escrow_balance` artar
4. Stripe kullanılmaz (kendi bakiye sistemimiz)

### Payout (Seller Çekim)
1. Seller payout ister
2. `wallets.balance` düşer, `frozen_balance` artar
3. Stripe Transfer oluşturulur (seller'ın Stripe Connect hesabına)
4. Webhook: `transfer.paid` → `frozen_balance` düşer
5. Para seller'ın banka hesabına gider

## 🛠️ Troubleshooting

### Webhook çalışmıyor
```bash
# Webhook signing secret kontrol et
echo $STRIPE_WEBHOOK_SECRET

# Stripe listen'i yeniden başlat
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test webhook gönder
stripe trigger payment_intent.succeeded
```

### Stripe CLI bağlanamıyor
```bash
# Login durumunu kontrol et
stripe config --list

# Yeniden login
stripe login

# API key'leri kontrol et
stripe config --get test_mode_api_key
```

### Balance senkronizasyonu
- Stripe balance ≠ Kullanıcı bakiyeleri
- Kullanıcı bakiyeleri `wallets` tablosunda
- Stripe balance sadece platform hesabı için

## 📝 Environment Variables

```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # stripe listen çıktısından
PAYMENT_ENVIRONMENT=test
```

## ✅ Checklist

- [ ] Stripe CLI kuruldu
- [ ] `stripe login` yapıldı
- [ ] Test modunda olduğu doğrulandı
- [ ] Webhook forwarding çalışıyor
- [ ] Webhook secret `.env.local`'e eklendi
- [ ] Test webhook'ları gönderildi
- [ ] Deposit işlemi test edildi
- [ ] Payout işlemi test edildi

---

*Son Güncelleme: Sprint 43 Sonrası*

