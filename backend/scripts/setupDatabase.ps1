# PowerShell script to set up the database
# Run this script as Administrator if needed

Write-Host "=== Cafe Ordering System - Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
$psqlPath = $null
$psqlCommands = @("psql", "C:\Program Files\PostgreSQL\15\bin\psql.exe", "C:\Program Files\PostgreSQL\14\bin\psql.exe", "C:\Program Files\PostgreSQL\13\bin\psql.exe")

foreach ($cmd in $psqlCommands) {
    try {
        $result = Get-Command $cmd -ErrorAction Stop
        $psqlPath = $result.Source
        Write-Host "✅ Found PostgreSQL at: $psqlPath" -ForegroundColor Green
        break
    } catch {
        continue
    }
}

if (-not $psqlPath) {
    Write-Host "❌ PostgreSQL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PostgreSQL from:" -ForegroundColor Yellow
    Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use Docker:" -ForegroundColor Yellow
    Write-Host "docker run --name cafe-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cafe_ordering -p 5432:5432 -d postgres" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "Enter PostgreSQL password for user 'postgres':" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Set environment variable for password
$env:PGPASSWORD = $plainPassword

Write-Host ""
Write-Host "Step 1: Creating database..." -ForegroundColor Cyan
try {
    & $psqlPath -U postgres -c "CREATE DATABASE cafe_ordering;" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Database might already exist (this is okay)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Database might already exist (this is okay)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Running schema..." -ForegroundColor Cyan
$schemaPath = Join-Path $PSScriptRoot "..\..\database\schema.sql"
if (Test-Path $schemaPath) {
    try {
        & $psqlPath -U postgres -d cafe_ordering -f $schemaPath
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Schema applied successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Error applying schema" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Schema file not found at: $schemaPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Testing connection..." -ForegroundColor Cyan
$testScript = Join-Path $PSScriptRoot "testDatabase.js"
if (Test-Path $testScript) {
    node $testScript
} else {
    Write-Host "⚠️  Test script not found, but database should be ready!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure backend/.env has correct database credentials" -ForegroundColor White
Write-Host "2. Restart the backend server" -ForegroundColor White
Write-Host "3. Refresh your frontend page" -ForegroundColor White
Write-Host ""

# Clear password from environment
Remove-Item Env:\PGPASSWORD

