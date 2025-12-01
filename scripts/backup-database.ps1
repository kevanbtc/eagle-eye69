#!/usr/bin/env pwsh
# Database Backup Script for Eagle Eye Platform
# Usage: .\scripts\backup-database.ps1

param(
    [string]$BackupDir = "backups",
    [string]$DatabaseUrl = $env:DATABASE_URL,
    [switch]$Compress = $true
)

Write-Host "🦅 Eagle Eye Database Backup" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is set
if (-not $DatabaseUrl) {
    Write-Host "❌ DATABASE_URL environment variable not set" -ForegroundColor Red
    Write-Host "   Set it in .env file or pass as parameter" -ForegroundColor Yellow
    exit 1
}

# Parse DATABASE_URL
# Format: postgresql://user:password@host:port/database
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

# Create backup directory
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
    Write-Host "✅ Created backup directory: $BackupDir" -ForegroundColor Green
}

# Generate backup filename with timestamp
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\eagle_eye_backup_$Timestamp.sql"

Write-Host "📦 Starting backup..." -ForegroundColor Yellow
Write-Host "   Database: $DbName" -ForegroundColor White
Write-Host "   Host: $DbHost:$DbPort" -ForegroundColor White
Write-Host "   File: $BackupFile" -ForegroundColor White
Write-Host ""

# Set password environment variable for pg_dump
$env:PGPASSWORD = $DbPassword

try {
    # Run pg_dump using Docker (if database is in container)
    if ($DbHost -eq "localhost" -and (docker ps --filter "name=eagle-eye-db" --format "{{.Names}}" 2>$null) -eq "eagle-eye-db") {
        Write-Host "🐳 Using Docker container..." -ForegroundColor Cyan
        docker exec eagle-eye-db pg_dump -U $DbUser -d $DbName > $BackupFile
    } else {
        # Use local pg_dump
        pg_dump -h $DbHost -p $DbPort -U $DbUser -d $DbName -F p -f $BackupFile
    }
    
    if ($LASTEXITCODE -eq 0) {
        $FileSize = (Get-Item $BackupFile).Length / 1MB
        Write-Host "✅ Backup completed successfully!" -ForegroundColor Green
        Write-Host "   Size: $([math]::Round($FileSize, 2)) MB" -ForegroundColor White
        
        # Compress if requested
        if ($Compress) {
            Write-Host ""
            Write-Host "🗜️  Compressing backup..." -ForegroundColor Yellow
            $ZipFile = "$BackupFile.zip"
            Compress-Archive -Path $BackupFile -DestinationPath $ZipFile -Force
            
            if (Test-Path $ZipFile) {
                $ZipSize = (Get-Item $ZipFile).Length / 1MB
                Remove-Item $BackupFile
                Write-Host "✅ Compressed: $ZipFile" -ForegroundColor Green
                Write-Host "   Size: $([math]::Round($ZipSize, 2)) MB (saved $([math]::Round($FileSize - $ZipSize, 2)) MB)" -ForegroundColor White
            }
        }
        
        # List recent backups
        Write-Host ""
        Write-Host "📂 Recent backups:" -ForegroundColor Cyan
        Get-ChildItem $BackupDir -Filter "eagle_eye_backup_*" | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -First 5 | 
            ForEach-Object {
                $size = [math]::Round($_.Length / 1MB, 2)
                Write-Host "   $($_.Name) - $size MB - $($_.LastWriteTime)" -ForegroundColor White
            }
        
        Write-Host ""
        Write-Host "💡 To restore this backup, run:" -ForegroundColor Yellow
        Write-Host "   .\scripts\restore-database.ps1 -BackupFile $BackupFile" -ForegroundColor White
    } else {
        Write-Host "❌ Backup failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error during backup: $_" -ForegroundColor Red
    exit 1
} finally {
    # Clear password from environment
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
