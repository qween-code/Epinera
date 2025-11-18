# Stripe CLI Kurulum ve Kullanım Rehberi

## 🚀 Hızlı Başlangıç

### API Key'lerle Bağlantı

**API Key'ler `.env.local` dosyasında olmalı:**
- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_PUBLISHABLE_KEY=pk_test_...`

```powershell
# API Key'lerle sandbox'a bağlan
npm run stripe:connect
```

**Not:** API Key'leri script'e parametre olarak da geçebilirsiniz:
```powershell
.\scripts\stripe-connect-sandbox.ps1 -SecretKey "sk_test_..." -PublishableKey "pk_test_..."
```

Bu komut:
- ✅ API Key'leri Stripe CLI'ye yapılandırır
- ✅ Balance kontrolü yapar
- ✅ Son işlemleri listeler
- ✅ Test Payment Intent oluşturur
- ✅ Test Customer oluşturur

### Windows Kurulumu

```powershell
# Otomatik kurulum (önerilen)
npm run stripe:install

# Veya manuel:
scoop install stripe
```

### Tam Yapılandırma

```powershell
# Tüm yapılandırmayı otomatik yap
npm run stripe:setup
```

Bu script şunları yapar:
1. ✅ Stripe CLI kurulumu kontrolü
2. ✅ Login kontrolü ve login
3. ✅ Test mode aktifleştirme
4. ✅ API Key kontrolü
5. ✅ Balance kontrolü
6. ✅ Son işlemleri listeleme

## 📋 Komutlar

### Temel Komutlar

```powershell
# Versiyon kontrolü
stripe --version

# Login
stripe login

# Config kontrolü
stripe config --list

# Test mode aktifleştir
stripe config --set test_mode true
```

### Balance ve İşlemler

```powershell
# Balance bilgisi
stripe balance retrieve

# Payment Intents listesi
stripe payment_intents list --limit 10

# Transfers listesi
stripe transfers list --limit 10

# Events listesi
stripe events list --limit 10
```

### Test İşlemleri

```powershell
# Test işlemleri script'i
npm run stripe:test

# Manuel test payment intent
stripe payment_intents create --amount=2000 --currency=usd --metadata[test]=true

# Test customer oluştur
stripe customers create --email="test@example.com" --name="Test Customer"
```

### Webhook Forwarding

```powershell
# Webhook setup script'i
npm run stripe:webhook

# Veya manuel:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Webhook Secret:**
Çıktıdaki `whsec_...` değerini `.env.local` dosyasına ekleyin:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Test Webhook'ları

```powershell
# Payment intent succeeded
stripe trigger payment_intent.succeeded

# Payment intent failed
stripe trigger payment_intent.payment_failed

# Transfer paid
stripe trigger transfer.paid

# Transfer failed
stripe trigger transfer.failed
```

## 🔍 Sandbox İşlemleri

### Payment Intent Oluşturma

```powershell
# Test deposit için
stripe payment_intents create `
    --amount=2000 `
    --currency=usd `
    --metadata[user_id]=test-user-id `
    --metadata[transaction_id]=test-transaction-id `
    --metadata[test]=true
```

### Transfer Oluşturma (Payout)

```powershell
# Test payout için (seller'a)
stripe transfers create `
    --amount=1000 `
    --currency=usd `
    --destination=acct_xxxxx `
    --metadata[user_id]=seller-id `
    --metadata[transaction_id]=payout-id
```

### Customer İşlemleri

```powershell
# Customer oluştur
stripe customers create `
    --email="test@epinmarketplace.com" `
    --name="Test User" `
    --metadata[test]=true

# Customer listesi
stripe customers list --limit 10
```

## 📊 Monitoring

### Events İzleme

```powershell
# Real-time events
stripe events list --limit 20

# Belirli event tipi
stripe events list --type=payment_intent.succeeded --limit 10
```

### Balance Monitoring

```powershell
# Balance bilgisi
stripe balance retrieve

# Balance transactions
stripe balance_transactions list --limit 10
```

## 🛠️ Troubleshooting

### Stripe CLI bulunamıyor

```powershell
# Scoop ile kurulum
scoop install stripe

# PATH kontrolü
$env:PATH

# Manuel kurulum
# https://github.com/stripe/stripe-cli/releases
```

### Login sorunu

```powershell
# Logout yap
stripe logout

# Yeniden login
stripe login
```

### Webhook çalışmıyor

```powershell
# Webhook secret kontrolü
echo $env:STRIPE_WEBHOOK_SECRET

# Listen'i yeniden başlat
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test webhook gönder
stripe trigger payment_intent.succeeded
```

## 📝 Environment Variables

`.env.local` dosyasında olması gerekenler:

```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # stripe listen çıktısından

# Payment Environment
PAYMENT_ENVIRONMENT=test
```

## ✅ Checklist

- [ ] Stripe CLI kuruldu (`npm run stripe:install`)
- [ ] Login yapıldı (`stripe login`)
- [ ] Test mode aktif (`stripe config --set test_mode true`)
- [ ] API Key'ler `.env.local`'de
- [ ] Webhook forwarding çalışıyor (`npm run stripe:webhook`)
- [ ] Webhook secret `.env.local`'e eklendi
- [ ] Test webhook'ları gönderildi
- [ ] Balance kontrol edildi

## 🎯 Kullanım Senaryoları

### Senaryo 1: Deposit Test

```powershell
# 1. Payment Intent oluştur
stripe payment_intents create --amount=2000 --currency=usd

# 2. Test kartı ile ödeme yap (4242 4242 4242 4242)

# 3. Webhook kontrol et
stripe events list --type=payment_intent.succeeded --limit 1
```

### Senaryo 2: Payout Test

```powershell
# 1. Transfer oluştur
stripe transfers create --amount=1000 --currency=usd --destination=acct_xxxxx

# 2. Webhook kontrol et
stripe events list --type=transfer.paid --limit 1
```

### Senaryo 3: Webhook Test

```powershell
# 1. Webhook forwarding başlat
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 2. Test webhook gönder
stripe trigger payment_intent.succeeded

# 3. Logları kontrol et
```

---

*Son Güncelleme: Sprint 43 Sonrası*

