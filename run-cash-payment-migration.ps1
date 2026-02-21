# Cash Payment Migration Script
# This script runs the database migration to add cash payment support

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CASH PAYMENT SYSTEM - DATABASE MIGRATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is installed
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"

if (-not (Test-Path $mysqlPath)) {
    Write-Host "ERROR: MySQL not found at $mysqlPath" -ForegroundColor Red
    Write-Host "Please update the `$mysqlPath variable in this script" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common MySQL paths:" -ForegroundColor Yellow
    Write-Host "  - C:\xampp\mysql\bin\mysql.exe (XAMPP)" -ForegroundColor Gray
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -ForegroundColor Gray
    Write-Host "  - C:\wamp64\bin\mysql\mysql8.0.x\bin\mysql.exe (WAMP)" -ForegroundColor Gray
    exit 1
}

Write-Host "✓ MySQL found at: $mysqlPath" -ForegroundColor Green
Write-Host ""

# Check if migration file exists
$migrationFile = "database\migrations\001_add_cash_payment_fields.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "ERROR: Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Migration file found" -ForegroundColor Green
Write-Host ""

# Get database credentials
Write-Host "Enter MySQL credentials:" -ForegroundColor Cyan
$dbUser = Read-Host "Username (default: root)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "root"
}

$dbPassword = Read-Host "Password (press Enter if no password)" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

$dbName = Read-Host "Database name (default: cafe_ordering)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "cafe_ordering"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Running migration..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run migration
try {
    if ([string]::IsNullOrWhiteSpace($dbPasswordPlain)) {
        # No password
        & $mysqlPath -u $dbUser $dbName -e "source $migrationFile"
    } else {
        # With password
        & $mysqlPath -u $dbUser -p$dbPasswordPlain $dbName -e "source $migrationFile"
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ MIGRATION SUCCESSFUL!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "The following columns have been added to the orders table:" -ForegroundColor Green
        Write-Host "  - payment_method (ENUM: 'ONLINE', 'CASH')" -ForegroundColor Gray
        Write-Host "  - paid_at (DATETIME)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Start your backend: cd backend && npm start" -ForegroundColor Gray
        Write-Host "  2. Start your frontend: cd frontend && npm run dev" -ForegroundColor Gray
        Write-Host "  3. Test the cash payment system" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "ERROR: Migration failed!" -ForegroundColor Red
        Write-Host "Please check the error message above" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to run migration" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Verify migration
Write-Host "Verifying migration..." -ForegroundColor Yellow
Write-Host ""

try {
    if ([string]::IsNullOrWhiteSpace($dbPasswordPlain)) {
        $result = & $mysqlPath -u $dbUser $dbName -e "DESCRIBE orders;" 2>&1
    } else {
        $result = & $mysqlPath -u $dbUser -p$dbPasswordPlain $dbName -e "DESCRIBE orders;" 2>&1
    }
    
    if ($result -match "payment_method" -and $result -match "paid_at") {
        Write-Host "✓ Verification successful! Columns exist." -ForegroundColor Green
        Write-Host ""
        Write-Host "Orders table structure:" -ForegroundColor Cyan
        Write-Host $result -ForegroundColor Gray
    } else {
        Write-Host "⚠ Warning: Could not verify columns" -ForegroundColor Yellow
        Write-Host "Please manually check: DESCRIBE orders;" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Could not verify migration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CASH PAYMENT SYSTEM IS READY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Pause to see results
Read-Host "Press Enter to exit"
