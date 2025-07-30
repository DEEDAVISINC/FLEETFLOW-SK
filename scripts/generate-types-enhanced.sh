#!/bin/bash

# FleetFlow Enhanced Type Generation with Hot Reloading
# Supports local, remote, and hot reloading development

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

# Default values
ENVIRONMENT=${1:-"local"}
WATCH_MODE=${2:-"false"}

echo "🔄 FleetFlow Enhanced Type Generation"
echo "===================================="

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    log_error "Supabase CLI not found. Install with: npm install -g supabase@latest"
    exit 1
fi

# Create types directory if it doesn't exist
mkdir -p lib/types

# Function to generate types
generate_types() {
    local env=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    log_info "[$timestamp] Generating types for environment: $env"

    case $env in
        "local")
            # Check if Supabase is running locally
            if ! supabase status 2>/dev/null | grep -q "API URL"; then
                log_warning "Local Supabase not running. Starting it..."
                supabase start || {
                    log_error "Failed to start Supabase locally"
                    return 1
                }
            fi

            # Generate types from local instance
            OUTPUT_FILE="lib/types/supabase-local.ts"
            supabase gen types typescript --local > "$OUTPUT_FILE"
            ;;

        "development"|"dev")
            if [ -z "$NEXT_PUBLIC_SUPABASE_URL_DEV" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY_DEV" ]; then
                log_error "Missing development environment variables"
                log_info "Required: NEXT_PUBLIC_SUPABASE_URL_DEV, SUPABASE_SERVICE_ROLE_KEY_DEV"
                return 1
            fi

            OUTPUT_FILE="lib/types/supabase-development.ts"
            PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL_DEV | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')
            supabase gen types typescript --project-id "$PROJECT_ID" --schema public > "$OUTPUT_FILE"
            ;;

        "staging")
            if [ -z "$NEXT_PUBLIC_SUPABASE_URL_STAGING" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY_STAGING" ]; then
                log_error "Missing staging environment variables"
                return 1
            fi

            OUTPUT_FILE="lib/types/supabase-staging.ts"
            PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL_STAGING | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')
            supabase gen types typescript --project-id "$PROJECT_ID" --schema public > "$OUTPUT_FILE"
            ;;

        "production"|"prod")
            if [ -z "$NEXT_PUBLIC_SUPABASE_URL_PROD" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY_PROD" ]; then
                log_error "Missing production environment variables"
                return 1
            fi

            OUTPUT_FILE="lib/types/supabase-production.ts"
            PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL_PROD | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')
            supabase gen types typescript --project-id "$PROJECT_ID" --schema public > "$OUTPUT_FILE"
            ;;

        *)
            log_error "Invalid environment. Use: local, development, staging, or production"
            return 1
            ;;
    esac

    if [ $? -eq 0 ] && [ -f "$OUTPUT_FILE" ]; then
        # Add header comment
        TEMP_FILE=$(mktemp)
        cat > "$TEMP_FILE" << EOF
// FleetFlow Supabase Types - $env Environment
// Generated on: $timestamp
// DO NOT EDIT MANUALLY - This file is auto-generated
//
// To regenerate: npm run types:generate:$env
// For hot reloading: npm run types:watch

EOF
        cat "$OUTPUT_FILE" >> "$TEMP_FILE"
        mv "$TEMP_FILE" "$OUTPUT_FILE"

        log_success "Types generated successfully: $OUTPUT_FILE"

        # Update main index file
        update_index_file

        # Notify Next.js of type changes (if running)
        if pgrep -f "next dev" > /dev/null; then
            log_info "Notifying Next.js of type changes..."
            touch next-env.d.ts
        fi

        return 0
    else
        log_error "Failed to generate types for $env"
        return 1
    fi
}

