# Hall Settings Migration Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hall Settings Database Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is running
Write-Host "Checking MySQL service..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue

if ($null -eq $mysqlService) {
    Write-Host "ERROR: MySQL service not found!" -ForegroundColor Red
    Write-Host "Please start XAMPP MySQL service first." -ForegroundColor Yellow
    pause
    exit 1
}

if ($mysqlService.Status -ne "Running") {
    Write-Host "ERROR: MySQL service is not running!" -ForegroundColor Red
    Write-Host "Please start XAMPP MySQL service first." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "MySQL service is running!" -ForegroundColor Green
Write-Host ""

# Database credentials
$DB_HOST = "localhost"
$DB_USER = "root"
$DB_PASS = ""
$DB_NAME = "cafe_ordering"

Write-Host "Running migration..." -ForegroundColor Yellow
Write-Host "Database: $DB_NAME" -ForegroundColor Cyan
Write-Host ""

# Run the migration
$migrationFile = "database/migrations/002_add_hall_settings.sql"

if (Test-Path $migrationFile) {
    Write-Host "Executing: $migrationFile" -ForegroundColor Cyan
    
    # Execute SQL file
    $mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
    
    if (Test-Path $mysqlPath) {
        & $mysqlPath -h $DB_HOST -u $DB_USER $DB_NAME -e "source $migrationFile"
        
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
        }
    } else {
        Write-Host "ERROR: MySQL executable not found at: $mysqlPath" -ForegroundColor Red
        Write-Host "Please update the path in this script." -ForegroundColor Yellow
    }
} else {
    Write-Host "ERROR: Migration file not found: $migrationFile" -ForegroundColor Red
}

Write-Host ""
pause
