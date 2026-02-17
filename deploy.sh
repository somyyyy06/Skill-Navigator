#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Docker
    if command -v docker &> /dev/null; then
        docker_version=$(docker --version | awk '{print $3}' | cut -d',' -f1)
        print_success "Docker installed: $docker_version"
    else
        print_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if command -v docker-compose &> /dev/null; then
        compose_version=$(docker-compose --version | awk '{print $4}' | cut -d',' -f1)
        print_success "Docker Compose installed: $compose_version"
    else
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if docker ps &> /dev/null; then
        print_success "Docker daemon is running"
    else
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    
    echo ""
}

# Setup environment
setup_env() {
    print_header "Setting Up Environment"
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            print_info "Creating .env from .env.example"
            cp .env.example .env
            print_success ".env file created"
            print_warning "Please edit .env with your actual configuration (especially API keys)"
        else
            print_error ".env.example not found"
            exit 1
        fi
    else
        print_success ".env file already exists"
    fi
    
    echo ""
}

# Build Docker images
build_images() {
    print_header "Building Docker Images"
    
    if docker-compose build; then
        print_success "Docker images built successfully"
    else
        print_error "Failed to build Docker images"
        exit 1
    fi
    
    echo ""
}

# Start services
start_services() {
    print_header "Starting Services"
    
    if docker-compose up -d; then
        print_success "Services started successfully"
    else
        print_error "Failed to start services"
        exit 1
    fi
    
    # Wait for services to be healthy
    print_info "Waiting for services to be healthy..."
    sleep 10
    
    # Check status
    if docker-compose ps | grep -q "healthy"; then
        print_success "Services are healthy"
    else
        print_warning "Services may still be starting. Check with: docker-compose ps"
    fi
    
    echo ""
}

# Display info
display_info() {
    print_header "Deployment Complete!"
    
    echo -e "${GREEN}Services are running:${NC}"
    docker-compose ps
    
    echo ""
    echo -e "${GREEN}Access points:${NC}"
    echo "  Application: http://localhost:5000"
    echo "  Database: localhost:5433"
    
    echo ""
    echo -e "${GREEN}Useful commands:${NC}"
    echo "  View logs:          docker-compose logs -f"
    echo "  Stop services:      docker-compose down"
    echo "  Access database:    docker-compose exec postgres psql -U crisis -d learnai"
    echo "  Rebuild:            docker-compose build"
    
    echo ""
}

# Main menu
show_menu() {
    echo -e "${BLUE}What would you like to do?${NC}"
    echo "1. Full setup (check, build, start)"
    echo "2. Check prerequisites only"
    echo "3. Setup environment only"
    echo "4. Build images only"
    echo "5. Start services only"
    echo "6. Check status"
    echo "7. View logs"
    echo "8. Stop services"
    echo "9. Exit"
    echo ""
    read -p "Select option (1-9): " choice
}

# Check status
check_status() {
    print_header "Service Status"
    docker-compose ps
    echo ""
}

# View logs
view_logs() {
    print_header "Service Logs (Press Ctrl+C to exit)"
    docker-compose logs -f --tail=50
}

# Stop services
stop_services() {
    print_header "Stopping Services"
    if docker-compose down; then
        print_success "Services stopped"
    else
        print_error "Failed to stop services"
    fi
    echo ""
}

# Main script
main() {
    print_header "Skill Navigator - Docker Deployment"
    
    if [ "$1" == "auto" ]; then
        # Automatic setup mode
        check_prerequisites
        setup_env
        build_images
        start_services
        display_info
    else
        # Interactive mode
        while true; do
            show_menu
            case $choice in
                1) check_prerequisites; setup_env; build_images; start_services; display_info ;;
                2) check_prerequisites ;;
                3) setup_env ;;
                4) build_images ;;
                5) start_services ;;
                6) check_status ;;
                7) view_logs ;;
                8) stop_services ;;
                9) echo "Goodbye!"; exit 0 ;;
                *) print_error "Invalid option" ;;
            esac
        done
    fi
}

# Run main function
main "$@"
