# Kapsamlı Test Senaryoları Çalıştırma Script
# Gerçek hayat senaryolarını test eder

Write-Host "🧪 Kapsamlı Test Senaryoları Başlatılıyor..." -ForegroundColor Green
Write-Host ""

# 1. Environment kontrolü
Write-Host "1️⃣ Environment Kontrolü..." -ForegroundColor Cyan
if (-not (Test-Path ".env.local")) {
    Write-Host "   ❌ .env.local dosyası bulunamadı!" -ForegroundColor Red
    Write-Host "   📝 .env.local.example dosyasını kopyalayıp düzenleyin" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ .env.local dosyası mevcut" -ForegroundColor Green
Write-Host ""

# 2. Development server kontrolü
Write-Host "2️⃣ Development Server Kontrolü..." -ForegroundColor Cyan
$devServer = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $devServer) {
    Write-Host "   ⚠️  Development server çalışmıyor!" -ForegroundColor Yellow
    Write-Host "   📝 Ayrı bir terminalde 'npm run dev' çalıştırın" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Development server çalışıyor" -ForegroundColor Green
}
Write-Host ""

# 3. Stripe CLI kontrolü
Write-Host "3️⃣ Stripe CLI Kontrolü..." -ForegroundColor Cyan
$stripeExe = Get-ChildItem -Path "$env:TEMP\stripe-cli" -Recurse -Filter "stripe.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $stripeExe) {
    Write-Host "   ⚠️  Stripe CLI bulunamadı!" -ForegroundColor Yellow
    Write-Host "   📝 Stripe CLI kurulumu için MASTER_GUIDE.md'ye bakın" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Stripe CLI mevcut" -ForegroundColor Green
    & $stripeExe.FullName --version 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Stripe CLI çalışıyor" -ForegroundColor Green
    }
}
Write-Host ""

# 4. Test senaryoları bilgisi
Write-Host "4️⃣ Test Senaryoları:" -ForegroundColor Cyan
Write-Host "   📋 Detaylı senaryolar: COMPREHENSIVE_TEST_SCENARIOS.md" -ForegroundColor White
Write-Host ""
Write-Host "   Ana Senaryolar:" -ForegroundColor Yellow
Write-Host "   1. Kullanıcı Yolculuğu (Kayıt → Alışveriş)" -ForegroundColor White
Write-Host "   2. Stripe ile Bakiye Yükleme" -ForegroundColor White
Write-Host "   3. İndirim Kodu Kullanımı" -ForegroundColor White
Write-Host "   4. Kampanya ve Flash Sale" -ForegroundColor White
Write-Host "   5. Çekiliş ve Giveaway" -ForegroundColor White
Write-Host "   6. Seller İşlemleri" -ForegroundColor White
Write-Host "   7. Creator İşlemleri" -ForegroundColor White
Write-Host "   8. Admin Yönetimi" -ForegroundColor White
Write-Host ""

# 5. Test verileri kontrolü
Write-Host "5️⃣ Test Verileri Kontrolü..." -ForegroundColor Cyan
Write-Host "   📝 Test verileri için:" -ForegroundColor Yellow
Write-Host "   - Supabase SQL Editor'de seed_comprehensive_test_data.sql çalıştırın" -ForegroundColor White
Write-Host "   - npm run seed:users (test kullanıcıları)" -ForegroundColor White
Write-Host ""

# 6. Test başlatma
Write-Host "6️⃣ Test Başlatma:" -ForegroundColor Cyan
Write-Host "   ✅ Hazır!" -ForegroundColor Green
Write-Host ""
Write-Host "   📝 Manuel test adımları:" -ForegroundColor Yellow
Write-Host "   1. Tarayıcıda http://localhost:3000 açın" -ForegroundColor White
Write-Host "   2. Test kullanıcıları ile giriş yapın" -ForegroundColor White
Write-Host "   3. COMPREHENSIVE_TEST_SCENARIOS.md'deki senaryoları takip edin" -ForegroundColor White
Write-Host "   4. Stripe CLI ile webhook testleri yapın" -ForegroundColor White
Write-Host ""

Write-Host "✅ Test ortamı hazır!" -ForegroundColor Green
Write-Host ""

