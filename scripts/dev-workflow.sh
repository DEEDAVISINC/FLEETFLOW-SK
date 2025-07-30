#!/bin/bash

# FleetFlow Development Workflow Script
# Manages Supabase local development with hot reloading

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Cleanup function
cleanup() {
  log_info "Cleaning up processes..."
  pkill -f "supabase" 2>/dev/null || true
  pkill -f "next dev" 2>/dev/null || true
  pkill -f "nodemon" 2>/dev/null || true
}

# Set trap for cleanup on exit
trap cleanup EXIT INT TERM

echo "🚀 FleetFlow Development Workflow"
echo "================================="

# Check dependencies
log_info "Checking dependencies..."

if ! command -v supabase &> /dev/null; then
    log_error "Supabase CLI not found. Install with: npm install -g supabase@latest"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    log_warning "Docker not found. Supabase requires Docker for local development."
    log_info "Download Docker Desktop from: https://www.docker.com/products/docker-desktop"
    read -p "Do you want to continue without local Supabase? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    USE_LOCAL_SUPABASE=false
else
    USE_LOCAL_SUPABASE=true
fi

# Initialize Supabase if needed
if [ "$USE_LOCAL_SUPABASE" = true ]; then
    log_info "Setting up Supabase local development..."

    if [ ! -f "supabase/config.toml" ]; then
        log_info "Initializing Supabase project..."
        supabase init
    fi

    # Check if Supabase is already running
    if supabase status 2>/dev/null | grep -q "API URL"; then
        log_info "Supabase is already running"
    else
        log_info "Starting Supabase local environment..."
        supabase start
        if [ $? -eq 0 ]; then
            log_success "Supabase started successfully"
            supabase status
        else
            log_error "Failed to start Supabase"
            USE_LOCAL_SUPABASE=false
        fi
    fi
fi

# Workflow selection
echo ""
log_info "Select development workflow:"
echo "1. Full Stack (Next.js + Supabase + Functions + Type Generation)"
echo "2. Frontend Only (Next.js + Type Watching)"
echo "3. Database Only (Supabase + Migrations)"
echo "4. Functions Development (Supabase Functions + Next.js)"
echo "5. Quick Start (Next.js only)"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        log_info "Starting Full Stack Development..."
        if [ "$USE_LOCAL_SUPABASE" = true ]; then
            # Generate initial types from local Supabase
            log_info "Generating types from local database..."
            npm run types:local || log_warning "Type generation failed - continuing anyway"

            # Start all services
            concurrently -n "NEXT,TYPES,FUNCS" -c "blue,green,yellow" \
                "npm run dev" \
                "npm run types:watch" \
                "supabase functions serve --env-file .env.local"
        else
            concurrently -n "NEXT,TYPES" -c "blue,green" \
                "npm run dev" \
                "npm run types:watch"
        fi
        ;;
    2)
        log_info "Starting Frontend Development..."
        concurrently -n "NEXT,TYPES" -c "blue,green" \
            "npm run dev" \
            "npm run types:watch"
        ;;
    3)
        log_info "Starting Database Development..."
        if [ "$USE_LOCAL_SUPABASE" = true ]; then
            log_success "Supabase Studio available at: http://localhost:54323"
            log_success "Database URL: postgresql://postgres:postgres@localhost:54322/postgres"
            log_info "Watching for migrations..."
            fswatch -o supabase/migrations/ | xargs -n1 -I{} sh -c 'echo "Migration changed, consider running: supabase migration up"'
        else
            log_error "Local Supabase not available"
            exit 1
        fi
        ;;
    4)
        log_info "Starting Functions Development..."
        if [ "$USE_LOCAL_SUPABASE" = true ]; then
            concurrently -n "NEXT,FUNCS" -c "blue,yellow" \
                "npm run dev" \
                "supabase functions serve --env-file .env.local --debug"
        else
            log_error "Functions require local Supabase"
            exit 1
        fi
        ;;
    5)
        log_info "Starting Quick Development..."
        npm run dev
        ;;
    *)
        log_error "Invalid choice"
        exit 1
        ;;
esac

log_success "Development workflow started!"
log_info "Press Ctrl+C to stop all services"
