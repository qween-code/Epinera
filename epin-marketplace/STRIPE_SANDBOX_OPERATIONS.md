# Stripe Sandbox İşlemleri Rehberi

Bu döküman, Stripe CLI ile sandbox hesabında yapılacak tüm işlemleri içerir.

## 🚀 Hızlı Başlangıç

### 1. Stripe CLI Kurulumu

```powershell
# Otomatik kurulum
npm run stripe:install

# Veya manuel
scoop install stripe
```

### 2. Tam Yapılandırma

```powershell
# Tüm yapılandırmayı otomatik yap
npm run stripe:setup
```

Bu komut şunları yapar:
- ✅ Stripe CLI kurulumu
- ✅ Login işlemi
- ✅ Test mode aktifleştirme
- ✅ API Key kontrolü
- ✅ Balance kontrolü
- ✅ Son işlemleri listeleme

## 📋 Sandbox İşlemleri

### Balance İşlemleri

```powershell
# Balance bilgisi
stripe balance retrieve

# Balance transactions
stripe balance_transactions list --limit 10

# Balance history
stripe balance_transactions list --limit 20
```

### Payment Intent İşlemleri

```powershell
# Payment Intent oluştur (test deposit)
stripe payment_intents create `
    --amount=2000 `
    --currency=usd `
    --metadata[user_id]=test-user-123 `
    --metadata[transaction_id]=test-tx-456 `
    --metadata[test]=true `
    --description="Test deposit"

# Payment Intent listesi
stripe payment_intents list --limit 10

# Belirli Payment Intent detayı
stripe payment_intents retrieve pi_xxxxx

# Payment Intent iptal et
stripe payment_intents cancel pi_xxxxx
```

### Transfer İşlemleri (Payout)

```powershell
# Transfer oluştur (test payout)
stripe transfers create `
    --amount=1000 `
    --currency=usd `
    --destination=acct_xxxxx `
    --metadata[user_id]=seller-123 `
    --metadata[transaction_id]=payout-456 `
    --metadata[test]=true

# Transfer listesi
stripe transfers list --limit 10

# Belirli Transfer detayı
stripe transfers retrieve tr_xxxxx
```

### Customer İşlemleri

```powershell
# Customer oluştur
stripe customers create `
    --email="test-buyer@epinmarketplace.com" `
    --name="Test Buyer" `
    --metadata[test]=true `
    --metadata[role]=buyer

# Customer listesi
stripe customers list --limit 10

# Customer detayı
stripe customers retrieve cus_xxxxx

# Customer güncelle
stripe customers update cus_xxxxx --metadata[verified]=true
```

### Event İşlemleri

```powershell
# Son events
stripe events list --limit 20

# Belirli event tipi
stripe events list --type=payment_intent.succeeded --limit 10

# Event detayı
stripe events retrieve evt_xxxxx

# Event resend (webhook için)
stripe events resend evt_xxxxx
```

### Webhook İşlemleri

```powershell
# Webhook forwarding başlat
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Webhook endpoint'leri listele
stripe webhook_endpoints list

# Test webhook gönder
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger transfer.paid
stripe trigger transfer.failed
```

## 🧪 Test Senaryoları

### Senaryo 1: Deposit Test

```powershell
# 1. Payment Intent oluştur
$paymentIntent = stripe payment_intents create `
    --amount=5000 `
    --currency=usd `
    --metadata[user_id]=test-user-123 `
    --metadata[transaction_id]=deposit-tx-001 `
    --metadata[test]=true

# 2. Payment Intent ID'yi al
# Çıktıdan "pi_xxxxx" ID'sini kopyala

# 3. Test kartı ile confirm et (client-side'da)
# Kart: 4242 4242 4242 4242

# 4. Event kontrol et
stripe events list --type=payment_intent.succeeded --limit 1
```

### Senaryo 2: Payout Test

```powershell
# 1. Transfer oluştur (seller payout)
$transfer = stripe transfers create `
    --amount=2000 `
    --currency=usd `
    --destination=acct_xxxxx `
    --metadata[user_id]=seller-123 `
    --metadata[transaction_id]=payout-tx-001 `
    --metadata[test]=true

# 2. Transfer ID'yi al
# Çıktıdan "tr_xxxxx" ID'sini kopyala

# 3. Event kontrol et
stripe events list --type=transfer.paid --limit 1
```

### Senaryo 3: Webhook Test

```powershell
# Terminal 1: Webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 2: Test webhook gönder
stripe trigger payment_intent.succeeded

