# PowerShell script to add Razorpay keys to .env file
# Run this from the backend directory

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    New-Item -ItemType File -Path $envFile -Force | Out-Null
}

$content = Get-Content $envFile -ErrorAction SilentlyContinue

# Check if keys already exist
$hasKeyId = $content | Select-String -Pattern "RAZORPAY_KEY_ID"
$hasKeySecret = $content | Select-String -Pattern "RAZORPAY_KEY_SECRET"

if ($hasKeyId -and $hasKeySecret) {
    Write-Host "✅ Razorpay keys already exist in .env" -ForegroundColor Green
    Write-Host ""
    Write-Host "Current keys:" -ForegroundColor Cyan
    $content | Select-String -Pattern "RAZORPAY" | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
} else {
    Write-Host "Adding Razorpay keys to .env..." -ForegroundColor Yellow
    
    # Add keys if they don't exist
    if (-not $hasKeyId) {
        Add-Content -Path $envFile -Value "RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0"
        Write-Host "✅ Added RAZORPAY_KEY_ID" -ForegroundColor Green
    }
    
    if (-not $hasKeySecret) {
        Add-Content -Path $envFile -Value "RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm"
        Write-Host "✅ Added RAZORPAY_KEY_SECRET" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "✅ Razorpay keys added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Restart your backend server for changes to take effect!" -ForegroundColor Yellow
}

