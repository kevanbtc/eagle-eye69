#!/usr/bin/env pwsh
# Automated backup script - run daily via Task Scheduler or cron
# Usage: .\scripts\auto-backup.ps1

$BackupDir = "backups"
$MaxBackups = 30  # Keep last 30 days
$MaxAgeDays = 30

Write-Host "🦅 Eagle Eye Automated Backup" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Run backup
& "$PSScriptRoot\backup-database.ps1" -BackupDir $BackupDir -Compress

# Clean up old backups
if (Test-Path $BackupDir) {
    Write-Host ""
    Write-Host "🧹 Cleaning up old backups..." -ForegroundColor Yellow
    
    $OldBackups = Get-ChildItem $BackupDir -Filter "eagle_eye_backup_*" | 
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$MaxAgeDays) } |
        Sort-Object LastWriteTime
    
    if ($OldBackups.Count -gt 0) {
        Write-Host "   Found $($OldBackups.Count) old backups to delete" -ForegroundColor White
        $OldBackups | ForEach-Object {
            Remove-Item $_.FullName -Force
            Write-Host "   ❌ Deleted: $($_.Name)" -ForegroundColor Red
        }
    } else {
        Write-Host "   No old backups to clean up" -ForegroundColor White
    }
    
    # Keep only latest N backups
    $AllBackups = Get-ChildItem $BackupDir -Filter "eagle_eye_backup_*" | 
        Sort-Object LastWriteTime -Descending
    
    if ($AllBackups.Count -gt $MaxBackups) {
        $ToDelete = $AllBackups | Select-Object -Skip $MaxBackups
        Write-Host "   Keeping only $MaxBackups most recent backups" -ForegroundColor White
        $ToDelete | ForEach-Object {
            Remove-Item $_.FullName -Force
            Write-Host "   ❌ Deleted: $($_.Name)" -ForegroundColor Red
        }
    }
    
    # Calculate total backup size
    $TotalSize = ($AllBackups | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host ""
    Write-Host "💾 Total backup storage: $([math]::Round($TotalSize, 2)) MB" -ForegroundColor Cyan
    Write-Host "📊 Backups retained: $($AllBackups.Count)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Automated backup complete!" -ForegroundColor Green
