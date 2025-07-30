# 🚀 FleetFlow Supabase Workflow Integration

## 🎯 Overview

Complete workflow integration for FleetFlow with Supabase CLI, local development, migrations, hot
reloading, Edge Functions, and multi-environment support.

## ✅ **What's Been Configured**

### **1. Supabase Local Development**

- ✅ **Local Supabase instance** with Docker
- ✅ **PostGIS extension** for geospatial data
- ✅ **Connection pooling** for better performance
- ✅ **Email testing** with Inbucket
- ✅ **Real-time subscriptions** enabled

### **2. Edge Functions**

- ✅ **load-notifications** - Handle load status notifications
- ✅ **driver-location-updates** - Process real-time location updates
- ✅ **CORS configuration** - Shared across functions
- ✅ **Authentication** - JWT verification where needed

### **3. Migration Management**

- ✅ **Schema versioning** - Track all database changes
- ✅ **Automatic migration generation** from schema diffs
- ✅ **Production deployment** workflow
- ✅ **Database seeding** with FleetFlow sample data

### **4. Hot Reloading & Type Generation**

- ✅ **Multi-environment types** - local/dev/staging/prod
- ✅ **Automatic regeneration** when schema changes
- ✅ **File watching** with fswatch/inotify
- ✅ **Next.js integration** - Notifies dev server of changes

## 🛠️ **Available Commands**

### **Development Workflow**

```bash
# Full stack development (recommended)
npm run dev:hot                 # Interactive workflow selector

# Specific workflows
npm run dev:full                # Next.js + Supabase + Functions + Types
npm run dev:local               # Next.js + Local Supabase + Type watching
npm run dev:db                  # Next.js + Supabase only
npm run dev:types               # Next.js + Type watching only
```

### **Supabase Management**

```bash
# Local Supabase control
npm run supabase:start          # Start local Supabase
npm run supabase:stop           # Stop local Supabase
npm run supabase:restart        # Restart local Supabase
npm run supabase:reset          # Reset local database
npm run supabase:status         # Check status

# Database operations
npm run db:setup                # Interactive database setup
npm run migrate                 # Interactive migration manager
```

### **Type Generation**

```bash
# Environment-specific type generation
npm run types:generate:local    # From local Supabase
npm run types:generate          # From development environment
npm run types:generate:staging  # From staging environment
npm run types:generate:prod     # From production environment

# Hot reloading
npm run types:watch             # Watch for schema changes
```

### **Edge Functions**

```bash
# Function development
npm run functions:serve         # Serve functions locally
npm run functions:deploy        # Deploy functions to Supabase
npm run functions:logs          # View function logs
```

## 🏗️ **Project Structure**

```
FLEETFLOW/
├── supabase/
│   ├── config.toml             # Supabase configuration
│   ├── migrations/             # Database migrations
│   │   └── 20240121000000_fleetflow_schema.sql
│   ├── seed.sql               # Sample data
│   └── functions/             # Edge Functions
│       ├── _shared/
│       │   └── cors.ts        # Shared CORS configuration
│       ├── load-notifications/
│       │   └── index.ts       # Load notification handler
│       └── driver-location-updates/
│           └── index.ts       # Location update processor
├── lib/types/
│   ├── index.ts              # Main type exports
│   ├── supabase-local.ts     # Local environment types
│   ├── supabase-development.ts
│   ├── supabase-staging.ts
│   └── supabase-production.ts
└── scripts/
    ├── dev-workflow.sh       # Interactive development workflow
    ├── migration-manager.sh  # Database migration manager
    └── generate-types-enhanced.sh # Enhanced type generation
```

## 🚀 **Quick Start Guide**

### **1. First Time Setup**

```bash
# Install Supabase CLI globally
npm install -g supabase@latest

# Install Docker Desktop (required for local Supabase)
# Download from: https://www.docker.com/products/docker-desktop

# Start interactive setup
npm run dev:hot
```

### **2. Daily Development Workflow**

```bash
# Start full development environment
npm run dev:hot

# Select option 1: "Full Stack Development"
# This starts:
# - Local Supabase instance
# - Edge Functions server
# - Type generation with hot reloading
# - Next.js development server
```

