# Stripe Test İşlemleri Script
# Sandbox'ta test işlemleri yapar

Write-Host "🧪 Stripe Test İşlemleri" -ForegroundColor Green
Write-Host ""

# 1. Test Payment Intent oluştur
Write-Host "1️⃣ Test Payment Intent oluşturuluyor..." -ForegroundColor Cyan
$paymentIntent = stripe payment_intents create `
    --amount=2000 `
    --currency=usd `
    --metadata[test]=true `
    --metadata[description]="Test deposit" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Payment Intent oluşturuldu!" -ForegroundColor Green
    Write-Host $paymentIntent -ForegroundColor White
} else {
    Write-Host "   ❌ Payment Intent oluşturulamadı: $paymentIntent" -ForegroundColor Red
}
Write-Host ""

# 2. Test Customer oluştur
Write-Host "2️⃣ Test Customer oluşturuluyor..." -ForegroundColor Cyan
$customer = stripe customers create `
    --email="test-customer@epinmarketplace.com" `
    --name="Test Customer" `
    --metadata[test]=true 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Customer oluşturuldu!" -ForegroundColor Green
    Write-Host $customer -ForegroundColor White
} else {
    Write-Host "   ❌ Customer oluşturulamadı: $customer" -ForegroundColor Red
}
Write-Host ""

# 3. Balance kontrolü
Write-Host "3️⃣ Balance bilgisi:" -ForegroundColor Cyan
stripe balance retrieve 2>&1
Write-Host ""

# 4. Son Payment Intents
Write-Host "4️⃣ Son Payment Intents:" -ForegroundColor Cyan
stripe payment_intents list --limit 5 2>&1
Write-Host ""

# 5. Son Events
Write-Host "5️⃣ Son Events:" -ForegroundColor Cyan
stripe events list --limit 5 2>&1
Write-Host ""

Write-Host "✅ Test işlemleri tamamlandı!" -ForegroundColor Green

