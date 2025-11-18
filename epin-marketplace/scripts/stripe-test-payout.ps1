# Stripe Test Payout İşlemleri
# Sandbox'ta test payout işlemleri yapar

param(
    [int]$Amount = 1000,
    [string]$Currency = "usd",
    [string]$Destination = "",
    [string]$UserId = "test-seller-$(Get-Random)"
)

Write-Host "💰 Stripe Test Payout İşlemleri" -ForegroundColor Green
Write-Host ""

# Eğer destination yoksa, test connected account oluştur
if ([string]::IsNullOrEmpty($Destination)) {
    Write-Host "1️⃣ Test Connected Account oluşturuluyor..." -ForegroundColor Cyan
    
    $account = stripe accounts create `
        --type=express `
        --country=US `
        --email="test-seller@epinmarketplace.com" `
        --metadata[test]=true `
        --metadata[user_id]=$UserId 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $accountJson = $account | ConvertFrom-Json
        $Destination = $accountJson.id
        Write-Host "   ✅ Connected Account oluşturuldu: $Destination" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Connected Account oluşturulamadı, manuel account ID gerekli" -ForegroundColor Yellow
        Write-Host "   Transfer için destination account ID gerekli!" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Transfer oluştur
Write-Host "2️⃣ Transfer oluşturuluyor..." -ForegroundColor Cyan
Write-Host "   Amount: $($Amount / 100) $Currency" -ForegroundColor White
Write-Host "   Destination: $Destination" -ForegroundColor White
Write-Host "   User ID: $UserId" -ForegroundColor White
Write-Host ""

$transfer = stripe transfers create `
    --amount=$Amount `
    --currency=$Currency `
    --destination=$Destination `
    --metadata[user_id]=$UserId `
    --metadata[transaction_id]="test-payout-$(Get-Random)" `
    --metadata[test]=true `
    --metadata[description]="Test payout" `
    --description="Test payout for $UserId" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Transfer oluşturuldu!" -ForegroundColor Green
    
    $transferJson = $transfer | ConvertFrom-Json
    $transferId = $transferJson.id
    
    Write-Host "   📋 Transfer ID: $transferId" -ForegroundColor Cyan
    Write-Host ""
    
    # Transfer detayı
    Write-Host "3️⃣ Transfer detayı:" -ForegroundColor Cyan
    stripe transfers retrieve $transferId 2>&1
    Write-Host ""
    
    # Event kontrolü
    Write-Host "4️⃣ Son Transfer Events:" -ForegroundColor Cyan
    stripe events list --type=transfer.created --limit 1 2>&1
    Write-Host ""
    
} else {
    Write-Host "   ❌ Transfer oluşturulamadı!" -ForegroundColor Red
    Write-Host $transfer -ForegroundColor Red
    exit 1
}

Write-Host "✅ Test payout işlemi tamamlandı!" -ForegroundColor Green
Write-Host ""

