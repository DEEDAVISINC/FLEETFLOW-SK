#!/bin/bash

# FleetFlow Supabase Type Generation Script
# Generates TypeScript types for all environments

set -e

echo "🔧 FleetFlow Supabase Type Generation"
echo "===================================="

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

# Environment selection
ENVIRONMENT=${1:-development}

log_info "Generating types for environment: $ENVIRONMENT"

# Environment-specific configuration
case $ENVIRONMENT in
    "production")
        SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL_PROD
        SUPABASE_KEY=$SUPABASE_SERVICE_ROLE_KEY_PROD
        OUTPUT_FILE="lib/types/supabase-production.ts"
        ;;
    "staging")
        SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL_STAGING
        SUPABASE_KEY=$SUPABASE_SERVICE_ROLE_KEY_STAGING
        OUTPUT_FILE="lib/types/supabase-staging.ts"
        ;;
    "development")
        SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL_DEV:-$NEXT_PUBLIC_SUPABASE_URL}
        SUPABASE_KEY=${SUPABASE_SERVICE_ROLE_KEY_DEV:-$SUPABASE_SERVICE_ROLE_KEY}
        OUTPUT_FILE="lib/types/supabase-development.ts"
        ;;
    *)
        log_error "Invalid environment. Use: development, staging, or production"
        exit 1
        ;;
esac

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    log_error "Missing Supabase environment variables for $ENVIRONMENT"
    log_info "Required variables:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL_${ENVIRONMENT^^}"
    echo "  - SUPABASE_SERVICE_ROLE_KEY_${ENVIRONMENT^^}"
    exit 1
fi

# Create types directory if it doesn't exist
mkdir -p lib/types

# Install Supabase CLI if not available
if ! command -v supabase &> /dev/null; then
    log_warning "Supabase CLI not found. Installing..."
    npm install -g supabase@latest
    log_success "Supabase CLI installed"
fi

log_info "Connecting to Supabase project..."

# Generate types using Supabase CLI
supabase gen types typescript \
    --project-id "$(echo $SUPABASE_URL | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')" \
    --schema public \
    > "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    log_success "Types generated successfully: $OUTPUT_FILE"
else
    log_error "Failed to generate types"
    exit 1
fi

# Add header comment to the generated file
TEMP_FILE=$(mktemp)
cat > "$TEMP_FILE" << EOF
// FleetFlow Supabase Types - $ENVIRONMENT Environment
// Generated on: $(date)
// DO NOT EDIT MANUALLY - This file is auto-generated

EOF

cat "$OUTPUT_FILE" >> "$TEMP_FILE"
mv "$TEMP_FILE" "$OUTPUT_FILE"

# Generate main index file that exports all environments
MAIN_TYPES_FILE="lib/types/index.ts"
cat > "$MAIN_TYPES_FILE" << 'EOF'
// FleetFlow Supabase Types - Main Index
// Auto-generated type exports for all environments

export type { Database as DatabaseDev } from './supabase-development'
export type { Database as DatabaseStaging } from './supabase-staging'
export type { Database as DatabaseProd } from './supabase-production'

// Current environment type (based on NODE_ENV and VERCEL_ENV)
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  if (process.env.VERCEL_ENV === 'production') return 'production'
  if (process.env.VERCEL_ENV === 'preview') return 'staging'
  if (process.env.NODE_ENV === 'development') return 'development'
  return 'development'
}

// Environment-specific type imports
type DatabaseTypes = {
  development: import('./supabase-development').Database
  staging: import('./supabase-staging').Database
  production: import('./supabase-production').Database
}

// Current database type based on environment
export type Database = DatabaseTypes[ReturnType<typeof getEnvironment>]

// Utility types for common database operations
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// FleetFlow specific table types
export type User = Tables<'users'>
export type Load = Tables<'loads'>
export type Driver = Tables<'drivers'>
export type Vehicle = Tables<'vehicles'>
export type Company = Tables<'companies'>
export type Notification = Tables<'notifications'>
export type Document = Tables<'documents'>

// Insert types for forms
export type UserInsert = TablesInsert<'users'>
export type LoadInsert = TablesInsert<'loads'>
export type DriverInsert = TablesInsert<'drivers'>
export type VehicleInsert = TablesInsert<'vehicles'>

// Update types for edit operations
export type UserUpdate = TablesUpdate<'users'>
export type LoadUpdate = TablesUpdate<'loads'>
export type DriverUpdate = TablesUpdate<'drivers'>
export type VehicleUpdate = TablesUpdate<'vehicles'>
EOF

log_success "Main types index generated: $MAIN_TYPES_FILE"

# Generate TypeScript configuration for better IntelliSense
TSCONFIG_TYPES="lib/types/tsconfig.json"
cat > "$TSCONFIG_TYPES" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["../../*"],
      "@/types/*": ["./*"]
    }
  },
  "include": ["./**/*"],
  "exclude": ["node_modules"]
}
EOF

log_success "TypeScript configuration generated: $TSCONFIG_TYPES"

# Update package.json scripts if they don't exist
PACKAGE_JSON="package.json"
if [ -f "$PACKAGE_JSON" ]; then
    # Check if type generation scripts already exist
    if ! grep -q "types:generate" "$PACKAGE_JSON"; then
        log_info "Adding type generation scripts to package.json..."

        # Use node to update package.json
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('$PACKAGE_JSON', 'utf8'));

        pkg.scripts = pkg.scripts || {};
        pkg.scripts['types:generate'] = './scripts/generate-types.sh development';
        pkg.scripts['types:generate:all'] = './scripts/generate-types.sh development && ./scripts/generate-types.sh staging && ./scripts/generate-types.sh production';
        pkg.scripts['types:generate:prod'] = './scripts/generate-types.sh production';
        pkg.scripts['types:generate:staging'] = './scripts/generate-types.sh staging';
        pkg.scripts['types:watch'] = 'nodemon --watch supabase/migrations --exec \"npm run types:generate\"';

        fs.writeFileSync('$PACKAGE_JSON', JSON.stringify(pkg, null, 2) + '\n');
        "

        log_success "Type generation scripts added to package.json"
    else
        log_info "Type generation scripts already exist in package.json"
    fi
fi

log_success "🎉 Type generation complete!"
log_info "Next steps:"
echo "  1. Import types: import { Database, Load, User } from '@/lib/types'"
echo "  2. Use with Supabase client for full type safety"
echo "  3. Run 'npm run types:generate:all' to update all environments"
echo "  4. Install nodemon for auto-regeneration: npm install --save-dev nodemon"
