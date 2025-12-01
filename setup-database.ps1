# Eagle Eye Database Setup Script
Write-Host "Eagle Eye Database Setup" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and run this script again." -ForegroundColor Yellow
    exit 1
}
Write-Host "Docker is running" -ForegroundColor Green
Write-Host ""

# Check if container already exists
Write-Host "Checking for existing database container..." -ForegroundColor Yellow
$containerExists = docker ps -a --filter "name=eagle-eye-db" --format "{{.Names}}" 2>&1

if ($containerExists -eq "eagle-eye-db") {
    Write-Host "Container eagle-eye-db already exists" -ForegroundColor Yellow
    
    $containerRunning = docker ps --filter "name=eagle-eye-db" --format "{{.Names}}" 2>&1
    
    if ($containerRunning -eq "eagle-eye-db") {
        Write-Host "Database container is already running" -ForegroundColor Green
    } else {
        Write-Host "Starting existing container..." -ForegroundColor Yellow
        docker start eagle-eye-db
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Database container started" -ForegroundColor Green
        } else {
            Write-Host "Failed to start container" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "Creating new database container..." -ForegroundColor Yellow
    docker run --name eagle-eye-db -e POSTGRES_PASSWORD=eagle123 -e POSTGRES_USER=eagleuser -e POSTGRES_DB=eagle_eye -p 5432:5432 -d postgres:16-alpine
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database container created and started" -ForegroundColor Green
        Write-Host "Waiting 5 seconds for PostgreSQL to initialize..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    } else {
        Write-Host "Failed to create container" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Pushing database schema..." -ForegroundColor Cyan
npm run db:push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Database setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database Information:" -ForegroundColor Cyan
    Write-Host "  Host: localhost" -ForegroundColor White
    Write-Host "  Port: 5432" -ForegroundColor White
    Write-Host "  Database: eagle_eye" -ForegroundColor White
    Write-Host "  User: eagleuser" -ForegroundColor White
    Write-Host "  Password: eagle123" -ForegroundColor White
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Run npm run dev to start both servers" -ForegroundColor White
    Write-Host "  2. Open http://localhost:3001 in your browser" -ForegroundColor White
    Write-Host "  3. Add your OpenAI API key to .env file" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Database schema push failed" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
