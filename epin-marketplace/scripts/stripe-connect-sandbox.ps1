# Stripe Sandbox Bağlantı ve Test Script
# API Key'lerle sandbox hesabına bağlanır ve test işlemleri yapar
# 
# Kullanım:
#   .\stripe-connect-sandbox.ps1 -SecretKey "sk_test_..." -PublishableKey "pk_test_..."
#   veya .env.local dosyasından otomatik okur

param(
    [string]$SecretKey = "",
    [string]$PublishableKey = ""
)

# .env.local dosyasından key'leri oku (eğer parametre verilmemişse)
if ([string]::IsNullOrEmpty($SecretKey)) {
    if (Test-Path ".env.local") {
        $envContent = Get-Content ".env.local" -Raw
        if ($envContent -match "STRIPE_SECRET_KEY=(.+)") {
            $SecretKey = $matches[1].Trim()
        }
    }
}

if ([string]::IsNullOrEmpty($PublishableKey)) {
    if (Test-Path ".env.local") {
        $envContent = Get-Content ".env.local" -Raw
        if ($envContent -match "STRIPE_PUBLISHABLE_KEY=(.+)") {
            $PublishableKey = $matches[1].Trim()
        }
    }
}

# Key kontrolü
if ([string]::IsNullOrEmpty($SecretKey)) {
    Write-Host "❌ STRIPE_SECRET_KEY bulunamadı!" -ForegroundColor Red
    Write-Host "   .env.local dosyasına ekleyin veya parametre olarak geçin" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔗 Stripe Sandbox Bağlantı ve Test" -ForegroundColor Green
Write-Host ""

# API Key'leri config'e set et
Write-Host "1️⃣ API Key'ler yapılandırılıyor..." -ForegroundColor Cyan
stripe config --set test_mode_api_key $SecretKey 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Secret Key yapılandırıldı!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Secret Key yapılandırılamadı!" -ForegroundColor Red
    exit 1
}

stripe config --set test_mode true 2>&1 | Out-Null
Write-Host "   ✅ Test mode aktif!" -ForegroundColor Green
Write-Host ""

# Balance kontrolü
Write-Host "2️⃣ Stripe Balance kontrol ediliyor..." -ForegroundColor Cyan
$balance = stripe balance retrieve 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Balance bilgisi alındı!" -ForegroundColor Green
    Write-Host $balance -ForegroundColor White
} else {
    Write-Host "   ⚠️  Balance bilgisi alınamadı" -ForegroundColor Yellow
    Write-Host $balance -ForegroundColor Red
}
Write-Host ""

# Son Payment Intents
Write-Host "3️⃣ Son Payment Intents:" -ForegroundColor Cyan
try {
    $paymentIntents = stripe payment_intents list --limit 5 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host $paymentIntents -ForegroundColor White
    } else {
        Write-Host "   ⚠️  Payment Intents listelenemedi" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Hata: $_" -ForegroundColor Red
}
Write-Host ""

# Son Transfers
Write-Host "4️⃣ Son Transfers:" -ForegroundColor Cyan
try {
    $transfers = stripe transfers list --limit 5 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host $transfers -ForegroundColor White
    } else {
        Write-Host "   ⚠️  Transfers listelenemedi" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Hata: $_" -ForegroundColor Red
}
Write-Host ""

# Son Events
Write-Host "5️⃣ Son Events:" -ForegroundColor Cyan
try {
    $events = stripe events list --limit 5 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host $events -ForegroundColor White
    } else {
        Write-Host "   ⚠️  Events listelenemedi" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Hata: $_" -ForegroundColor Red
}
Write-Host ""

# Test Payment Intent oluştur
Write-Host "6️⃣ Test Payment Intent oluşturuluyor..." -ForegroundColor Cyan
try {
    $testPaymentIntent = stripe payment_intents create `
        --amount=2000 `
        --currency=usd `
        --metadata[test]=true `
        --metadata[description]="Test deposit from CLI" `
        --metadata[user_id]=test-user-cli-123 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Test Payment Intent oluşturuldu!" -ForegroundColor Green
        Write-Host $testPaymentIntent -ForegroundColor White
        
        # Payment Intent ID'yi çıkar
        if ($testPaymentIntent -match '"id":\s*"(pi_[^"]+)"') {
            $paymentIntentId = $matches[1]
            Write-Host "   📋 Payment Intent ID: $paymentIntentId" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   ❌ Payment Intent oluşturulamadı" -ForegroundColor Red
        Write-Host $testPaymentIntent -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Hata: $_" -ForegroundColor Red
}
Write-Host ""

# Test Customer oluştur
Write-Host "7️⃣ Test Customer oluşturuluyor..." -ForegroundColor Cyan
try {
    $testCustomer = stripe customers create `
        --email="test-cli@epinmarketplace.com" `
        --name="Test Customer CLI" `
        --metadata[test]=true `
        --metadata[source]=cli 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Test Customer oluşturuldu!" -ForegroundColor Green
        Write-Host $testCustomer -ForegroundColor White
    } else {
        Write-Host "   ❌ Customer oluşturulamadı" -ForegroundColor Red
        Write-Host $testCustomer -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Hata: $_" -ForegroundColor Red
}
Write-Host ""

# Webhook bilgisi
Write-Host "8️⃣ Webhook Forwarding:" -ForegroundColor Cyan
Write-Host "   📝 Webhook forwarding için:" -ForegroundColor Yellow
Write-Host "   stripe listen --forward-to localhost:3000/api/webhooks/stripe" -ForegroundColor White
Write-Host "   (Çıktıdaki whsec_... değerini .env.local'e ekleyin)" -ForegroundColor Yellow
Write-Host ""

# Environment variables bilgisi
Write-Host "9️⃣ Environment Variables:" -ForegroundColor Cyan
Write-Host "   ✅ Secret Key: $($SecretKey.Substring(0, 20))..." -ForegroundColor Green
Write-Host "   ✅ Publishable Key: $($PublishableKey.Substring(0, 20))..." -ForegroundColor Green
Write-Host "   📝 .env.local dosyasına ekleyin:" -ForegroundColor Yellow
Write-Host "   STRIPE_SECRET_KEY=$SecretKey" -ForegroundColor White
Write-Host "   STRIPE_PUBLISHABLE_KEY=$PublishableKey" -ForegroundColor White
Write-Host ""

Write-Host "✅ Stripe Sandbox bağlantı ve test tamamlandı!" -ForegroundColor Green
Write-Host ""