# Function to update main index file
update_index_file() {
    MAIN_INDEX="lib/types/index.ts"

    cat > "$MAIN_INDEX" << 'EOF'
// FleetFlow Supabase Types - Main Index
// Auto-generated type exports for all environments

// Environment-specific types
export type { Database as DatabaseLocal } from './supabase-local'
export type { Database as DatabaseDev } from './supabase-development'
export type { Database as DatabaseStaging } from './supabase-staging'
export type { Database as DatabaseProd } from './supabase-production'

// Current environment type detection
const getEnvironment = (): 'local' | 'development' | 'staging' | 'production' => {
  if (typeof window === 'undefined') {
    // Server-side detection
    if (process.env.VERCEL_ENV === 'production') return 'production'
    if (process.env.VERCEL_ENV === 'preview') return 'staging'
    if (process.env.NODE_ENV === 'development') return 'development'
    return 'local'
  } else {
    // Client-side detection
    const hostname = window.location.hostname
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) return 'local'
    if (hostname.includes('fleetflow.vercel.app')) return 'production'
    if (hostname.includes('vercel.app')) return 'staging'
    return 'development'
  }
}

// Environment-specific type mapping
type DatabaseTypes = {
  local: import('./supabase-local').Database
  development: import('./supabase-development').Database
  staging: import('./supabase-staging').Database
  production: import('./supabase-production').Database
}

// Current database type based on environment
export type Database = DatabaseTypes[ReturnType<typeof getEnvironment>]

// Utility types for common operations
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
export type Geofence = Tables<'geofences'>

// Insert types for forms
export type UserInsert = TablesInsert<'users'>
export type LoadInsert = TablesInsert<'loads'>
export type DriverInsert = TablesInsert<'drivers'>
export type VehicleInsert = TablesInsert<'vehicles'>
export type CompanyInsert = TablesInsert<'companies'>

// Update types for edit operations
export type UserUpdate = TablesUpdate<'users'>
export type LoadUpdate = TablesUpdate<'loads'>
export type DriverUpdate = TablesUpdate<'drivers'>
export type VehicleUpdate = TablesUpdate<'vehicles'>
export type CompanyUpdate = TablesUpdate<'companies'>

// Real-time payload types
export type RealtimePayload<T = any> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new?: T
  old?: T
  table: string
  schema: string
  commit_timestamp: string
}

// Location types for geospatial data
export type LocationPoint = {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export type GeofencePolygon = {
  type: 'Polygon'
  coordinates: [number, number][]
}

// FleetFlow specific enums (if you have them in your schema)
export type LoadStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'completed' | 'cancelled'
export type DriverStatus = 'available' | 'on_load' | 'off_duty' | 'maintenance'
export type DepartmentCode = 'MGR' | 'DC' | 'BB' | 'DM'
export type UserRole = 'admin' | 'manager' | 'user'

// Utility function exports
export { getEnvironment }
EOF

    log_success "Main index file updated: $MAIN_INDEX"
}

# Function to watch for schema changes
watch_schema_changes() {
    log_info "Starting schema watch mode for environment: $ENVIRONMENT"
    log_info "Watching for changes in supabase/migrations/ and database schema..."
    log_info "Press Ctrl+C to stop watching"

    # Initial generation
    generate_types "$ENVIRONMENT"

    # Watch for migration file changes
    if command -v fswatch &> /dev/null; then
        fswatch -o supabase/migrations/ | while read num; do
            log_info "Migration files changed, regenerating types..."
            generate_types "$ENVIRONMENT"
        done &
    elif command -v inotifywait &> /dev/null; then
        inotifywait -m -r -e create,modify,delete supabase/migrations/ --format '%w%f %e' |
        while read file event; do
            log_info "Migration files changed: $file ($event), regenerating types..."
            generate_types "$ENVIRONMENT"
        done &
    else
        log_warning "File watching not available. Install fswatch (macOS) or inotify-tools (Linux)"
        log_info "Falling back to polling every 30 seconds..."

        while true; do
            sleep 30
            log_info "Checking for schema changes..."
            generate_types "$ENVIRONMENT"
        done &
    fi

    # Keep the script running
    wait
}

# Main execution
if [ "$WATCH_MODE" = "true" ] || [ "$WATCH_MODE" = "watch" ]; then
    watch_schema_changes
else
    generate_types "$ENVIRONMENT"
fi

log_success "Type generation completed for $ENVIRONMENT environment!"

# Show available commands
if [ "$WATCH_MODE" != "true" ]; then
    echo ""
    log_info "Available commands:"
    echo "  npm run types:generate:local     - Generate from local Supabase"
    echo "  npm run types:generate          - Generate from development"
    echo "  npm run types:generate:staging  - Generate from staging"
    echo "  npm run types:generate:prod     - Generate from production"
    echo "  npm run types:watch            - Watch for changes and auto-regenerate"
fi