### **3. Database Development**

```bash
# Interactive database management
npm run migrate

# Options include:
# - Create new migrations
# - Apply schema changes
# - Seed with sample data
# - Deploy to production
```

## 📊 **Environment Configuration**

### **Local Development (.env.local)**

```bash
# Supabase Local (automatically configured when using supabase start)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-key

# For remote environments (optional)
NEXT_PUBLIC_SUPABASE_URL_DEV=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY_DEV=your-dev-service-key
```

### **Vercel Environment Variables**

```bash
# Production
NEXT_PUBLIC_SUPABASE_URL_PROD=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY_PROD=your-prod-service-key

# Staging
NEXT_PUBLIC_SUPABASE_URL_STAGING=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY_STAGING=your-staging-service-key
```

## ⚡ **Edge Functions vs Vercel API Routes**

### **When to Use Edge Functions:**

- ✅ **Database-intensive operations** (closer to database)
- ✅ **Real-time processing** (WebSocket connections)
- ✅ **Geospatial operations** (PostGIS functions)
- ✅ **Webhook handling** (external service callbacks)
- ✅ **Cron jobs** (scheduled tasks)

### **When to Use Vercel API Routes:**

- ✅ **External API integrations** (third-party services)
- ✅ **File processing** (image manipulation, PDF generation)
- ✅ **Complex business logic** (multi-step workflows)
- ✅ **Payment processing** (Stripe, PayPal)
- ✅ **Authentication flows** (OAuth, custom auth)

### **FleetFlow Edge Functions**

#### **1. Load Notifications (`/functions/load-notifications`)**

```typescript
// Usage in your Next.js app
const notifyLoadChange = async (loadId: string, eventType: string) => {
  const response = await fetch('/api/edge/load-notifications', {
    method: 'POST',
    body: JSON.stringify({
      load_id: loadId,
      event_type: eventType,
      message: 'Load status updated',
      recipients: ['user-id-1', 'user-id-2']
    })
  });
  return response.json();
};
```

#### **2. Driver Location Updates (`/functions/driver-location-updates`)**

```typescript
// Usage in your mobile app or GPS tracking
const updateDriverLocation = async (driverId: string, lat: number, lng: number) => {
  const response = await fetch('/api/edge/driver-location-updates', {
    method: 'POST',
    body: JSON.stringify({
      driver_id: driverId,
      latitude: lat,
      longitude: lng,
      accuracy: 10,
      speed: 65,
      timestamp: new Date().toISOString()
    })
  });
  return response.json();
};
```

## 🔄 **Hot Reloading Features**

### **Automatic Type Updates**

When you change your database schema:

1. **File watcher** detects migration changes
2. **Types regenerate** automatically
3. **Next.js dev server** gets notified
4. **Browser refreshes** with new types
5. **IntelliSense updates** immediately

### **Database Schema Changes**

```bash
# Make schema changes in Supabase Studio (localhost:54323)
# Types automatically regenerate
# Next.js picks up the changes
# No manual restart needed!
```

## 📋 **Migration Workflow**

### **Development Process**

```bash
# 1. Start local development
npm run dev:local

# 2. Make schema changes in Supabase Studio
# Visit: http://localhost:54323

# 3. Generate migration from changes
npm run migrate
# Select option 2: "Generate Migration from Schema Diff"

# 4. Types automatically update (if types:watch is running)

# 5. Test your changes locally

# 6. Deploy when ready
npm run migrate
# Select option 6: "Deploy to Production"
```

### **Team Collaboration**

```bash
# Pull latest schema from remote
npm run migrate
# Select option 7: "Pull Remote Schema"

# Apply teammate's migrations
npm run migrate
# Select option 3: "Apply Migrations (Local)"

# Generate types after sync
npm run types:generate:local
```

## 🎯 **Type Safety Examples**

### **Database Operations**

