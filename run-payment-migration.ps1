# Payment Management System Migration Script
# This script adds payment_method and paid_at fields to the orders table

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Payment Management System Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
if (Test-Path "backend\.env") {
    Write-Host "Loading database configuration..." -ForegroundColor Yellow
    Get-Content "backend\.env" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+?)\s*=\s*(.+?)\s*$') {
            $name = $matches[1]
            $value = $matches[2]
            Set-Item -Path "env:$name" -Value $value
        }
    }
} else {
    Write-Host "Error: backend\.env file not found!" -ForegroundColor Red
    exit 1
}

$DB_HOST = $env:DB_HOST
$DB_PORT = $env:DB_PORT
$DB_NAME = $env:DB_NAME
$DB_USER = $env:DB_USER
$DB_PASSWORD = $env:DB_PASSWORD

Write-Host "Database: $DB_NAME" -ForegroundColor Green
Write-Host "Host: $DB_HOST" -ForegroundColor Green
Write-Host ""

# Check if mysql command is available
$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlCmd) {
    Write-Host "Error: MySQL client not found!" -ForegroundColor Red
    Write-Host "Please install MySQL client or add it to your PATH" -ForegroundColor Yellow
    exit 1
}

Write-Host "Running migration..." -ForegroundColor Yellow
Write-Host ""

# Run the migration
$migrationFile = "database\migrations\002_add_payment_fields.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "Error: Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

try {
    # Execute migration
    $mysqlArgs = @(
        "-h", $DB_HOST,
        "-P", $DB_PORT,
        "-u", $DB_USER,
        "-p$DB_PASSWORD",
        $DB_NAME
    )
    
    Get-Content $migrationFile | & mysql @mysqlArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Changes applied:" -ForegroundColor Cyan
        Write-Host "  ✓ Added payment_method column (ENUM: ONLINE, CASH)" -ForegroundColor White
        Write-Host "  ✓ Added paid_at column (TIMESTAMP)" -ForegroundColor White
        Write-Host "  ✓ Added index for payment_method" -ForegroundColor White
        Write-Host "  ✓ Updated existing orders" -ForegroundColor White
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Restart your backend server" -ForegroundColor White
        Write-Host "  2. Test the payment management system" -ForegroundColor White
        Write-Host "  3. Check the admin panel payments page" -ForegroundColor White
    } else {
        Write-Host "❌ Migration failed!" -ForegroundColor Red
        Write-Host "Please check the error messages above" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Error running migration: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Migration Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
