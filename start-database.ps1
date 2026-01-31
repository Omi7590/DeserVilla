# Quick script to start PostgreSQL with Docker
# Make sure Docker Desktop is running first!

Write-Host "=== Starting PostgreSQL Database ===" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker ps 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
} catch {
    Write-Host "❌ Docker Desktop is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Open Docker Desktop application" -ForegroundColor White
    Write-Host "2. Wait for it to fully start" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Check if container already exists
$existing = docker ps -a --filter "name=cafe-postgres" --format "{{.Names}}" 2>&1
if ($existing -eq "cafe-postgres") {
    Write-Host "Container exists. Starting it..." -ForegroundColor Yellow
    docker start cafe-postgres
    Start-Sleep -Seconds 3
} else {
    Write-Host "Creating new PostgreSQL container..." -ForegroundColor Cyan
    docker run --name cafe-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cafe_ordering -p 5432:5432 -d postgres:15-alpine
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Container created!" -ForegroundColor Green
        Write-Host "Waiting for PostgreSQL to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    } else {
        Write-Host "❌ Failed to create container" -ForegroundColor Red
        exit 1
    }
}

# Check if PostgreSQL is ready
Write-Host "Checking if PostgreSQL is ready..." -ForegroundColor Cyan
$ready = docker exec cafe-postgres pg_isready -U postgres 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL is ready!" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostgreSQL is still starting, please wait..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

# Run schema
Write-Host ""
Write-Host "Applying database schema..." -ForegroundColor Cyan
$schemaPath = Join-Path $PSScriptRoot "database\schema.sql"

if (Test-Path $schemaPath) {
    Get-Content $schemaPath | docker exec -i cafe-postgres psql -U postgres -d cafe_ordering 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Schema applied successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Schema might have errors, but continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Schema file not found at: $schemaPath" -ForegroundColor Red
    exit 1
}

# Test connection
Write-Host ""
Write-Host "Testing database connection..." -ForegroundColor Cyan
$testScript = Join-Path $PSScriptRoot "backend\scripts\testDatabase.js"
if (Test-Path $testScript) {
    Push-Location (Join-Path $PSScriptRoot "backend")
    node scripts/testDatabase.js
    Pop-Location
} else {
    Write-Host "⚠️  Test script not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure backend/.env has: DB_PASSWORD=postgres" -ForegroundColor White
Write-Host "2. Restart your backend server" -ForegroundColor White
Write-Host "3. Refresh your frontend page" -ForegroundColor White
Write-Host ""
Write-Host "Database is running in Docker container: cafe-postgres" -ForegroundColor Gray
Write-Host "To stop: docker stop cafe-postgres" -ForegroundColor Gray
Write-Host "To start again: docker start cafe-postgres" -ForegroundColor Gray
Write-Host ""

