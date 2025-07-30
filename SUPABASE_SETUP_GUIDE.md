# 🗄️ FleetFlow Supabase Configuration Guide

## 🎯 Overview

This guide covers setting up Supabase for FleetFlow with proper security (RLS), real-time features,
and environment separation.

## 🏗️ Project Structure Setup

### 1. Create Environment-Specific Projects

Create **three separate Supabase projects**:

#### Production Project

```
Name: fleetflow-production
URL: https://fleetflow-prod.supabase.co
Purpose: Live production data
```

#### Staging Project

```
Name: fleetflow-staging
URL: https://fleetflow-staging.supabase.co
Purpose: Preview deployments and testing
```

#### Development Project

```
Name: fleetflow-development
URL: https://fleetflow-dev.supabase.co
Purpose: Local development
```

### 2. Environment Variable Mapping

| Environment         | Supabase Project        | Vercel Environment    |
| ------------------- | ----------------------- | --------------------- |
| Local Development   | `fleetflow-development` | `.env.local`          |
| Preview Deployments | `fleetflow-staging`     | Vercel Preview Env    |
| Production          | `fleetflow-production`  | Vercel Production Env |

## 🔐 Row Level Security (RLS) Setup

### 1. Enable RLS on All Tables

```sql
-- Enable RLS on core FleetFlow tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### 2. User-Based Access Policies

```sql
-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Company-based access for loads
CREATE POLICY "Users can view company loads" ON loads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = loads.company_id
        )
    );

-- Department-based permissions
CREATE POLICY "Dispatchers can manage loads" ON loads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.department_code IN ('DC', 'MGR')
        )
    );

-- Broker access to their own loads
CREATE POLICY "Brokers can access assigned loads" ON loads
    FOR ALL USING (
        broker_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.department_code IN ('BB', 'MGR')
        )
    );
```

### 3. Administrative Override Policies

```sql
-- Managers have full access
CREATE POLICY "Managers have full access" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.department_code = 'MGR'
        )
    );

-- Service role bypass for system operations
CREATE POLICY "Service role bypass" ON users
    FOR ALL USING (current_setting('role') = 'service_role');
```

## ⚡ Real-Time Features Setup

### 1. Enable Realtime on Tables

```sql
-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE loads;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE shipments;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
```

### 2. Database Webhooks Configuration

#### Webhook for Load Status Changes

```sql
-- Create webhook function for load updates
CREATE OR REPLACE FUNCTION notify_load_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Send webhook to external services
  PERFORM net.http_post(
    'https://fleetflow.vercel.app/api/webhooks/load-status',
    json_build_object(
      'event', 'load.status_changed',
      'load_id', NEW.id,
      'old_status', OLD.status,
      'new_status', NEW.status,
      'timestamp', NOW()
    )::text,
    'application/json'
  );

  -- Create notification for relevant users
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    related_id,
    created_at
  )
  SELECT
    u.id,
    'Load Status Updated',
    'Load #' || NEW.load_number || ' status changed to ' || NEW.status,
    'load_update',
    NEW.id,
    NOW()
  FROM users u
  WHERE u.company_id = NEW.company_id
    AND u.department_code IN ('DC', 'BB', 'MGR');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_load_status_change
  AFTER UPDATE OF status ON loads
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_load_status_change();
```

#### Webhook for Driver Location Updates

```sql
-- Create function for driver location webhooks
CREATE OR REPLACE FUNCTION notify_driver_location_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send if location changed significantly (>1 mile)
  IF ST_Distance(OLD.current_location, NEW.current_location) > 1609 THEN
    PERFORM net.http_post(
      'https://fleetflow.vercel.app/api/webhooks/driver-location',
      json_build_object(
        'event', 'driver.location_updated',
        'driver_id', NEW.id,
        'location', ST_AsGeoJSON(NEW.current_location)::json,
        'timestamp', NOW()
      )::text,
      'application/json'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_driver_location_update
  AFTER UPDATE OF current_location ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION notify_driver_location_update();
```

### 3. Real-Time Client Setup

```typescript
// lib/supabase-realtime.ts
import { supabase } from './supabase'

export const subscribeToLoadUpdates = (companyId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`loads:company_id=eq.${companyId}`)
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'loads' },
      callback
    )
    .subscribe()
}

export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`notifications:user_id=eq.${userId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications' },
      callback
    )
    .subscribe()
}
```

## 🌐 CORS Configuration

### 1. Supabase Dashboard Settings

In each Supabase project dashboard:

1. Go to **Settings → API**
2. Scroll to **CORS Origins**
3. Add these origins:

#### Development Project

```
http://localhost:3000
http://localhost:3001
http://192.168.*.*:3000
http://192.168.*.*:3001
```

#### Staging Project

```
https://*.vercel.app
https://fleetflow-git-*.vercel.app
https://fleetflow-staging.vercel.app
```

#### Production Project

```
https://fleetflow.vercel.app
https://fleetflow.com
https://www.fleetflow.com
```

