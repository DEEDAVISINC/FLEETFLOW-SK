#!/bin/bash

# FleetFlow Database Migration Manager
# Handles schema changes, migrations, and deployment workflow

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

echo "🗄️ FleetFlow Migration Manager"
echo "==============================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    log_error "Supabase CLI not found. Install with: npm install -g supabase@latest"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    log_error "No Supabase project found. Run 'supabase init' first."
    exit 1
fi

# Main menu
echo ""
log_info "Migration Options:"
echo "1. Create New Migration"
echo "2. Generate Migration from Schema Diff"
echo "3. Apply Migrations (Local)"
echo "4. Reset Local Database"
echo "5. Seed Database"
echo "6. Deploy to Production"
echo "7. Pull Remote Schema"
echo "8. Migration Status"
echo "9. FleetFlow Schema Setup"

read -p "Enter your choice (1-9): " choice

case $choice in
    1)
        echo ""
        read -p "Enter migration name: " migration_name
        if [ -z "$migration_name" ]; then
            log_error "Migration name cannot be empty"
            exit 1
        fi

        log_info "Creating new migration: $migration_name"
        supabase migration new "$migration_name"
        log_success "Migration created successfully"
        ;;

    2)
        echo ""
        log_info "Generating migration from schema differences..."
        log_warning "This will compare your local database with the baseline schema"

        # Generate timestamp for migration file
        timestamp=$(date +"%Y%m%d%H%M%S")
        migration_file="supabase/migrations/${timestamp}_schema_diff.sql"

        # Create schema diff
        supabase db diff --schema public,storage --use-migra > "$migration_file"

        if [ -s "$migration_file" ]; then
            log_success "Schema diff generated: $migration_file"
            echo ""
            log_info "Preview of changes:"
            head -20 "$migration_file"
            echo ""
            read -p "Apply this migration? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                supabase migration up
                log_success "Migration applied successfully"
            fi
        else
            log_info "No schema changes detected"
            rm "$migration_file"
        fi
        ;;

    3)
        echo ""
        log_info "Applying pending migrations to local database..."
        supabase migration up

        # Generate types after migration
        log_info "Updating TypeScript types..."
        npm run types:local || log_warning "Type generation failed"
        log_success "Migrations applied successfully"
        ;;

    4)
        echo ""
        log_warning "This will reset your local database and lose all data!"
        read -p "Are you sure? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Resetting local database..."
            supabase db reset
            log_success "Database reset completed"
        fi
        ;;

    5)
        echo ""
        log_info "Seeding database with FleetFlow sample data..."

        # Check if seed file exists
        if [ ! -f "supabase/seed.sql" ]; then
            log_info "Creating FleetFlow seed file..."
            cat > supabase/seed.sql << 'EOF'
-- FleetFlow Sample Data
-- This file seeds the database with sample companies, users, loads, etc.

-- Insert sample companies
INSERT INTO companies (id, name, dot_number, mc_number) VALUES
  ('c1e1f1a1-1111-1111-1111-111111111111', 'FleetFlow Logistics', 'DOT123456', 'MC789012'),
  ('c2e2f2a2-2222-2222-2222-222222222222', 'Rapid Transport Inc', 'DOT234567', 'MC890123')
ON CONFLICT (id) DO NOTHING;

-- Insert sample users
INSERT INTO users (id, email, full_name, department_code, company_id, role) VALUES
  ('u1e1r1-1111-1111-1111-111111111111', 'admin@fleetflow.com', 'Fleet Admin', 'MGR', 'c1e1f1a1-1111-1111-1111-111111111111', 'admin'),
  ('u2e2r2-2222-2222-2222-222222222222', 'dispatcher@fleetflow.com', 'John Dispatcher', 'DC', 'c1e1f1a1-1111-1111-1111-111111111111', 'user'),
  ('u3e3r3-3333-3333-3333-333333333333', 'broker@fleetflow.com', 'Sarah Broker', 'BB', 'c1e1f1a1-1111-1111-1111-111111111111', 'user')
