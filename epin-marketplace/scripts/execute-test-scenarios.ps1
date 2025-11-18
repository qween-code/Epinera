# Kapsamlı Test Senaryoları Çalıştırma Script
# Stripe CLI ile gerçek işlemler yapar

param(
    [string]$StripeExePath = ""
)

Write-Host "🧪 Kapsamlı Test Senaryoları Başlatılıyor..." -ForegroundColor Green
Write-Host ""

# Stripe CLI path bul
if ([string]::IsNullOrEmpty($StripeExePath)) {
    $stripeExe = Get-ChildItem -Path "$env:TEMP\stripe-cli" -Recurse -Filter "stripe.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($stripeExe) {
        $StripeExePath = $stripeExe.FullName
    }
}

if ([string]::IsNullOrEmpty($StripeExePath)) {
    Write-Host "❌ Stripe CLI bulunamadı!" -ForegroundColor Red
    Write-Host "   📝 Stripe CLI kurulumu için MASTER_GUIDE.md'ye bakın" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Stripe CLI: $StripeExePath" -ForegroundColor Green
Write-Host ""

# ============================================
# SENARYO 1: Stripe ile Bakiye Yükleme
# ============================================
Write-Host "💳 Senaryo 1: Stripe ile Bakiye Yükleme" -ForegroundColor Cyan
Write-Host ""

Write-Host "1.1. Payment Intent oluşturuluyor - 50 USD..." -ForegroundColor Yellow
$paymentIntent = & $StripeExePath payment_intents create --amount=5000 --currency=usd --description="Test deposit 50 USD - Comprehensive Test" 2>&1

if ($LASTEXITCODE -eq 0) {
    try {
        $piJson = $paymentIntent | ConvertFrom-Json
        $piId = $piJson.id
        $clientSecret = $piJson.client_secret
        
        Write-Host "   ✅ Payment Intent oluşturuldu!" -ForegroundColor Green
        Write-Host "   📋 Payment Intent ID: $piId" -ForegroundColor White
        $secretPreview = if ($clientSecret.Length -gt 30) { $clientSecret.Substring(0, 30) + "..." } else { $clientSecret }
        Write-Host "   🔐 Client Secret: $secretPreview" -ForegroundColor White
        Write-Host ""
        Write-Host "   📝 Sonraki adımlar:" -ForegroundColor Yellow
        Write-Host "   1. Tarayıcıda /wallet/deposit sayfasına git" -ForegroundColor White
        Write-Host "   2. 50 USD seç ve ödeme yap" -ForegroundColor White
        Write-Host "   3. Test kartı: 4242 4242 4242 4242" -ForegroundColor White
        Write-Host "   4. Webhook otomatik olarak bakiye ekleyecek" -ForegroundColor White
    } catch {
        Write-Host "   ⚠️  JSON parse hatası, ama Payment Intent oluşturulmuş olabilir" -ForegroundColor Yellow
        Write-Host $paymentIntent -ForegroundColor White
    }
} else {
    Write-Host "   ❌ Payment Intent oluşturulamadı!" -ForegroundColor Red
    Write-Host $paymentIntent -ForegroundColor Red
}
Write-Host ""

# ============================================
# SENARYO 2: Test Customer Oluşturma
# ============================================
Write-Host "👤 Senaryo 2: Test Customer Oluşturma" -ForegroundColor Cyan
Write-Host ""

Write-Host "2.1. Test Buyer Customer oluşturuluyor..." -ForegroundColor Yellow
$customer = & $StripeExePath customers create --email="test-buyer-comprehensive@epinmarketplace.com" --name="Test Buyer Comprehensive" 2>&1

if ($LASTEXITCODE -eq 0) {
    try {
        $customerJson = $customer | ConvertFrom-Json
        Write-Host "   ✅ Customer oluşturuldu!" -ForegroundColor Green
        Write-Host "   📋 Customer ID: $($customerJson.id)" -ForegroundColor White
    } catch {
        Write-Host "   ⚠️  JSON parse hatası, ama Customer oluşturulmuş olabilir" -ForegroundColor Yellow
        Write-Host $customer -ForegroundColor White
    }
} else {
    Write-Host "   ❌ Customer oluşturulamadı!" -ForegroundColor Red
}
Write-Host ""

# ============================================
# SENARYO 3: Multiple Payment Intents
# ============================================
Write-Host "💳 Senaryo 3: Çoklu Payment Intent Senaryoları" -ForegroundColor Cyan
Write-Host ""

$amounts = @(2000, 5000, 10000, 25000)
$scenarios = @("small_deposit", "medium_deposit", "large_deposit", "vip_deposit")

for ($i = 0; $i -lt $amounts.Length; $i++) {
    $amount = $amounts[$i]
    $scenario = $scenarios[$i]
    $amountDollar = $amount / 100
    
    Write-Host "3.$($i+1). $scenario - $amountDollar USD Payment Intent..." -ForegroundColor Yellow
    $desc = "Test $scenario - $amountDollar USD"
    $pi = & $StripeExePath payment_intents create --amount=$amount --currency=usd --description=$desc 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        try {
            $piJson = $pi | ConvertFrom-Json
            Write-Host "   ✅ Payment Intent oluşturuldu: $($piJson.id)" -ForegroundColor Green
        } catch {
            Write-Host "   ✅ Payment Intent oluşturuldu (ID parse edilemedi)" -ForegroundColor Green
        }
    } else {
        Write-Host "   ❌ Payment Intent oluşturulamadı" -ForegroundColor Red
    }
}
Write-Host ""

