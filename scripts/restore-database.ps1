#!/usr/bin/env pwsh
# Database Restore Script for Eagle Eye Platform
# Usage: .\scripts\restore-database.ps1 -BackupFile "backups\eagle_eye_backup_20241201_120000.sql"

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    [string]$DatabaseUrl = $env:DATABASE_URL,
    [switch]$Force = $false
)

Write-Host "🦅 Eagle Eye Database Restore" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if backup file exists
if (-not (Test-Path $BackupFile)) {
    # Check if it's a zip file
    if (Test-Path "$BackupFile.zip") {
        Write-Host "📦 Extracting backup from zip..." -ForegroundColor Yellow
        Expand-Archive -Path "$BackupFile.zip" -DestinationPath (Split-Path $BackupFile) -Force
        Write-Host "✅ Extracted" -ForegroundColor Green
    } else {
        Write-Host "❌ Backup file not found: $BackupFile" -ForegroundColor Red
        exit 1
    }
}

# Check if DATABASE_URL is set
if (-not $DatabaseUrl) {
    Write-Host "❌ DATABASE_URL environment variable not set" -ForegroundColor Red
    Write-Host "   Set it in .env file or pass as parameter" -ForegroundColor Yellow
    exit 1
}

# Parse DATABASE_URL
if ($DatabaseUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)") {
    $DbUser = $matches[1]
    $DbPassword = $matches[2]
    $DbHost = $matches[3]
    $DbPort = $matches[4]
    $DbName = $matches[5]
} else {
    Write-Host "❌ Invalid DATABASE_URL format" -ForegroundColor Red
    exit 1
}

Write-Host "⚠️  WARNING: This will REPLACE all data in database: $DbName" -ForegroundColor Yellow
Write-Host "   Host: $DbHost:$DbPort" -ForegroundColor White
Write-Host "   Backup: $BackupFile" -ForegroundColor White
Write-Host ""

# Confirm action
if (-not $Force) {
    $confirmation = Read-Host "Type 'RESTORE' to continue"
    if ($confirmation -ne "RESTORE") {
        Write-Host "❌ Restore cancelled" -ForegroundColor Red
        exit 0
    }
}

# Set password environment variable
$env:PGPASSWORD = $DbPassword

try {
    Write-Host ""
    Write-Host "🗑️  Dropping existing database..." -ForegroundColor Yellow
    
    # Drop database using Docker or local psql
    if ($DbHost -eq "localhost" -and (docker ps --filter "name=eagle-eye-db" --format "{{.Names}}" 2>$null) -eq "eagle-eye-db") {
        docker exec eagle-eye-db psql -U $DbUser -c "DROP DATABASE IF EXISTS $DbName;"
        docker exec eagle-eye-db psql -U $DbUser -c "CREATE DATABASE $DbName;"
    } else {
        psql -h $DbHost -p $DbPort -U $DbUser -c "DROP DATABASE IF EXISTS $DbName;"
        psql -h $DbHost -p $DbPort -U $DbUser -c "CREATE DATABASE $DbName;"
    }
    
    Write-Host "✅ Database reset" -ForegroundColor Green
    Write-Host ""
    Write-Host "📥 Restoring from backup..." -ForegroundColor Yellow
    
    # Restore using psql
    if ($DbHost -eq "localhost" -and (docker ps --filter "name=eagle-eye-db" --format "{{.Names}}" 2>$null) -eq "eagle-eye-db") {
        Get-Content $BackupFile | docker exec -i eagle-eye-db psql -U $DbUser -d $DbName
    } else {
        psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $BackupFile
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Restore completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔄 Regenerating Prisma client..." -ForegroundColor Yellow
        npm run db:generate
        Write-Host ""
        Write-Host "✅ Database is ready!" -ForegroundColor Green
    } else {
        Write-Host "❌ Restore failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error during restore: $_" -ForegroundColor Red
    exit 1
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
