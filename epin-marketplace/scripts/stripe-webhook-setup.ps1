# Stripe Webhook Setup Script
# Webhook forwarding'i başlatır ve secret'ı gösterir

Write-Host "🔗 Stripe Webhook Setup" -ForegroundColor Green
Write-Host ""

# Webhook forwarding başlat
Write-Host "📡 Webhook forwarding başlatılıyor..." -ForegroundColor Cyan
Write-Host "   (Bu komut sürekli çalışacak, durdurmak için Ctrl+C)" -ForegroundColor Yellow
Write-Host ""

# Webhook secret'ı almak için listen komutunu çalıştır
Write-Host "🔐 Webhook secret alınıyor..." -ForegroundColor Cyan
Write-Host "   Komut: stripe listen --forward-to localhost:3000/api/webhooks/stripe" -ForegroundColor White
Write-Host ""

# Kullanıcıya bilgi ver
Write-Host "📝 Yapılacaklar:" -ForegroundColor Yellow
Write-Host "   1. Ayrı bir terminal açın" -ForegroundColor White
Write-Host "   2. Şu komutu çalıştırın:" -ForegroundColor White
Write-Host "      stripe listen --forward-to localhost:3000/api/webhooks/stripe" -ForegroundColor Cyan
Write-Host "   3. Çıktıdaki 'whsec_...' secret'ı kopyalayın" -ForegroundColor White
Write-Host "   4. .env.local dosyasına ekleyin:" -ForegroundColor White
Write-Host "      STRIPE_WEBHOOK_SECRET=whsec_..." -ForegroundColor Cyan
Write-Host ""

# Otomatik olarak listen başlat (opsiyonel)
$startListen = Read-Host "Webhook forwarding'i şimdi başlatmak ister misiniz? (y/n)"
if ($startListen -eq "y" -or $startListen -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Webhook forwarding başlatılıyor..." -ForegroundColor Green
    Write-Host "   (Durdurmak için Ctrl+C)" -ForegroundColor Yellow
    Write-Host ""
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
} else {
    Write-Host ""
    Write-Host "ℹ️  Webhook forwarding'i manuel olarak başlatabilirsiniz." -ForegroundColor Yellow
}

