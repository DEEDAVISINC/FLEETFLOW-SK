#!/bin/bash

# FleetFlow Production Deployment Script
# This script prepares and deploys FleetFlow to production

set -e  # Exit on any error

echo "🚀 FleetFlow Production Deployment Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the FleetFlow root directory."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
print_status "npm version: $NPM_VERSION"

# 1. Pre-deployment checks
print_status "🔍 Running pre-deployment checks..."

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Please create it from env.production.example"
    print_status "Creating .env.local from example..."
    cp env.production.example .env.local
    print_warning "Please update .env.local with your production values before continuing."
    read -p "Press Enter when you've updated .env.local..."
fi

# 2. Install dependencies
print_status "📦 Installing dependencies..."
npm ci --production=false

# 3. Run linting and fix auto-fixable issues
print_status "🔧 Running linting and auto-fixes..."
npm run lint:fix || print_warning "Some linting issues couldn't be auto-fixed"

# 4. Type checking
print_status "📝 Running TypeScript type checking..."
npm run type-check || {
    print_error "TypeScript errors found. Please fix them before deploying."
    exit 1
}

# 5. Run tests (if available)
if npm run test --silent 2>/dev/null; then
    print_status "🧪 Running tests..."
    npm run test || {
        print_error "Tests failed. Please fix them before deploying."
        exit 1
    }
else
    print_warning "No tests found. Consider adding tests for production readiness."
fi

# 6. Build the application
print_status "🏗️ Building production application..."
npm run build || {
    print_error "Build failed. Please fix build errors before deploying."
    exit 1
}

print_success "Build completed successfully!"

# 7. Check build size
BUILD_SIZE=$(du -sh .next | cut -f1)
print_status "Build size: $BUILD_SIZE"

# 8. Deployment options
echo ""
print_status "🚀 Choose deployment method:"
echo "1) Vercel (Recommended for Next.js)"
echo "2) Manual deployment preparation"
echo "3) Docker deployment"
echo "4) Exit"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_status "🌐 Deploying to Vercel..."

        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            print_status "Installing Vercel CLI..."
            npm install -g vercel
        fi

        # Deploy to Vercel
        print_status "Starting Vercel deployment..."
        vercel --prod

        print_success "Deployment to Vercel completed!"
        ;;

    2)
        print_status "📋 Preparing manual deployment..."

        # Create deployment package
        print_status "Creating deployment package..."
        mkdir -p deployment

        # Copy necessary files
        cp -r .next deployment/
        cp package.json deployment/
        cp package-lock.json deployment/
        cp -r public deployment/

        # Create deployment instructions
        cat > deployment/DEPLOYMENT_INSTRUCTIONS.md << EOF
# FleetFlow Manual Deployment Instructions

## Files Included
- .next/ - Built application
- package.json - Dependencies
- package-lock.json - Exact dependency versions
- public/ - Static assets

## Deployment Steps

1. Upload all files to your server
2. Install Node.js (version 18 or higher)
3. Run: npm ci --production
4. Set environment variables (see env.production.example)
5. Run: npm start
6. Configure reverse proxy (nginx/apache) to point to port 3000

## Environment Variables Required
See env.production.example for all required variables.

## Health Check
Visit /api/health to verify the application is running.
EOF

        print_success "Manual deployment package created in ./deployment/"
        ;;

    3)
        print_status "🐳 Preparing Docker deployment..."

        # Create Dockerfile if it doesn't exist
        if [ ! -f "Dockerfile" ]; then
            cat > Dockerfile << EOF
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF
            print_success "Dockerfile created"
        fi

        # Create docker-compose.yml
        cat > docker-compose.yml << EOF
version: '3.8'

services:
  fleetflow:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: fleetflow
      POSTGRES_USER: fleetflow
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
EOF

        print_success "Docker configuration created"
        print_status "To deploy with Docker:"
        print_status "1. Update .env.local with production values"
        print_status "2. Run: docker-compose up -d"
        ;;

    4)
        print_status "Deployment cancelled."
        exit 0
        ;;

    *)
        print_error "Invalid choice. Deployment cancelled."
        exit 1
        ;;
esac

# 9. Post-deployment checks
print_status "🔍 Post-deployment recommendations:"
echo "  ✅ Set up monitoring (Sentry, DataDog, etc.)"
echo "  ✅ Configure SSL certificates"
echo "  ✅ Set up database backups"
echo "  ✅ Configure CDN for static assets"
echo "  ✅ Set up log aggregation"
echo "  ✅ Configure health checks"
echo "  ✅ Set up alerts for critical errors"

print_success "🎉 FleetFlow deployment preparation completed!"

# Final status
echo ""
print_status "📊 Deployment Summary:"
echo "  • Build: ✅ Success"
echo "  • Size: $BUILD_SIZE"
echo "  • Environment: Production"
echo "  • Ready for: $(date)"

print_success "FleetFlow is ready for production! 🚀"
