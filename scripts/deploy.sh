#!/bin/bash

# FleetFlow Vercel Deployment Script
# Usage: ./scripts/deploy.sh [preview|production]

set -e

echo "🚀 FleetFlow Vercel Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Deployment type
DEPLOY_TYPE=${1:-preview}

# Helper functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check if Vercel CLI is installed
check_vercel_cli() {
    log_info "Checking Vercel CLI installation..."
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI not found. Installing globally..."
        npm install -g vercel
    fi
    log_success "Vercel CLI is available"
}

# Check if user is logged in to Vercel
check_vercel_auth() {
    log_info "Checking Vercel authentication..."
    if ! vercel whoami &> /dev/null; then
        log_warning "Not logged into Vercel. Please login:"
        vercel login
    fi
    log_success "Authenticated with Vercel"
}

# Run pre-deployment checks
run_pre_checks() {
    log_info "Running pre-deployment checks..."

    # Check Node.js version
    node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        log_error "Node.js version 18+ required. Current: $(node -v)"
        exit 1
    fi

    # Install dependencies
    log_info "Installing dependencies..."
    npm ci

    # Run linting
    log_info "Running ESLint..."
    npm run lint || {
        log_warning "Linting issues found. Continuing with deployment..."
    }

    # Type checking
    log_info "Running TypeScript type check..."
    npm run build:check 2>/dev/null || {
        log_warning "TypeScript issues found. Build may still succeed due to ignoreBuildErrors..."
    }

    # Test build locally
    log_info "Testing build locally..."
    npm run build

    log_success "Pre-deployment checks completed"
}

# Check environment variables
check_env_vars() {
    log_info "Checking essential environment variables..."

    required_vars=()
    missing_vars=()

    if [ "$DEPLOY_TYPE" = "production" ]; then
        required_vars=(
            "NEXT_PUBLIC_SUPABASE_URL"
            "NEXT_PUBLIC_SUPABASE_ANON_KEY"
            "ANTHROPIC_API_KEY"
        )
    fi

    for var in "${required_vars[@]}"; do
        if ! vercel env ls | grep -q "$var"; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -gt 0 ]; then
        log_warning "Missing environment variables in Vercel:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        log_warning "Please add these variables in Vercel dashboard before deployment"

        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        log_success "Environment variables check passed"
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    log_info "Starting deployment to Vercel..."

    if [ "$DEPLOY_TYPE" = "production" ]; then
        log_warning "🚨 Deploying to PRODUCTION 🚨"
        read -p "Are you sure? This will deploy to your live domain (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled"
            exit 0
        fi

        log_info "Deploying to production..."
        vercel --prod
    else
        log_info "Deploying preview version..."
        vercel
    fi
}

# Post-deployment checks
run_post_checks() {
    log_info "Running post-deployment checks..."

    # Get deployment URL from last deployment
    DEPLOYMENT_URL=$(vercel ls --limit=1 --scope=$(vercel whoami) 2>/dev/null | tail -n 1 | awk '{print $2}' || echo "")

    if [ -n "$DEPLOYMENT_URL" ]; then
        log_info "Deployment URL: $DEPLOYMENT_URL"

        # Check if deployment is live
        log_info "Checking if deployment is accessible..."
        if curl -s --head "$DEPLOYMENT_URL" | head -n 1 | grep -q "200 OK"; then
            log_success "Deployment is live and accessible!"
        else
            log_warning "Deployment may still be initializing..."
        fi

        # Open in browser (optional)
        read -p "Open deployment in browser? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if command -v open >/dev/null; then
                open "$DEPLOYMENT_URL"
            elif command -v xdg-open >/dev/null; then
                xdg-open "$DEPLOYMENT_URL"
            else
                log_info "Please manually open: $DEPLOYMENT_URL"
            fi
        fi
    fi
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    # Clean up any temporary files if needed
}

# Main execution
main() {
    trap cleanup EXIT

    log_info "Deployment type: $DEPLOY_TYPE"

    check_vercel_cli
    check_vercel_auth
    run_pre_checks
    check_env_vars
    deploy_to_vercel
    run_post_checks

    log_success "🎉 FleetFlow deployment completed successfully!"
    log_info "Check your Vercel dashboard for detailed logs and metrics"
}

# Help text
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "FleetFlow Vercel Deployment Script"
    echo ""
    echo "Usage: ./scripts/deploy.sh [DEPLOYMENT_TYPE]"
    echo ""
    echo "DEPLOYMENT_TYPE:"
    echo "  preview     Deploy a preview version (default)"
    echo "  production  Deploy to production"
    echo ""
    echo "Examples:"
    echo "  ./scripts/deploy.sh preview     # Deploy preview"
    echo "  ./scripts/deploy.sh production  # Deploy to production"
    echo "  ./scripts/deploy.sh --help      # Show this help"
    exit 0
fi

# Run main function
main
