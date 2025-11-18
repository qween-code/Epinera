# Stripe Test Payment İşlemleri
# Sandbox'ta test ödeme işlemleri yapar

param(
    [int]$Amount = 2000,
    [string]$Currency = "usd",
    [string]$UserId = "test-user-$(Get-Random)"
)

Write-Host "💳 Stripe Test Payment İşlemleri" -ForegroundColor Green
Write-Host ""

# 1. Payment Intent oluştur
Write-Host "1️⃣ Payment Intent oluşturuluyor..." -ForegroundColor Cyan
Write-Host "   Amount: $($Amount / 100) $Currency" -ForegroundColor White
Write-Host "   User ID: $UserId" -ForegroundColor White
Write-Host ""

$paymentIntent = stripe payment_intents create `
    --amount=$Amount `
    --currency=$Currency `
    --metadata[user_id]=$UserId `
    --metadata[transaction_id]="test-tx-$(Get-Random)" `
    --metadata[test]=true `
    --metadata[description]="Test deposit" `
    --description="Test deposit for $UserId" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Payment Intent oluşturuldu!" -ForegroundColor Green
    
    # JSON parse et
    $piJson = $paymentIntent | ConvertFrom-Json
    $piId = $piJson.id
    $clientSecret = $piJson.client_secret
    
    Write-Host "   📋 Payment Intent ID: $piId" -ForegroundColor Cyan
    Write-Host "   🔐 Client Secret: $($clientSecret.Substring(0, 20))..." -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "   📝 Sonraki adımlar:" -ForegroundColor Yellow
    Write-Host "   1. Client-side'da Stripe Elements ile ödeme yapın" -ForegroundColor White
    Write-Host "   2. Test kartı: 4242 4242 4242 4242" -ForegroundColor White
    Write-Host "   3. Webhook otomatik olarak bakiye ekleyecek" -ForegroundColor White
    Write-Host ""
    
    # Payment Intent detayı
    Write-Host "2️⃣ Payment Intent detayı:" -ForegroundColor Cyan
    stripe payment_intents retrieve $piId 2>&1
    Write-Host ""
    
} else {
    Write-Host "   ❌ Payment Intent oluşturulamadı!" -ForegroundColor Red
    Write-Host $paymentIntent -ForegroundColor Red
    exit 1
}

# 3. Event kontrolü
Write-Host "3️⃣ Son Events:" -ForegroundColor Cyan
stripe events list --type=payment_intent.created --limit 1 2>&1
Write-Host ""

Write-Host "✅ Test payment işlemi tamamlandı!" -ForegroundColor Green
Write-Host ""

