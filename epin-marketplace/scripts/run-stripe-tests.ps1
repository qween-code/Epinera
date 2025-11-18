# Stripe CLI Test Senaryoları
# Bu script Stripe CLI ile test işlemleri yapar

param(
    [string]$StripeExePath = ""
)

Write-Host "🧪 Stripe Test Senaryoları Başlatılıyor..." -ForegroundColor Green
Write-Host ""

# Stripe CLI path bul
if ([string]::IsNullOrEmpty($StripeExePath)) {
    # PATH'te ara
    $stripeInPath = Get-Command stripe -ErrorAction SilentlyContinue
    if ($stripeInPath) {
        $StripeExePath = $stripeInPath.Source
    } else {
        # Temp dizininde ara
        $stripeExe = Get-ChildItem -Path "$env:TEMP\stripe-cli" -Recurse -Filter "stripe.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($stripeExe) {
            $StripeExePath = $stripeExe.FullName
        }
    }
}

if ([string]::IsNullOrEmpty($StripeExePath)) {
    Write-Host "❌ Stripe CLI bulunamadı!" -ForegroundColor Red
    Write-Host "   📝 Önce Stripe CLI kurun:" -ForegroundColor Yellow
    Write-Host "   powershell -ExecutionPolicy Bypass -File scripts/setup-stripe-cli.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "   Veya manuel olarak:" -ForegroundColor Yellow
    Write-Host "   https://github.com/stripe/stripe-cli/releases" -ForegroundColor White
    exit 1
}

Write-Host "✅ Stripe CLI bulundu: $StripeExePath" -ForegroundColor Green
Write-Host ""

# Stripe login kontrolü
Write-Host "🔐 Stripe login durumu kontrol ediliyor..." -ForegroundColor Yellow
$loginCheck = & $StripeExePath config --list 2>&1
if ($LASTEXITCODE -ne 0 -or $loginCheck -like "*No API key*") {
    Write-Host "   ⚠️  Stripe CLI'ye login olmanız gerekiyor" -ForegroundColor Yellow
    Write-Host "   Komut: $StripeExePath login" -ForegroundColor White
    Write-Host ""
    $shouldLogin = Read-Host "Şimdi login olmak ister misiniz? (Y/N)"
    if ($shouldLogin -eq "Y" -or $shouldLogin -eq "y") {
        Write-Host "   Tarayıcı açılacak, login olun..." -ForegroundColor Yellow
        & $StripeExePath login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "   ❌ Login başarısız" -ForegroundColor Red
            exit 1
        }
        Write-Host "   ✅ Login başarılı" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  Login olmadan devam edilemez" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   ✅ Stripe CLI login durumu: OK" -ForegroundColor Green
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "TEST SENARYOLARI" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Senaryo 1: Payment Intent Oluşturma
Write-Host "💳 Senaryo 1: Payment Intent Oluşturma (50 USD)" -ForegroundColor Cyan
Write-Host ""

try {
    $paymentIntent = & $StripeExePath payment_intents create --amount=5000 --currency=usd --description="Test deposit 50 USD" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $piJson = $paymentIntent | ConvertFrom-Json
        Write-Host "   ✅ Payment Intent oluşturuldu!" -ForegroundColor Green
        Write-Host "   📋 ID: $($piJson.id)" -ForegroundColor White
        Write-Host "   💰 Amount: $($piJson.amount / 100) $($piJson.currency)" -ForegroundColor White
        Write-Host "   📊 Status: $($piJson.status)" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "   ❌ Payment Intent oluşturulamadı" -ForegroundColor Red
        Write-Host "   Hata: $paymentIntent" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Hata: $_" -ForegroundColor Red
}

Write-Host ""

# Senaryo 2: Customer Oluşturma
Write-Host "👤 Senaryo 2: Test Customer Oluşturma" -ForegroundColor Cyan
Write-Host ""

try {
    $customer = & $StripeExePath customers create --email="test-customer-$(Get-Date -Format 'yyyyMMddHHmmss')@epinmarketplace.com" --name="Test Customer" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $customerJson = $customer | ConvertFrom-Json
        Write-Host "   ✅ Customer oluşturuldu!" -ForegroundColor Green
        Write-Host "   📋 ID: $($customerJson.id)" -ForegroundColor White
        Write-Host "   📧 Email: $($customerJson.email)" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "   ❌ Customer oluşturulamadı" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Hata: $_" -ForegroundColor Red
}

Write-Host ""

# Senaryo 3: Webhook Event Trigger
Write-Host "🔔 Senaryo 3: Webhook Event Trigger (payment_intent.succeeded)" -ForegroundColor Cyan
Write-Host ""

try {
    $webhook = & $StripeExePath trigger payment_intent.succeeded 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Webhook event tetiklendi!" -ForegroundColor Green
        Write-Host "   📝 Webhook'u dinlemek için ayrı terminal'de çalıştırın:" -ForegroundColor Yellow
        Write-Host "   $StripeExePath listen --forward-to localhost:3000/api/webhooks/stripe" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "   ⚠️  Webhook trigger hatası (normal, webhook listener yoksa)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Webhook trigger hatası: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "TEST TAMAMLANDI" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Sonraki Adımlar:" -ForegroundColor Yellow
Write-Host "   1. Development server'ı başlatın: npm run dev" -ForegroundColor White
Write-Host "   2. Webhook listener'ı başlatın (yeni terminal):" -ForegroundColor White
Write-Host "      $StripeExePath listen --forward-to localhost:3000/api/webhooks/stripe" -ForegroundColor Cyan
Write-Host "   3. Tarayıcıda /wallet/deposit sayfasına gidin ve test edin" -ForegroundColor White
Write-Host ""