# ============================================
# SENARYO 4: Webhook Test
# ============================================
Write-Host "🔔 Senaryo 4: Webhook Test Senaryoları" -ForegroundColor Cyan
Write-Host ""

Write-Host "4.1. payment_intent.succeeded webhook testi..." -ForegroundColor Yellow
$webhook1 = & $StripeExePath trigger payment_intent.succeeded 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Webhook tetiklendi!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Webhook tetiklenemedi (stripe listen çalışıyor mu?)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "4.2. payment_intent.payment_failed webhook testi..." -ForegroundColor Yellow
$webhook2 = & $StripeExePath trigger payment_intent.payment_failed 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Webhook tetiklendi!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Webhook tetiklenemedi" -ForegroundColor Yellow
}
Write-Host ""

# ============================================
# SENARYO 5: Balance ve Transaction Kontrolü
# ============================================
Write-Host "💰 Senaryo 5: Balance ve Transaction Kontrolü" -ForegroundColor Cyan
Write-Host ""

Write-Host "5.1. Stripe Balance kontrolü..." -ForegroundColor Yellow
$balance = & $StripeExePath balance retrieve 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Balance bilgisi alındı" -ForegroundColor Green
    Write-Host $balance -ForegroundColor White
} else {
    Write-Host "   ⚠️  Balance bilgisi alınamadı" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "5.2. Son Payment Intents..." -ForegroundColor Yellow
$paymentIntents = & $StripeExePath payment_intents list --limit 5 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Payment Intents listelendi" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Payment Intents listelenemedi" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "5.3. Son Events..." -ForegroundColor Yellow
$events = & $StripeExePath events list --limit 5 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Events listelendi" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Events listelenemedi" -ForegroundColor Yellow
}
Write-Host ""

# ============================================
# ÖZET
# ============================================
Write-Host "✅ Test Senaryoları Tamamlandı!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Sonraki Adımlar:" -ForegroundColor Yellow
Write-Host "   1. Tarayıcıda http://localhost:3000 açın" -ForegroundColor White
Write-Host "   2. Test kullanıcıları ile giriş yapın" -ForegroundColor White
Write-Host "   3. COMPREHENSIVE_TEST_SCENARIOS.md'deki senaryoları takip edin" -ForegroundColor White
Write-Host "   4. İndirim kodlarını test edin (WELCOME20, FLASH30, BONUS10)" -ForegroundColor White
Write-Host "   5. Kampanyaları test edin" -ForegroundColor White
Write-Host "   6. Çekilişlere katılın" -ForegroundColor White
Write-Host ""