ON CONFLICT (id) DO NOTHING;

-- Insert sample drivers
INSERT INTO drivers (id, name, email, phone, license_number, company_id, user_id) VALUES
  ('d1r1v1-1111-1111-1111-111111111111', 'Mike Driver', 'mike@fleetflow.com', '+1234567890', 'CDL123456', 'c1e1f1a1-1111-1111-1111-111111111111', NULL),
  ('d2r2v2-2222-2222-2222-222222222222', 'Lisa Trucker', 'lisa@fleetflow.com', '+1234567891', 'CDL234567', 'c1e1f1a1-1111-1111-1111-111111111111', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample loads
INSERT INTO loads (id, load_number, company_id, broker_id, status, pickup_address, delivery_address, rate) VALUES
  ('l1o1d1-1111-1111-1111-111111111111', 'FL-SB-24001', 'c1e1f1a1-1111-1111-1111-111111111111', 'u3e3r3-3333-3333-3333-333333333333', 'active', 'Los Angeles, CA', 'Phoenix, AZ', 2500.00),
  ('l2o2d2-2222-2222-2222-222222222222', 'FL-SB-24002', 'c1e1f1a1-1111-1111-1111-111111111111', 'u3e3r3-3333-3333-3333-333333333333', 'pending', 'Dallas, TX', 'Denver, CO', 1800.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
  ('u1e1r1-1111-1111-1111-111111111111', 'Welcome to FleetFlow', 'Your FleetFlow TMS is ready to use!', 'system'),
  ('u2e2r2-2222-2222-2222-222222222222', 'New Load Assignment', 'Load FL-SB-24001 needs dispatch assignment', 'load_update')
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'FleetFlow sample data seeded successfully!' as message;
EOF
            log_success "Seed file created"
        fi

        supabase db seed
        log_success "Database seeded successfully"
        ;;

    6)
        echo ""
        log_warning "This will deploy migrations to PRODUCTION!"
        log_info "Make sure you have:"
        echo "  1. Tested all migrations locally"
        echo "  2. Backed up production database"
        echo "  3. Proper environment variables set"
        echo ""
        read -p "Deploy to production? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deploying migrations to production..."
            supabase db push --dry-run
            echo ""
            read -p "Execute deployment? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                supabase db push
                log_success "Production deployment completed"

                # Update production types
                log_info "Updating production types..."
                npm run types:generate:prod || log_warning "Production type generation failed"
            fi
        fi
        ;;

    7)
        echo ""
        log_info "Pulling remote schema to local..."
        supabase db pull
        log_success "Schema pulled successfully"

        # Generate types after pull
        log_info "Updating local types..."
        npm run types:local || log_warning "Type generation failed"
        ;;

    8)
        echo ""
        log_info "Migration Status:"
        echo "=================="

        # Show migration history
        supabase migration list

        echo ""
        log_info "Local Database Status:"
        supabase status
        ;;

    9)
        echo ""
        log_info "Setting up FleetFlow database schema..."

        # Create FleetFlow-specific migration
        timestamp=$(date +"%Y%m%d%H%M%S")
        schema_file="supabase/migrations/${timestamp}_fleetflow_schema.sql"

        cat > "$schema_file" << 'EOF'
-- FleetFlow TMS Database Schema
-- Core tables for transportation management

