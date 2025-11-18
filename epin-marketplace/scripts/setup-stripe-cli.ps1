# Stripe CLI Setup Script for Windows
# This script helps set up Stripe CLI on Windows

Write-Host "🔧 Stripe CLI Kurulum Scripti" -ForegroundColor Cyan
Write-Host ""

# Check if Stripe CLI is already installed
$stripePath = Get-Command stripe -ErrorAction SilentlyContinue
if ($stripePath) {
    Write-Host "✅ Stripe CLI zaten kurulu: $($stripePath.Source)" -ForegroundColor Green
    Write-Host "   Versiyon: " -NoNewline
    & stripe --version
    exit 0
}

Write-Host "📥 Stripe CLI bulunamadı. Kurulum başlatılıyor..." -ForegroundColor Yellow
Write-Host ""

# Download URL for Windows
$stripeVersion = "latest"
$downloadUrl = "https://github.com/stripe/stripe-cli/releases/latest/download/stripe_${stripeVersion}_windows_x86_64.zip"
$tempDir = "$env:TEMP\stripe-cli-install"
$zipFile = "$tempDir\stripe-cli.zip"
$extractDir = "$tempDir\extracted"

# Create temp directory
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
New-Item -ItemType Directory -Force -Path $extractDir | Out-Null

Write-Host "1. Stripe CLI indiriliyor..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
    Write-Host "   ✅ İndirme tamamlandı" -ForegroundColor Green
} catch {
    Write-Host "   ❌ İndirme hatası: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "   📝 Manuel kurulum için:" -ForegroundColor Yellow
    Write-Host "   1. https://github.com/stripe/stripe-cli/releases adresine git" -ForegroundColor White
    Write-Host "   2. En son Windows sürümünü indir" -ForegroundColor White
    Write-Host "   3. ZIP'i aç ve stripe.exe'yi PATH'e ekle" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "2. ZIP dosyası açılıyor..." -ForegroundColor Yellow
try {
    Expand-Archive -Path $zipFile -DestinationPath $extractDir -Force
    Write-Host "   ✅ Açma tamamlandı" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Açma hatası: $_" -ForegroundColor Red
    exit 1
}

# Find stripe.exe
$stripeExe = Get-ChildItem -Path $extractDir -Recurse -Filter "stripe.exe" | Select-Object -First 1

if (-not $stripeExe) {
    Write-Host "   ❌ stripe.exe bulunamadı" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "3. Stripe CLI bulundu: $($stripeExe.FullName)" -ForegroundColor Green
Write-Host ""

# Check if user wants to add to PATH
$addToPath = Read-Host "Stripe CLI'yi PATH'e eklemek ister misiniz? (Y/N)"
if ($addToPath -eq "Y" -or $addToPath -eq "y") {
    $stripeDir = Split-Path -Parent $stripeExe.FullName
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($currentPath -notlike "*$stripeDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$stripeDir", "User")
        Write-Host "   ✅ PATH'e eklendi. Yeni terminal açmanız gerekebilir." -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  PATH'te zaten var" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ℹ️  PATH'e eklenmedi. Tam yol kullanın: $($stripeExe.FullName)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "4. Stripe CLI test ediliyor..." -ForegroundColor Yellow
$stripeFullPath = $stripeExe.FullName
$version = & $stripeFullPath --version 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Stripe CLI çalışıyor: $version" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Stripe CLI test edilemedi" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Sonraki Adımlar:" -ForegroundColor Cyan
$loginCmd = "$stripeFullPath login"
$webhookCmd = "$stripeFullPath listen --forward-to localhost:3000/api/webhooks/stripe"
Write-Host "   1. Stripe CLI'ye login olun: $loginCmd" -ForegroundColor White
Write-Host "   2. Webhook dinlemek için: $webhookCmd" -ForegroundColor White
Write-Host ""

