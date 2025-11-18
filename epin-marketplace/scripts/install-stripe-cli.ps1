# Stripe CLI Kurulum Script (Windows)
# PowerShell ile çalıştır: .\scripts\install-stripe-cli.ps1

Write-Host "🚀 Stripe CLI Kurulum Başlatılıyor..." -ForegroundColor Green

# Scoop kontrolü
if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Scoop bulunamadı. Scoop kurulumu yapılıyor..." -ForegroundColor Yellow
    
    # Scoop kurulumu
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
    
    Write-Host "✅ Scoop kuruldu!" -ForegroundColor Green
}

# Stripe CLI kurulumu
Write-Host "📦 Stripe CLI kuruluyor..." -ForegroundColor Cyan
scoop install stripe

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Stripe CLI başarıyla kuruldu!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔐 Şimdi login yapın:" -ForegroundColor Yellow
    Write-Host "   stripe login" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Test modunu kontrol edin:" -ForegroundColor Yellow
    Write-Host "   stripe config --set test_mode true" -ForegroundColor White
} else {
    Write-Host "❌ Stripe CLI kurulumu başarısız!" -ForegroundColor Red
    Write-Host "Manuel kurulum için: https://stripe.com/docs/stripe-cli" -ForegroundColor Yellow
}

