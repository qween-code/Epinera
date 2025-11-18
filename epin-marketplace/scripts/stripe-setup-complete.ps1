# Stripe CLI Tam Kurulum ve Yapılandırma Script
# PowerShell ile çalıştır: .\scripts\stripe-setup-complete.ps1

Write-Host "🚀 Stripe CLI Tam Kurulum ve Yapılandırma" -ForegroundColor Green
Write-Host ""

# 1. Stripe CLI kurulumu kontrolü
Write-Host "1️⃣ Stripe CLI kurulumu kontrol ediliyor..." -ForegroundColor Cyan
if (-not (Get-Command stripe -ErrorAction SilentlyContinue)) {
    Write-Host "   ⚠️  Stripe CLI bulunamadı. Kurulum yapılıyor..." -ForegroundColor Yellow
    
    # Scoop kontrolü
    if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
        Write-Host "   📦 Scoop kuruluyor..." -ForegroundColor Yellow
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
    }
    
    scoop install stripe
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Stripe CLI kurulumu başarısız!" -ForegroundColor Red
        Write-Host "   Manuel kurulum: https://github.com/stripe/stripe-cli/releases" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "   ✅ Stripe CLI kuruldu!" -ForegroundColor Green
} else {
    Write-Host "   ✅ Stripe CLI zaten kurulu!" -ForegroundColor Green
    stripe --version
}
Write-Host ""

# 2. Login kontrolü
Write-Host "2️⃣ Stripe login durumu kontrol ediliyor..." -ForegroundColor Cyan
$config = stripe config --list 2>&1
if ($LASTEXITCODE -ne 0 -or $config -match "not logged in") {
    Write-Host "   ⚠️  Stripe'a login yapılmamış." -ForegroundColor Yellow
    Write-Host "   🔐 Login yapılıyor..." -ForegroundColor Yellow
    Write-Host "   (Tarayıcı açılacak, Stripe hesabınıza giriş yapın)" -ForegroundColor White
    stripe login
} else {
    Write-Host "   ✅ Zaten login yapılmış!" -ForegroundColor Green
}
Write-Host ""

# 3. Test mode kontrolü
Write-Host "3️⃣ Test mode kontrol ediliyor..." -ForegroundColor Cyan
stripe config --set test_mode true
Write-Host "   ✅ Test mode aktif!" -ForegroundColor Green
Write-Host ""

# 4. API Key'leri göster
Write-Host "4️⃣ API Key'ler kontrol ediliyor..." -ForegroundColor Cyan
$testKey = stripe config --get test_mode_api_key 2>&1
if ($testKey -match "sk_test_") {
    Write-Host "   ✅ Test API Key bulundu: $($testKey.Substring(0, 20))..." -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Test API Key bulunamadı!" -ForegroundColor Yellow
}
Write-Host ""

# 5. Balance kontrolü
Write-Host "5️⃣ Stripe Balance kontrol ediliyor..." -ForegroundColor Cyan
$balance = stripe balance retrieve 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Balance bilgisi alındı!" -ForegroundColor Green
    Write-Host $balance -ForegroundColor White
} else {
    Write-Host "   ⚠️  Balance bilgisi alınamadı: $balance" -ForegroundColor Yellow
}
Write-Host ""

# 6. Son işlemler
Write-Host "6️⃣ Son işlemler kontrol ediliyor..." -ForegroundColor Cyan
Write-Host "   📋 Payment Intents:" -ForegroundColor White
stripe payment_intents list --limit 3 2>&1 | Select-Object -First 5
Write-Host ""

Write-Host "   📋 Transfers:" -ForegroundColor White
stripe transfers list --limit 3 2>&1 | Select-Object -First 5
Write-Host ""

Write-Host "   📋 Events:" -ForegroundColor White
stripe events list --limit 3 2>&1 | Select-Object -First 5
Write-Host ""

# 7. Webhook forwarding bilgisi
Write-Host "7️⃣ Webhook Forwarding:" -ForegroundColor Cyan
Write-Host "   📝 Webhook forwarding için ayrı bir terminal açın ve şu komutu çalıştırın:" -ForegroundColor Yellow
Write-Host "   stripe listen --forward-to localhost:3000/api/webhooks/stripe" -ForegroundColor White
Write-Host "   (Çıktıdaki webhook secret'ı .env.local dosyasına ekleyin)" -ForegroundColor Yellow
Write-Host ""

# 8. Test webhook'ları
Write-Host "8️⃣ Test Webhook Komutları:" -ForegroundColor Cyan
Write-Host "   stripe trigger payment_intent.succeeded" -ForegroundColor White
Write-Host "   stripe trigger payment_intent.payment_failed" -ForegroundColor White
Write-Host "   stripe trigger transfer.paid" -ForegroundColor White
Write-Host ""

Write-Host "✅ Stripe CLI kurulum ve yapılandırma tamamlandı!" -ForegroundColor Green
Write-Host ""

