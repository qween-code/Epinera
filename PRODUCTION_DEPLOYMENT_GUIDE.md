# Production Deployment Guide

Bu döküman, projeyi canlıya alırken yapılması gereken tüm değişiklikleri ve adımları içerir.

## 📋 İçindekiler

1. [Database Migration'ları](#database-migrations)
2. [Mock Data Kullanımları ve Çözümleri](#mock-data-usage)
3. [Environment Variables](#environment-variables)
4. [Payment Gateway Entegrasyonu](#payment-gateway)
5. [Third-Party Service Entegrasyonları](#third-party-services)
6. [Production Checklist](#production-checklist)

---

## 🗄️ Database Migrations

### Uygulanması Gereken Migration'lar

Tüm migration'ları sırayla uygulayın:

```bash
# Supabase CLI ile
npx supabase db push

# Veya manuel olarak Supabase Dashboard'dan
# supabase/migrations/ klasöründeki tüm .sql dosyalarını sırayla çalıştırın
```

### Yeni Migration Dosyası

`20251201000001_add_production_tables.sql` dosyası aşağıdaki tabloları oluşturur:

- ✅ `security_alerts` - Güvenlik uyarıları
- ✅ `risk_reviews` - Risk değerlendirmeleri
- ✅ `system_alerts` - Sistem uyarıları
- ✅ `support_conversations` - Destek konuşmaları
- ✅ `reviews` - Ürün yorumları
- ✅ `forum_posts` - Forum gönderileri
- ✅ `forum_categories` - Forum kategorileri
- ✅ `audit_logs` - Denetim kayıtları

**ÖNEMLİ:** Bu migration'ı uyguladıktan sonra, aşağıdaki sayfalardaki mock data kullanımlarını gerçek veritabanı sorgularıyla değiştirin.

---

## 🔄 Mock Data Kullanımları ve Çözümleri

### 1. Admin Security Page (`/admin/security`)

**Dosya:** `epin-marketplace/src/app/admin/security/page.tsx`

**Mevcut Durum:**
- `mockAlerts` - Mock security alerts data
- `mockRiskReviews` - Mock risk reviews data

**Production Çözümü:**
```typescript
// Mock data yerine:
const { data: alertsData } = await supabase
  .from('security_alerts')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50);

const { data: riskReviewsData } = await supabase
  .from('risk_reviews')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50);
```

**Değiştirilecek Satırlar:**
- Satır 57-87: `mockAlerts` → Supabase query
- Satır 89-118: `mockRiskReviews` → Supabase query

---

### 2. Admin System Monitoring Page (`/admin/system`)

**Dosya:** `epin-marketplace/src/app/admin/system/page.tsx`

**Mevcut Durum:**
- `mockAlerts` - Mock system alerts data

**Production Çözümü:**
```typescript
// Mock data yerine:
const { data: alertsData } = await supabase
  .from('system_alerts')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(100);
```

**Değiştirilecek Satırlar:**
- Satır 45-77: `mockAlerts` → Supabase query

---

### 3. Support Page (`/support`)

**Dosya:** `epin-marketplace/src/app/support/page.tsx`

**Mevcut Durum:**
- `mockConversations` - Mock support conversations
- `mockMessages` - Mock messages

**Production Çözümü:**
```typescript
// Mock conversations yerine:
const { data: conversationsData } = await supabase
  .from('support_conversations')
  .select('*')
  .eq('user_id', user.id)
  .order('last_message_time', { ascending: false });

// Mock messages yerine:
const { data: messagesData } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', selectedConversation)
  .order('created_at', { ascending: true });
```

**Değiştirilecek Satırlar:**
- Satır 39-75: `mockConversations` → Supabase query
- Satır 92-112: `mockMessages` → Supabase query

**NOT:** `messages` tablosuna `conversation_id` kolonu eklenmeli veya `support_conversations` ile ilişkilendirilmeli.

---

### 4. Product Detail Page (`/product/[slug]`)

**Dosya:** `epin-marketplace/src/app/product/[slug]/page.tsx`

**Mevcut Durum:**
- Mock reviews data (satır 120-155)
- Mock related products (satır 157+)

**Production Çözümü:**
```typescript
// Mock reviews yerine:
const { data: reviewsData } = await supabase
  .from('reviews')
  .select(`
    *,
    profiles!reviews_user_id_fkey(id, full_name, avatar_url)
  `)
  .eq('product_id', product.id)
  .order('created_at', { ascending: false })
  .limit(10);

// Average rating hesaplama:
const { data: ratingData } = await supabase
  .from('reviews')
  .select('rating')
  .eq('product_id', product.id);

const averageRating = ratingData?.reduce((sum, r) => sum + r.rating, 0) / (ratingData?.length || 1);

// Mock related products yerine:
const { data: relatedProducts } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', product.category_id)
  .neq('id', product.id)
  .limit(4);
```

**Değiştirilecek Satırlar:**
- Satır 120-155: Mock reviews → Supabase query
- Satır 157+: Mock related products → Supabase query

---

### 5. Admin Audit Logs Page (`/admin/audit-logs`)

**Dosya:** `epin-marketplace/src/app/admin/audit-logs/page.tsx`

**Mevcut Durum:**
- Mock audit logs data (dosya başında)

**Production Çözümü:**
```typescript
// Mock data yerine:
const { data: auditLogsData } = await supabase
  .from('audit_logs')
  .select(`
    *,
    profiles!audit_logs_actor_id_fkey(id, full_name)
  `)
  .order('created_at', { ascending: false })
  .limit(100);
```

**Değiştirilecek Satırlar:**
- Satır 1-24: Mock audit logs → Supabase query

---

### 6. Creator Dashboard Pages

#### Creator Dashboard (`/creator`)

**Dosya:** `epin-marketplace/src/app/creator/page.tsx`

**Mevcut Durum:**
- Mock stats data
- Mock earnings data

**Production Çözümü:**
```typescript
// Real-time earnings hesaplama:
const { data: earningsData } = await supabase
  .from('wallet_transactions')
  .select('amount, currency')
  .eq('user_id', user.id)
  .eq('transaction_type', 'payout')
  .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

const realTimeEarnings = earningsData?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
```

**Değiştirilecek Satırlar:**
- Satır 41-50: Mock campaign data → Supabase query (zaten var, fallback kaldırılabilir)
- Satır 61-65: Mock earnings → Supabase query

#### Creator Audience (`/creator/audience`)

**Dosya:** `epin-marketplace/src/app/creator/audience/page.tsx`

**Mevcut Durum:**
- Mock analytics data

**Production Çözümü:**
```typescript
// Real analytics data:
const { data: campaignData } = await supabase
  .from('campaigns')
  .select('*')
  .eq('creator_id', user.id)
  .gte('created_at', getTimeRangeStart(timeRange));

// Calculate stats from campaign data
```

**Değiştirilecek Satırlar:**
- Satır 35-40: Mock analytics → Supabase query

#### Creator Revenue (`/creator/revenue`)

**Dosya:** `epin-marketplace/src/app/creator/revenue/page.tsx`

**Mevcut Durum:**
- Mock earnings data

**Production Çözümü:**
```typescript
// Real earnings data:
const { data: earningsData } = await supabase
  .from('wallet_transactions')
  .select('*')
  .eq('user_id', user.id)
  .eq('transaction_type', 'payout')
  .order('created_at', { ascending: false });
```

**Değiştirilecek Satırlar:**
- Satır 39-40: Mock earnings → Supabase query

---

### 7. Seller Dashboard Pages

#### Seller Dashboard (`/seller/dashboard`)

**Dosya:** `epin-marketplace/src/app/seller/dashboard/page.tsx`

**Mevcut Durum:**
- Mock product views
- Mock top selling products

**Production Çözümü:**
```typescript
// Real analytics:
const { data: analyticsData } = await supabase
  .from('product_analytics') // Bu tablo oluşturulmalı veya events tablosundan hesaplanmalı
  .select('*')
  .eq('seller_id', user.id);
```

**Değiştirilecek Satırlar:**
- Satır 42: Mock product views → Real analytics
- Satır 51+: Mock top selling → Real query

#### Seller Analytics (`/seller/analytics`)

**Dosya:** `epin-marketplace/src/app/seller/analytics/page.tsx`

**Mevcut Durum:**
- Mock growth calculations
- Mock AI insights

**Production Çözümü:**
```typescript
// Real growth calculation:
const currentPeriod = await getSalesForPeriod(startDate, endDate);
const previousPeriod = await getSalesForPeriod(previousStartDate, previousEndDate);
const growth = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
```

**Değiştirilecek Satırlar:**
- Satır 74: Mock growth → Real calculation
- Satır 111: Mock AI insights → Real AI service veya kaldır

---

### 8. Cart Page (`/cart`)

**Dosya:** `epin-marketplace/src/app/cart/page.tsx`

**Mevcut Durum:**
- Mock tax calculation (8%)

**Production Çözümü:**
```typescript
// Real tax calculation based on user location:
const { data: userProfile } = await supabase
  .from('profiles')
  .select('country, tax_rate')
  .eq('id', user.id)
  .single();

const taxRate = userProfile?.tax_rate || 0.08; // Default 8%
const taxes = subtotal * taxRate;
```

**Değiştirilecek Satırlar:**
- Satır 135: Mock tax → Real calculation

---

### 9. Compare Page (`/compare`)

**Dosya:** `epin-marketplace/src/app/compare/page.tsx`

**Mevcut Durum:**
- Mock seller rating
- Mock platform, region, features

**Production Çözümü:**
```typescript
// Real seller rating:
const { data: sellerReviews } = await supabase
  .from('reviews')
  .select('rating')
  .eq('seller_id', sellerId);

const sellerRating = sellerReviews?.reduce((sum, r) => sum + r.rating, 0) / (sellerReviews?.length || 1);

// Real product attributes:
const { data: productAttributes } = await supabase
  .from('product_attributes')
  .select('*')
  .eq('product_id', productId);
```

**Değiştirilecek Satırlar:**
- Satır 80: Mock rating → Real query
- Satır 82-84: Mock attributes → Real query

---

### 10. Storefront Page (`/store/[slug]`)

**Dosya:** `epin-marketplace/src/app/store/[slug]/page.tsx`

**Mevcut Durum:**
- Mock platform data
- Mock follow functionality

**Production Çözümü:**
```typescript
// Real follow functionality:
const { data: followData } = await supabase
  .from('user_follows') // Bu tablo oluşturulmalı
  .select('*')
  .eq('follower_id', user.id)
  .eq('following_id', store.id)
  .single();

const isFollowing = !!followData;
```

**Değiştirilecek Satırlar:**
- Satır 76: Mock platform → Real product data
- Satır 149: Mock follow → Real follow table

---

## 🔐 Environment Variables

### Gerekli Environment Variables

`.env.local` dosyasında aşağıdaki değişkenler tanımlı olmalı:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payment Gateway (Stripe, PayTR, vb.)
PAYMENT_GATEWAY_API_KEY=your-payment-api-key
PAYMENT_GATEWAY_SECRET_KEY=your-payment-secret-key
PAYMENT_GATEWAY_WEBHOOK_SECRET=your-webhook-secret

# Email Service (SendGrid, AWS SES, vb.)
EMAIL_SERVICE_API_KEY=your-email-api-key
EMAIL_FROM_ADDRESS=noreply@epinmarketplace.com

# AI Services (eğer kullanılıyorsa)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Platform URLs
NEXT_PUBLIC_APP_URL=https://epinmarketplace.com
NEXT_PUBLIC_API_URL=https://api.epinmarketplace.com
```

### Production'da Kontrol Edilecekler

1. ✅ Tüm `NEXT_PUBLIC_*` değişkenleri production URL'lerine güncellenmeli
2. ✅ Service role key sadece server-side kullanılmalı
3. ✅ API keys asla client-side'a expose edilmemeli
4. ✅ Webhook secret'ları güvenli tutulmalı

---

## 💳 Payment Gateway Entegrasyonu

### Mevcut Durum

**Dosya:** `epin-marketplace/src/app/actions/deposit.ts`

**Satır 91:** `// TODO: Integrate with actual payment gateway`

### Production Çözümü

Stripe, PayTR veya tercih edilen payment gateway entegrasyonu:

```typescript
// Örnek Stripe entegrasyonu:
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100), // Convert to cents
  currency: currency.toLowerCase(),
  metadata: {
    user_id: user.id,
    transaction_id: transaction.id,
  },
});

// Webhook handler oluşturulmalı:
// app/api/webhooks/stripe/route.ts
```

**Değiştirilecek Dosyalar:**
- `epin-marketplace/src/app/actions/deposit.ts` - Satır 91+
- Yeni dosya: `epin-marketplace/src/app/api/webhooks/stripe/route.ts`

---

## 🔌 Third-Party Service Entegrasyonları

### 1. Email Service

Password reset, order confirmations, notifications için email service gerekli.

**Önerilen:** SendGrid, AWS SES, Resend

```typescript
// Örnek SendGrid entegrasyonu:
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: user.email,
  from: process.env.EMAIL_FROM_ADDRESS!,
  subject: 'Password Reset',
  html: resetEmailTemplate,
});
```

**Kullanılacak Yerler:**
- `epin-marketplace/src/app/forgot-password/page.tsx`
- `epin-marketplace/src/app/actions/checkout.ts` (order notifications)
- `epin-marketplace/src/app/actions/notifications.ts`

### 2. OAuth Providers

Google OAuth zaten Supabase Auth ile entegre. Production'da:

1. Google Cloud Console'da OAuth credentials oluştur
2. Supabase Dashboard'da OAuth provider'ları yapılandır
3. Redirect URL'leri production domain'e güncelle

### 3. Platform Integrations (Creator)

**Dosya:** `epin-marketplace/src/app/creator/campaigns/page.tsx`

**Satır 51:** `// TODO: Implement OAuth flow for platform integration`

Twitch, YouTube, Instagram OAuth entegrasyonları için:

```typescript
// Örnek Twitch OAuth:
const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=channel:read:redemptions`;
```

---

## ✅ Production Checklist

### Pre-Deployment

- [ ] Tüm migration'lar uygulandı
- [ ] Mock data kullanımları gerçek veritabanı sorgularıyla değiştirildi
- [ ] Environment variables production değerlerine güncellendi
- [ ] Payment gateway entegrasyonu tamamlandı
- [ ] Email service entegrasyonu tamamlandı
- [ ] OAuth provider'lar yapılandırıldı
- [ ] RLS policies test edildi
- [ ] Error handling ve logging eklendi

### Database

- [ ] `security_alerts` table oluşturuldu
- [ ] `risk_reviews` table oluşturuldu
- [ ] `system_alerts` table oluşturuldu
- [ ] `support_conversations` table oluşturuldu
- [ ] `reviews` table oluşturuldu
- [ ] `forum_posts` table oluşturuldu
- [ ] `forum_categories` table oluşturuldu
- [ ] `audit_logs` table oluşturuldu
- [ ] Tüm RLS policies test edildi
- [ ] Indexes performans testinden geçti

### Code Changes

- [ ] Admin Security: Mock data → Real queries
- [ ] Admin System: Mock data → Real queries
- [ ] Support: Mock data → Real queries
- [ ] Product Detail: Mock reviews → Real queries
- [ ] Admin Audit Logs: Mock data → Real queries
- [ ] Creator pages: Mock data → Real queries
- [ ] Seller pages: Mock data → Real queries
- [ ] Cart: Mock tax → Real calculation
- [ ] Compare: Mock attributes → Real queries
- [ ] Storefront: Mock follow → Real functionality

### Security

- [ ] Service role key sadece server-side kullanılıyor
- [ ] API keys client-side'a expose edilmiyor
- [ ] RLS policies tüm tablolarda aktif
- [ ] Admin routes role-based access control ile korunuyor
- [ ] Input validation tüm formlarda mevcut
- [ ] SQL injection koruması (Supabase zaten sağlıyor)
- [ ] XSS koruması (React zaten sağlıyor)

### Performance

- [ ] Database indexes optimize edildi
- [ ] Image optimization (Next.js Image component kullanılıyor)
- [ ] API response caching (gerekli yerlerde)
- [ ] Lazy loading (gerekli component'lerde)

### Monitoring

- [ ] Error tracking (Sentry, LogRocket, vb.)
- [ ] Analytics (Google Analytics, Plausible, vb.)
- [ ] Uptime monitoring
- [ ] Database performance monitoring

---

## 🚀 Deployment Steps

1. **Database Migration:**
   ```bash
   npx supabase db push
   ```

2. **Environment Variables:**
   - Production `.env` dosyasını oluştur
   - Tüm değişkenleri production değerlerine güncelle

3. **Code Updates:**
   - Mock data kullanımlarını gerçek sorgularla değiştir
   - Payment gateway entegrasyonunu tamamla
   - Email service entegrasyonunu tamamla

4. **Testing:**
   - Staging environment'da test et
   - Tüm kritik flow'ları test et
   - Performance test yap

5. **Deployment:**
   ```bash
   npm run build
   npm run start
   ```

6. **Post-Deployment:**
   - Health check yap
   - Error logs kontrol et
   - Database performance kontrol et

---

## 📝 Notlar

- **Mock Data:** Tüm mock data kullanımları production'da gerçek veritabanı sorgularıyla değiştirilmeli
- **Credentials:** Hiçbir yerde hardcoded credentials olmamalı
- **Error Handling:** Tüm API çağrılarında proper error handling olmalı
- **Logging:** Production'da detaylı logging aktif olmalı
- **Backup:** Database backup stratejisi oluşturulmalı

---

*Son Güncelleme: Sprint 41 Sonrası*

## 📝 Sprint 41 Sonrası Güncellemeler

### Tamamlanan İşler
- ✅ Tüm Cart Review versiyonları (1-5) implement edildi
- ✅ Tüm Payment Selection versiyonları (1-5) implement edildi
- ✅ Tüm sayfalar production-ready durumda
- ✅ Mock data kullanımları belirlendi ve çözümleri dökümanlandı

### Önemli Notlar
- Cart ve Checkout sayfaları artık 5 versiyonu destekliyor (`?version=1-5`)
- Tüm versiyonlar wallet balance kontrolü yapıyor
- Production'da mock data kullanımları gerçek veritabanı sorgularıyla değiştirilmeli