-- Enable PostGIS extension for geospatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  dot_number TEXT UNIQUE,
  mc_number TEXT UNIQUE,
  address JSONB,
  phone TEXT,
  email TEXT,
  website TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  department_code TEXT NOT NULL CHECK (department_code IN ('MGR', 'DC', 'BB', 'DM')),
  company_id UUID REFERENCES companies(id),
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  permissions JSONB DEFAULT '{}',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  license_number TEXT UNIQUE,
  license_expiry DATE,
  current_location GEOGRAPHY(POINT),
  location_accuracy NUMERIC,
  current_speed NUMERIC,
  current_heading NUMERIC,
  location_updated_at TIMESTAMP WITH TIME ZONE,
  current_load_id UUID,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'on_load', 'off_duty', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  vehicle_number TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year INTEGER,
  vin TEXT UNIQUE,
  license_plate TEXT,
  assigned_driver_id UUID REFERENCES drivers(id),
  current_mileage INTEGER,
  next_maintenance_date DATE,
  maintenance_status TEXT DEFAULT 'active' CHECK (maintenance_status IN ('active', 'in_maintenance', 'out_of_service')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loads table
CREATE TABLE IF NOT EXISTS loads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  load_number TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES companies(id) NOT NULL,
  broker_id UUID REFERENCES users(id),
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'completed', 'cancelled')),
  pickup_address TEXT,
  delivery_address TEXT,
  pickup_location GEOGRAPHY(POINT),
  delivery_location GEOGRAPHY(POINT),
  current_location GEOGRAPHY(POINT),
  location_updated_at TIMESTAMP WITH TIME ZONE,
  pickup_date TIMESTAMP WITH TIME ZONE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  rate DECIMAL(10,2),
  miles INTEGER,
  weight INTEGER,
  commodity TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success', 'load_update', 'driver_notification', 'system')),
  read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  load_id UUID REFERENCES loads(id),
  filename TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  file_url TEXT,
  category TEXT CHECK (category IN ('bol', 'invoice', 'receipt', 'permit', 'insurance', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geofences table for location-based alerts
CREATE TABLE IF NOT EXISTS geofences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  name TEXT NOT NULL,
  geometry GEOGRAPHY(POLYGON) NOT NULL,
  type TEXT CHECK (type IN ('pickup', 'delivery', 'facility', 'restricted')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geofence events table
CREATE TABLE IF NOT EXISTS geofence_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES drivers(id) NOT NULL,
  geofence_id UUID REFERENCES geofences(id) NOT NULL,
  event_type TEXT CHECK (event_type IN ('enter', 'exit')) NOT NULL,
  location GEOGRAPHY(POINT),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_code);
CREATE INDEX IF NOT EXISTS idx_drivers_company_id ON drivers(company_id);
CREATE INDEX IF NOT EXISTS idx_drivers_location ON drivers USING GIST(current_location);
CREATE INDEX IF NOT EXISTS idx_loads_company_id ON loads(company_id);
CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status);
CREATE INDEX IF NOT EXISTS idx_loads_broker ON loads(broker_id);
CREATE INDEX IF NOT EXISTS idx_loads_driver ON loads(driver_id);
CREATE INDEX IF NOT EXISTS idx_loads_pickup_location ON loads USING GIST(pickup_location);
CREATE INDEX IF NOT EXISTS idx_loads_delivery_location ON loads USING GIST(delivery_location);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_company_id ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_load_id ON documents(load_id);
CREATE INDEX IF NOT EXISTS idx_geofences_geometry ON geofences USING GIST(geometry);

-- Add foreign key for driver's current load
ALTER TABLE drivers ADD CONSTRAINT fk_drivers_current_load
  FOREIGN KEY (current_load_id) REFERENCES loads(id);

-- Create PostGIS helper functions
CREATE OR REPLACE FUNCTION st_distance_sphere(geom1 geography, geom2 geography)
RETURNS numeric AS $$
  SELECT ST_Distance(geom1, geom2);
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION st_within(geom1 geography, geom2 geography)
RETURNS boolean AS $$
  SELECT ST_Within(geom1::geometry, geom2::geometry);
$$ LANGUAGE sql;

-- Success message
SELECT 'FleetFlow schema created successfully!' as message;
EOF

        log_success "FleetFlow schema migration created: $schema_file"
        echo ""
        read -p "Apply FleetFlow schema? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            supabase migration up
            log_success "FleetFlow schema applied successfully"

            # Generate types
            log_info "Generating TypeScript types..."
            npm run types:local || log_warning "Type generation failed"
        fi
        ;;

    *)
        log_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
log_success "Migration operation completed!"