### 2. Dynamic CORS for Preview Deployments

```typescript
// lib/supabase-cors.ts
export const getAllowedOrigins = () => {
  const baseOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://fleetflow.vercel.app'
  ]

  // Add Vercel preview URLs
  if (process.env.VERCEL_URL) {
    baseOrigins.push(`https://${process.env.VERCEL_URL}`)
  }

  if (process.env.VERCEL_BRANCH_URL) {
    baseOrigins.push(`https://${process.env.VERCEL_BRANCH_URL}`)
  }

  return baseOrigins
}
```

## 🔧 Database Schema Setup

### 1. Core FleetFlow Tables

```sql
-- Users table with RLS
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  department_code TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  role TEXT DEFAULT 'user',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  dot_number TEXT,
  mc_number TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loads table with geolocation
CREATE TABLE loads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  load_number TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES companies(id),
  broker_id UUID REFERENCES users(id),
  driver_id UUID REFERENCES drivers(id),
  status TEXT DEFAULT 'pending',
  pickup_location GEOGRAPHY(POINT),
  delivery_location GEOGRAPHY(POINT),
  rate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_department ON users(department_code);
CREATE INDEX idx_loads_company_id ON loads(company_id);
CREATE INDEX idx_loads_status ON loads(status);
CREATE INDEX idx_loads_pickup_location ON loads USING GIST(pickup_location);
CREATE INDEX idx_loads_delivery_location ON loads USING GIST(delivery_location);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

## 📊 Environment-Specific Configurations

### 1. Development Environment

```sql
-- Looser policies for development
CREATE POLICY "Dev: Allow all for authenticated users" ON users
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO companies (name, dot_number) VALUES
    ('FleetFlow Demo Company', 'DOT123456'),
    ('Test Logistics Inc', 'DOT789012');
```

### 2. Production Environment

```sql
-- Strict policies for production
CREATE POLICY "Prod: Users access own company only" ON users
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Enable audit logging
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔗 Integration Setup

### 1. NextJS Integration

```typescript
// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const getSupabaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_SUPABASE_URL_DEV
  }
  if (process.env.VERCEL_ENV === 'preview') {
    return process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL_PROD
}

const getSupabaseKey = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV
  }
  if (process.env.VERCEL_ENV === 'preview') {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING
  }
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD
}

export const supabase = createClientComponentClient({
  supabaseUrl: getSupabaseUrl(),
  supabaseKey: getSupabaseKey(),
})
```

### 2. Environment Variables

```env
# Development
NEXT_PUBLIC_SUPABASE_URL_DEV=https://fleetflow-dev.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY_DEV=your-dev-service-key

# Staging
NEXT_PUBLIC_SUPABASE_URL_STAGING=https://fleetflow-staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY_STAGING=your-staging-service-key

# Production
NEXT_PUBLIC_SUPABASE_URL_PROD=https://fleetflow-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY_PROD=your-prod-service-key
```

## 🛡️ Security Best Practices

### 1. Service Role Usage

```typescript
// lib/supabase-admin.ts - Server-side only
import { createClient } from '@supabase/supabase-js'

const getAdminClient = () => {
  const url = getSupabaseUrl()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return createClient(url, serviceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Use only in API routes
export const supabaseAdmin = getAdminClient()
```

### 2. RLS Testing

```sql
-- Test RLS policies
SET ROLE authenticated;
SET session_replication_role = 'origin';

-- Test as different user types
SELECT set_config('request.jwt.claims', '{"sub":"user-id","role":"authenticated"}', true);

-- Verify access
SELECT * FROM users; -- Should only return authorized records
```

## 📋 Setup Checklist

### For Each Environment:

#### Database Setup

- [ ] Create Supabase project
- [ ] Enable PostGIS extension
- [ ] Run schema SQL scripts
- [ ] Enable RLS on all tables
- [ ] Create access policies
- [ ] Set up indexes
- [ ] Configure realtime

#### Security Configuration

- [ ] Configure CORS origins
- [ ] Set up authentication policies
- [ ] Test RLS policies
- [ ] Configure service role permissions

#### Integration

- [ ] Add environment variables to Vercel
- [ ] Test database connections
- [ ] Verify real-time subscriptions
- [ ] Test webhook endpoints

#### Monitoring

- [ ] Enable database logs
- [ ] Set up performance monitoring
- [ ] Configure backup schedules
- [ ] Test disaster recovery

---

## 🆘 Troubleshooting

### Common Issues

**RLS Blocking Access:**

```sql
-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Temporarily disable RLS for debugging
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

**Realtime Not Working:**

```sql
-- Check realtime publication
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Re-add table to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE your_table;
```

**CORS Issues:**

- Verify all preview URLs are in CORS settings
- Check environment variable mapping
- Test with browser developer tools

Your FleetFlow Supabase setup is now enterprise-ready with proper security, real-time features, and
environment separation! 🚀