# Terminal 1'de webhook'u göreceksiniz
```

## 📊 Monitoring ve Debugging

### İşlem İzleme

```powershell
# Real-time events izle
stripe events list --limit 20

# Belirli kullanıcı için işlemler
stripe payment_intents list --metadata[user_id]=test-user-123

# Başarısız işlemler
stripe payment_intents list --limit 20 | Select-String "failed"
```

### Log Kontrolü

```powershell
# Son 50 event
stripe events list --limit 50

# Hata event'leri
stripe events list --limit 20 | Select-String "error\|failed"

# Webhook başarısızlıkları
stripe events list --type=webhook_endpoint.event_failed --limit 10
```

## 🔧 Yapılandırma

### Config Ayarları

```powershell
# Test mode aktif
stripe config --set test_mode true

# Production mode
stripe config --set test_mode false

# Config listesi
stripe config --list

# API Key göster
stripe config --get test_mode_api_key
stripe config --get live_mode_api_key
```

### Environment Variables

`.env.local` dosyasında:

```env
# Stripe Sandbox Keys
STRIPE_SECRET_KEY=sk_test_...  # stripe config --get test_mode_api_key
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Stripe Dashboard'dan
STRIPE_WEBHOOK_SECRET=whsec_...  # stripe listen çıktısından
PAYMENT_ENVIRONMENT=test
```

## 🎯 Kullanım Senaryoları

### Senaryo 1: Kullanıcı Deposit

```powershell
# 1. Payment Intent oluştur
stripe payment_intents create `
    --amount=10000 `
    --currency=usd `
    --metadata[user_id]=user-123 `
    --metadata[transaction_id]=tx-001

# 2. Client-side'da kart bilgileri ile confirm
# Kart: 4242 4242 4242 4242

# 3. Webhook otomatik olarak bakiye ekler
# wallets.balance += 100.00
```

### Senaryo 2: Seller Payout

```powershell
# 1. Transfer oluştur
stripe transfers create `
    --amount=5000 `
    --currency=usd `
    --destination=acct_seller_123 `
    --metadata[user_id]=seller-123 `
    --metadata[transaction_id]=payout-001

# 2. Webhook otomatik olarak frozen_balance düşer
# wallets.frozen_balance -= 50.00
```

### Senaryo 3: Refund İşlemi

```powershell
# 1. Refund oluştur
stripe refunds create `
    --payment_intent=pi_xxxxx `
    --amount=2000 `
    --metadata[user_id]=user-123 `
    --metadata[reason]=requested_by_customer

# 2. Webhook ile bakiye geri eklenir
# wallets.balance += 20.00
```

## 📝 Test Verileri

### Test Kartları

| Senaryo | Kart | Sonuç |
|---------|------|-------|
| Başarılı | `4242 4242 4242 4242` | ✅ |
| 3D Secure | `4000 0025 0000 3155` | 🔐 |
| Reddedildi | `4000 0000 0000 0002` | ❌ |
| Yetersiz | `4000 0000 0000 9995` | 💰 |

### Test Metadata

Tüm test işlemlerinde metadata kullanın:

```powerscript
--metadata[test]=true
--metadata[user_id]=user-123
--metadata[transaction_id]=tx-001
--metadata[description]="Test deposit"
```

## ✅ Checklist

### Kurulum
- [ ] Stripe CLI kuruldu
- [ ] Login yapıldı
- [ ] Test mode aktif
- [ ] API Key'ler `.env.local`'de

### Webhook
- [ ] Webhook forwarding çalışıyor
- [ ] Webhook secret `.env.local`'e eklendi
- [ ] Test webhook'ları gönderildi

### Test İşlemleri
- [ ] Deposit test edildi
- [ ] Payout test edildi
- [ ] Webhook'lar çalışıyor
- [ ] Balance senkronize

## 🐛 Troubleshooting

### Stripe CLI bulunamıyor

```powershell
# Scoop ile kurulum
scoop install stripe

# PATH kontrolü
$env:PATH

# Yeniden başlat
refreshenv
```

### Login sorunu

```powershell
# Logout
stripe logout

# Yeniden login
stripe login
```

### Webhook çalışmıyor

```powershell
# Webhook secret kontrol
echo $env:STRIPE_WEBHOOK_SECRET

# Listen yeniden başlat
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test webhook
stripe trigger payment_intent.succeeded
```

---

*Son Güncelleme: Sprint 43 Sonrası*

