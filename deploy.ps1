# Skill Navigator - Docker Deployment Script (Windows PowerShell)
# Usage: .\deploy.ps1 or .\deploy.ps1 -Mode Auto

param(
    [string]$Mode = "Interactive"
)

# Color functions
function Write-Header {
    param([string]$Text)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "✓ $Text" -ForegroundColor Green
}

function Write-Error_ {
    param([string]$Text)
    Write-Host "✗ $Text" -ForegroundColor Red
}

function Write-Warning_ {
    param([string]$Text)
    Write-Host "⚠ $Text" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Text)
    Write-Host "ℹ $Text" -ForegroundColor Cyan
}

# Check prerequisites
function Check-Prerequisites {
    Write-Header "Checking Prerequisites"
    
    # Check Docker
    try {
        $dockerVersion = & docker --version
        Write-Success "Docker installed: $dockerVersion"
    } catch {
        Write-Error_ "Docker is not installed or not in PATH"
        exit 1
    }
    
    # Check Docker Compose
    try {
        $composeVersion = & docker-compose --version
        Write-Success "Docker Compose installed: $composeVersion"
    } catch {
        Write-Error_ "Docker Compose is not installed or not in PATH"
        exit 1
    }
    
    # Check Docker daemon
    try {
        & docker ps > $null
        Write-Success "Docker daemon is running"
    } catch {
        Write-Error_ "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    }
}

# Setup environment file
function Setup-Environment {
    Write-Header "Setting Up Environment"
    
    if (-not (Test-Path .env)) {
        if (Test-Path .env.example) {
            Write-Info "Creating .env from .env.example"
            Copy-Item .env.example .env
            Write-Success ".env file created"
            Write-Warning_ "Please edit .env with your actual configuration (especially API keys)"
        } else {
            Write-Error_ ".env.example not found"
            exit 1
        }
    } else {
        Write-Success ".env file already exists"
    }
}

# Build Docker images
function Build-Images {
    Write-Header "Building Docker Images"
    
    Write-Info "This may take several minutes on first run..."
    & docker-compose build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Docker images built successfully"
    } else {
        Write-Error_ "Failed to build Docker images"
        exit 1
    }
}

# Start services
function Start-Services {
    Write-Header "Starting Services"
    
    & docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Services started successfully"
    } else {
        Write-Error_ "Failed to start services"
        exit 1
    }
    
    Write-Info "Waiting for services to be healthy..."
    Start-Sleep -Seconds 10
    
    # Check status
    $status = & docker-compose ps
    if ($status -match "healthy") {
        Write-Success "Services are healthy"
    } else {
        Write-Warning_ "Services may still be starting. Check with: docker-compose ps"
    }
}

# Display deployment information
function Display-Info {
    Write-Header "Deployment Complete!"
    
    Write-Host "Services are running:" -ForegroundColor Green
    & docker-compose ps
    
    Write-Host "`nAccess points:" -ForegroundColor Green
    Write-Host "  Application: http://localhost:5000" -ForegroundColor Yellow
    Write-Host "  Database: localhost:5433" -ForegroundColor Yellow
    
    Write-Host "`nUseful commands:" -ForegroundColor Green
    Write-Host "  View logs:          docker-compose logs -f"
    Write-Host "  Stop services:      docker-compose down"
    Write-Host "  Access database:    docker-compose exec postgres psql -U crisis -d learnai"
    Write-Host "  Rebuild:            docker-compose build"
    Write-Host ""
}

# Check status
function Check-Status {
    Write-Header "Service Status"
    & docker-compose ps
}

# View logs
function View-Logs {
    Write-Header "Service Logs (Press Ctrl+C to exit)"
    & docker-compose logs -f --tail=50
}

# Stop services
function Stop-Services {
    Write-Header "Stopping Services"
    & docker-compose down
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Services stopped"
    } else {
        Write-Error_ "Failed to stop services"
    }
}

# Display menu
function Show-Menu {
    Write-Host "What would you like to do?" -ForegroundColor Cyan
    Write-Host "1. Full setup (check, build, start)" -ForegroundColor White
    Write-Host "2. Check prerequisites only" -ForegroundColor White
    Write-Host "3. Setup environment only" -ForegroundColor White
    Write-Host "4. Build images only" -ForegroundColor White
    Write-Host "5. Start services only" -ForegroundColor White
    Write-Host "6. Check status" -ForegroundColor White
    Write-Host "7. View logs" -ForegroundColor White
    Write-Host "8. Stop services" -ForegroundColor White
    Write-Host "9. Exit" -ForegroundColor White
    Write-Host ""
}

# Main function
function Main {
    Write-Header "Skill Navigator - Docker Deployment"
    
    if ($Mode -eq "Auto") {
        # Automatic setup
        Check-Prerequisites
        Setup-Environment
        Build-Images
        Start-Services
        Display-Info
    } else {
        # Interactive menu
        while ($true) {
            Show-Menu
            $choice = Read-Host "Select option (1-9)"
            
            switch ($choice) {
                "1" {
                    Check-Prerequisites
                    Setup-Environment
                    Build-Images
                    Start-Services
                    Display-Info
                }
                "2" { Check-Prerequisites }
                "3" { Setup-Environment }
                "4" { Build-Images }
                "5" { Start-Services }
                "6" { Check-Status }
                "7" { View-Logs }
                "8" { Stop-Services }
                "9" { 
                    Write-Host "Goodbye!" -ForegroundColor Green
                    exit 0 
                }
                default { Write-Error_ "Invalid option" }
            }
        }
    }
}

# Run main function
Main
