# Stripe Entegrasyon Rehberi

## 🎯 Sistem Mimarisi

### Bakiye Sistemi

**Önemli:** Kendi bakiye sistemimiz kullanılıyor, Stripe balance değil!

```
┌─────────────────────────────────────────────────┐
│         KULLANICI BAKİYE SİSTEMİMİZ            │
│         (wallets tablosu - Supabase)          │
└─────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   DEPOSIT                  WITHDRAWAL
   (Stripe ile)            (Stripe Transfer)
        │                       │
        ▼                       ▼
┌───────────────┐      ┌───────────────┐
│ Stripe Payment│      │ Stripe Transfer│
│   Intent      │      │  (Seller'a)   │
└───────────────┘      └───────────────┘
```

### İşlem Akışları

#### 1. Deposit (Bakiye Yükleme)

```
Kullanıcı → Deposit Sayfası → Stripe Payment Intent
    ↓
Stripe Ödeme İşleme
    ↓
Webhook: payment_intent.succeeded
    ↓
Kendi Sistemimize Bakiye Ekleme
    ↓
wallets.balance += amount
```

**Kod:**
- `epin-marketplace/src/app/actions/deposit.ts` - Deposit intent oluşturma
- `epin-marketplace/src/app/api/webhooks/stripe/route.ts` - Webhook handler
- `epin-marketplace/src/lib/payment/stripe.ts` - Stripe helper functions

#### 2. Purchase (Ürün Satın Alma)

```
Kullanıcı → Sepet → Checkout
    ↓
Kendi Bakiye Sistemimizden Kontrol
    ↓
Yeterli Bakiye Varsa:
    - wallets.balance -= total
    - Sipariş oluştur
    - Seller escrow_balance += amount
```

**Kod:**
- `epin-marketplace/src/app/actions/checkout.ts` - Checkout işlemi
- Stripe kullanılmaz (kendi bakiye sistemimiz)

#### 3. Payout (Seller Çekim)

```
Seller → Payout İsteği
    ↓
Kendi Sistemimizden:
    - wallets.balance -= amount + fee
    - wallets.frozen_balance += amount + fee
    ↓
Stripe Transfer Oluştur
    ↓
Webhook: transfer.paid
    ↓
frozen_balance -= amount
```

**Kod:**
- `epin-marketplace/src/app/actions/payout.ts` - Payout işlemi
- `epin-marketplace/src/app/api/webhooks/stripe/route.ts` - Transfer webhooks

---

## 🔧 Stripe CLI Kurulumu

### 1. Kurulum

**Windows:**
```powershell
scoop install stripe
```

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
npm install -g stripe-cli
```

### 2. Login

```bash
stripe login
```

### 3. Webhook Forwarding (Local)

```bash
# Terminal 1: Development server
cd epin-marketplace
npm run dev

# Terminal 2: Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Webhook Secret:**
```
> Ready! Your webhook signing secret is whsec_xxxxx
```

`.env.local` dosyasına ekle:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 4. Test Webhook'ları

```bash
# Deposit başarılı
stripe trigger payment_intent.succeeded

# Deposit başarısız
stripe trigger payment_intent.payment_failed

# Payout başarılı
stripe trigger transfer.paid

# Payout başarısız
stripe trigger transfer.failed
```

---

## 💳 Test Kartları

| Senaryo | Kart Numarası | Sonuç |
|---------|--------------|-------|
| Başarılı | `4242 4242 4242 4242` | ✅ Başarılı |
| 3D Secure | `4000 0025 0000 3155` | 🔐 3D Secure |
| Reddedildi | `4000 0000 0000 0002` | ❌ Reddedildi |
| Yetersiz Bakiye | `4000 0000 0000 9995` | 💰 Yetersiz |

**Detaylar:**
- Expiry: Herhangi bir gelecek tarih (örn: `12/34`)
- CVC: Herhangi bir 3 haneli sayı (örn: `123`)
- ZIP: Herhangi bir 5 haneli sayı (örn: `12345`)

---

## 📊 Veritabanı Yapısı

### wallets Tablosu

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  currency VARCHAR(3),
  balance DECIMAL(12,2),        -- Kullanılabilir bakiye
  escrow_balance DECIMAL(12,2), -- Seller için escrow (bekleyen ödemeler)
  bonus_balance DECIMAL(12,2),   -- Bonus bakiye
  frozen_balance DECIMAL(12,2),  -- Dondurulmuş bakiye (payout için)
  ...
);
```

### wallet_transactions Tablosu

```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY,
  wallet_id UUID REFERENCES wallets(id),
  user_id UUID REFERENCES profiles(id),
  transaction_type VARCHAR(50), -- 'deposit', 'withdrawal', 'payment', 'refund', 'bonus'
  amount DECIMAL(12,2),         -- Pozitif: deposit, Negatif: withdrawal/payment
  currency VARCHAR(3),
  status VARCHAR(50),           -- 'pending', 'completed', 'failed', 'cancelled'
  metadata JSONB,               -- Stripe payment_intent_id, transfer_id, vb.
  ...
);
```

---

## 🔄 Webhook Events

### payment_intent.succeeded

**Ne zaman:** Kullanıcı deposit yaptığında ve ödeme başarılı olduğunda

**Yapılan:**
1. Transaction status → `completed`
2. `wallets.balance` += deposit amount

**Kod:**
```typescript
// epin-marketplace/src/app/api/webhooks/stripe/route.ts
case 'payment_intent.succeeded':
  // Bakiye ekleme
  await supabase
    .from('wallets')
    .update({
      balance: (currentBalance + depositAmount).toString(),
    })
