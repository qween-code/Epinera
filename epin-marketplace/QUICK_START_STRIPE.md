# Stripe Hızlı Başlangıç

## 🔑 API Key'leri Ayarlama

### 1. .env.local Dosyası Oluştur

```powershell
cd epin-marketplace
copy .env.local.example .env.local
```

### 2. Stripe API Key'lerini Ekleyin

`.env.local` dosyasını düzenleyin ve Stripe Dashboard'dan aldığınız key'leri ekleyin:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYMENT_ENVIRONMENT=test
```

**Stripe Dashboard:**
- https://dashboard.stripe.com/test/apikeys
- Test mode'da olduğundan emin olun

### 3. Stripe CLI Kurulumu

```powershell
# Otomatik kurulum
npm run stripe:install

# Veya manuel
scoop install stripe
```

### 4. Sandbox'a Bağlan

```powershell
# API Key'lerle sandbox'a bağlan
npm run stripe:connect
```

Bu komut:
- ✅ `.env.local`'den key'leri okur
- ✅ Stripe CLI'ye yapılandırır
- ✅ Balance kontrolü yapar
- ✅ Test işlemleri yapar

### 5. Webhook Forwarding

```powershell
# Terminal 1: Development server
npm run dev

# Terminal 2: Webhook forwarding
npm run stripe:listen
```

Webhook secret'ı çıktıdan kopyalayıp `.env.local`'e ekleyin:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🧪 Test İşlemleri

### Test Payment

```powershell
npm run stripe:test:payment
```

### Test Payout

```powershell
npm run stripe:test:payout
```

### Test Webhook'ları

```powershell
# Payment intent succeeded
stripe trigger payment_intent.succeeded

# Payment intent failed
stripe trigger payment_intent.payment_failed

# Transfer paid
stripe trigger transfer.paid
```

## ✅ Checklist

- [ ] `.env.local` dosyası oluşturuldu
- [ ] Stripe API key'leri eklendi
- [ ] Stripe CLI kuruldu
- [ ] `npm run stripe:connect` çalıştırıldı
- [ ] Webhook forwarding başlatıldı
- [ ] Webhook secret `.env.local`'e eklendi
- [ ] Test işlemleri yapıldı

---

*Son Güncelleme: Sprint 43 Sonrası*

