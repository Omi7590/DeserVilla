# Hall Settings Migration Script for Cloud MySQL
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hall Settings Database Migration" -ForegroundColor Cyan
Write-Host "  (Aiven Cloud MySQL)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables from backend/.env
$envFile = "backend\.env"
if (Test-Path $envFile) {
    Write-Host "Loading database credentials from .env..." -ForegroundColor Yellow
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Variable -Name $key -Value $value -Scope Script
        }
    }
    Write-Host "Credentials loaded!" -ForegroundColor Green
} else {
    Write-Host "ERROR: .env file not found at: $envFile" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Database Configuration:" -ForegroundColor Cyan
Write-Host "  Host: $DB_HOST" -ForegroundColor White
Write-Host "  Port: $DB_PORT" -ForegroundColor White
Write-Host "  User: $DB_USER" -ForegroundColor White
Write-Host "  Database: $DB_NAME" -ForegroundColor White
Write-Host ""

# Check if MySQL client is available
$mysqlPath = "mysql"
try {
    $null = & $mysqlPath --version 2>&1
    Write-Host "MySQL client found!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: MySQL client not found in PATH" -ForegroundColor Red
    Write-Host "Please install MySQL client or add it to your PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Run the SQL manually in your database console" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "Running migration..." -ForegroundColor Yellow

# Read migration file
$migrationFile = "database\migrations\002_add_hall_settings.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "ERROR: Migration file not found: $migrationFile" -ForegroundColor Red
    pause
    exit 1
}

$sqlContent = Get-Content $migrationFile -Raw

# Execute SQL
Write-Host "Executing SQL..." -ForegroundColor Cyan
$sqlContent | & $mysqlPath -h $DB_HOST -P $DB_PORT -u $DB_USER -p"$DB_PASSWORD" $DB_NAME --ssl-mode=REQUIRED

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Migration completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Hall settings table created with default values:" -ForegroundColor Cyan
    Write-Host "  - Hourly Rate: Rs.500" -ForegroundColor White
    Write-Host "  - Start Hour: 10:00 AM" -ForegroundColor White
    Write-Host "  - End Hour: 8:00 PM (20:00)" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now edit these settings from the Admin Panel > Hall Settings" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "ERROR: Migration failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can also run the SQL manually:" -ForegroundColor Yellow
    Write-Host "1. Open your Aiven console" -ForegroundColor White
    Write-Host "2. Go to your database" -ForegroundColor White
    Write-Host "3. Run the SQL from: $migrationFile" -ForegroundColor White
}

Write-Host ""
pause