```

### payment_intent.payment_failed

**Ne zaman:** Deposit ödemesi başarısız olduğunda

**Yapılan:**
1. Transaction status → `failed`

### transfer.paid

**Ne zaman:** Seller payout'u Stripe tarafından ödendiğinde

**Yapılan:**
1. Transaction status → `completed`
2. `wallets.frozen_balance` -= payout amount

### transfer.failed

**Ne zaman:** Payout transferi başarısız olduğunda

**Yapılan:**
1. Transaction status → `failed`
2. `wallets.balance` += refund amount (geri iade)
3. `wallets.frozen_balance` -= amount

---

## 🚀 Kullanım Senaryoları

### Senaryo 1: Kullanıcı Bakiye Yükleme

```typescript
// 1. Deposit intent oluştur
const result = await createDepositIntent(100, 'USD', 'credit_card');

// 2. Stripe Elements ile ödeme
// (client-side)

// 3. Webhook otomatik olarak bakiye ekler
// payment_intent.succeeded → wallets.balance += 100
```

### Senaryo 2: Ürün Satın Alma

```typescript
// 1. Checkout
const result = await processCheckout();

// 2. Kendi bakiye sistemimizden kontrol
if (wallet.balance >= total) {
  // 3. Bakiye düş
  wallets.balance -= total;
  // 4. Sipariş oluştur
  // 5. Seller escrow_balance += amount
}
```

### Senaryo 3: Seller Payout

```typescript
// 1. Payout iste
const result = await requestPayout(500, 'USD', 'bank', {
  accountNumber: '1234567890',
  routingNumber: '987654321',
});

// 2. Sistem:
// - wallets.balance -= 502.50 (500 + 2.50 fee)
// - wallets.frozen_balance += 502.50

// 3. Stripe Transfer oluştur (seller'ın Stripe Connect hesabına)

// 4. Webhook: transfer.paid
// - wallets.frozen_balance -= 502.50
```

---

## 🔐 Environment Variables

```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # stripe listen çıktısından

# Payment Environment
PAYMENT_ENVIRONMENT=test  # veya 'production'
```

---

## ✅ Checklist

### Local Development
- [ ] Stripe CLI kuruldu
- [ ] `stripe login` yapıldı
- [ ] `stripe listen` çalışıyor
- [ ] Webhook secret `.env.local`'e eklendi
- [ ] Test webhook'ları gönderildi
- [ ] Deposit test edildi
- [ ] Purchase test edildi
- [ ] Payout test edildi

### Production
- [ ] Production Stripe keys eklendi
- [ ] Webhook URL Vercel'de ayarlandı
- [ ] Webhook secret production'a eklendi
- [ ] Transfer webhooks test edildi
- [ ] Seller Stripe Connect entegrasyonu hazır

---

## 🐛 Troubleshooting

### Webhook çalışmıyor
```bash
# Webhook secret kontrol
echo $STRIPE_WEBHOOK_SECRET

# Stripe listen yeniden başlat
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test webhook gönder
stripe trigger payment_intent.succeeded
```

### Bakiye güncellenmiyor
1. Webhook loglarını kontrol et
2. Transaction status'ü kontrol et
3. Wallet balance'ı manuel kontrol et
4. Webhook handler'da hata var mı kontrol et

### Payout çalışmıyor
1. Seller'ın Stripe Connect hesabı var mı?
2. Transfer oluşturuldu mu?
3. Webhook: transfer.paid geldi mi?
4. frozen_balance doğru güncelleniyor mu?

---

## 📝 Önemli Notlar

1. **Stripe Balance ≠ Kullanıcı Bakiyeleri**
   - Stripe balance sadece platform hesabı için
   - Kullanıcı bakiyeleri `wallets` tablosunda

2. **Deposit → Stripe, Purchase → Kendi Sistemimiz**
   - Deposit: Stripe ile ödeme al, bakiye ekle
   - Purchase: Kendi bakiye sistemimizden düş

3. **Payout → Stripe Transfer**
   - Seller payout: Stripe Transfer ile seller'a para gönder
   - frozen_balance ile güvenli tut

4. **Webhook Güvenliği**
   - Her zaman webhook secret kontrol et
   - Signature verification yap
   - Idempotency kontrol et

---

*Son Güncelleme: Sprint 43 Sonrası*

