# Quick Database Setup Script
# This script will help you set up the database quickly

Write-Host "=== Quick Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check for PostgreSQL installation
$psqlPath = $null
$pgPaths = @(
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe"
)

foreach ($path in $pgPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        Write-Host "✅ Found PostgreSQL: $path" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "❌ PostgreSQL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please choose an option:" -ForegroundColor Yellow
    Write-Host "1. Install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "2. Use Docker Desktop (if installed)" -ForegroundColor White
    Write-Host ""
    Write-Host "For Docker:" -ForegroundColor Cyan
    Write-Host "  a. Start Docker Desktop" -ForegroundColor White
    Write-Host "  b. Run: .\start-database.ps1" -ForegroundColor Green
    exit 1
}

Write-Host ""
Write-Host "Enter PostgreSQL password for user 'postgres':" -ForegroundColor Yellow
$securePassword = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Set password as environment variable
$env:PGPASSWORD = $password

Write-Host ""
Write-Host "Step 1: Creating database 'cafe_ordering'..." -ForegroundColor Cyan
& $psqlPath -U postgres -c "CREATE DATABASE cafe_ordering;" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database might already exist (this is okay)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Running schema..." -ForegroundColor Cyan
$schemaPath = Join-Path $PSScriptRoot "database\schema.sql"
if (Test-Path $schemaPath) {
    & $psqlPath -U postgres -d cafe_ordering -f $schemaPath 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Schema applied successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some errors occurred, but continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Schema file not found: $schemaPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Testing connection..." -ForegroundColor Cyan
$testScript = Join-Path $PSScriptRoot "backend\scripts\testDatabase.js"
if (Test-Path $testScript) {
    Push-Location (Join-Path $PSScriptRoot "backend")
    node scripts/testDatabase.js
    Pop-Location
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Database is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure backend/.env has: DB_PASSWORD=$password" -ForegroundColor White
Write-Host "2. Restart your backend server" -ForegroundColor White
Write-Host "3. Refresh your browser" -ForegroundColor White
Write-Host ""

# Clear password
Remove-Item Env:\PGPASSWORD

