# Quick Start: Supabase CLI + Stripe CLI

## 🎯 Hızlı Başlangıç (5 Dakika)

### 1. Migration Uygula (2 dakika)

**Supabase Dashboard:**
1. https://supabase.com/dashboard → `Epinera` projesi
2. SQL Editor → `APPLY_MIGRATION.md` dosyasındaki SQL'i çalıştır

**Veya CLI ile (Docker gerekli):**
```bash
npx supabase db push --linked
```

### 2. Stripe CLI Kur (1 dakika)

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-stripe-cli.ps1
stripe login
```

### 3. Test Senaryolarını Çalıştır (2 dakika)

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Terminal 3:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-stripe-tests.ps1
```

## ✅ Hazır!

Artık:
- ✅ Database schema güncel
- ✅ Stripe entegrasyonu çalışıyor
- ✅ Webhook'lar dinleniyor
- ✅ Test senaryoları hazır

## 📚 Detaylı Bilgi

- `CLI_WORKFLOW.md` - Detaylı workflow
- `APPLY_MIGRATION.md` - Migration uygulama
- `MASTER_GUIDE.md` - Tüm bilgiler