```typescript
import { Database, Load, LoadInsert, LoadUpdate } from '@/lib/types'
import { createSupabaseClient } from '@/lib/supabase-config'

const supabase = createSupabaseClient<Database>()

// ✅ Fully typed query
const { data: loads, error } = await supabase
  .from('loads')           // ✅ Table autocomplete
  .select(`
    id,
    load_number,
    status,                // ✅ Column autocomplete
    companies (           // ✅ Relationship autocomplete
      name,
      dot_number
    ),
    drivers (
      name,
      current_location
    )
  `)
  .eq('status', 'active')  // ✅ Type-checked values
  .order('created_at', { ascending: false })

// ✅ Type-safe inserts
const newLoad: LoadInsert = {
  load_number: 'FL-001',
  company_id: 'company-uuid',
  status: 'pending',       // ✅ Enum validation
  pickup_address: 'Los Angeles, CA',
  delivery_address: 'Phoenix, AZ'
}

const { data: insertedLoad } = await supabase
  .from('loads')
  .insert(newLoad)
  .select()
  .single()

// ✅ Type-safe updates
const updates: LoadUpdate = {
  status: 'assigned',      // ✅ Type checked
  driver_id: 'driver-uuid',
  updated_at: new Date().toISOString()
}

await supabase
  .from('loads')
  .update(updates)
  .eq('id', loadId)
```

### **Real-time Subscriptions**

```typescript
import { RealtimePayload, Load } from '@/lib/types'

// ✅ Type-safe real-time subscriptions
const subscription = supabase
  .channel('load-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'loads'
  }, (payload: RealtimePayload<Load>) => {
    // ✅ payload.new and payload.old are fully typed
    console.log('Load updated:', payload.new?.load_number)
    console.log('Old status:', payload.old?.status)
    console.log('New status:', payload.new?.status)
  })
  .subscribe()
```

## 🚨 **Common Issues & Solutions**

### **Docker Issues**

```bash
# Docker not running
brew install --cask docker  # macOS
# Then start Docker Desktop

# Port conflicts
supabase stop
docker system prune  # Clean up
supabase start
```

### **Type Generation Failures**

```bash
# Check Supabase connection
supabase status

# Manual type generation
npm run types:generate:local

# Clear cache and retry
rm -rf lib/types/*.ts
npm run types:generate:local
```

### **Migration Issues**

```bash
# Reset local database if corrupted
supabase db reset

# Re-apply all migrations
supabase migration up

# Regenerate types after reset
npm run types:generate:local
```

### **Function Development Issues**

```bash
# Check function logs
npm run functions:logs

# Restart functions server
supabase functions serve --env-file .env.local --debug
```

## 🎉 **Success Indicators**

Your workflow integration is working correctly when:

- ✅ **Local Supabase starts** without errors
- ✅ **Types generate** from your schema
- ✅ **Hot reloading** updates types automatically
- ✅ **Edge Functions** respond to requests
- ✅ **Migrations apply** cleanly
- ✅ **IntelliSense** shows your actual database schema
- ✅ **Real-time subscriptions** work in your app

## 🚀 **Production Deployment**

### **Edge Functions Deployment**

```bash
# Deploy all functions to production
supabase functions deploy

# Deploy specific function
supabase functions deploy load-notifications

# Set production environment variables
supabase secrets set WEBHOOK_SECRET=your-production-secret
```

### **Migration Deployment**

```bash
# Safe production deployment
npm run migrate
# Select option 6: "Deploy to Production"
# Includes dry-run and confirmation prompts
```

---

## 🎯 **Next Steps**

### **1. Start Development**

```bash
npm run dev:hot
# Select "Full Stack Development"
```

### **2. Set Up Your Schema**

```bash
npm run migrate
# Select "FleetFlow Schema Setup"
```

### **3. Generate Production Types**

```bash
# After setting up remote environments
npm run types:generate:prod
```

### **4. Deploy Functions**

```bash
npm run functions:deploy
```

**Your FleetFlow development workflow is now enterprise-ready with hot reloading, automatic type
generation, and seamless database management!** 🚛✨

---

## 📚 **Additional Resources**

- **Supabase Docs**: https://supabase.com/docs
- **Edge Functions Guide**: https://supabase.com/docs/guides/functions
- **PostGIS Documentation**: https://postgis.net/docs/
- **Next.js Integration**: https://nextjs.org/docs/app/building-your-application/data-fetching
