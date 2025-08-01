# 🗄️ FleetFlow Supabase Setup Guide

## 🚨 Current Issue

The current Supabase configuration is using placeholder credentials that don't exist:

- **URL**: `https://nleqplwwothhxgrovnjw.supabase.co` (does not exist)
- **Key**: Placeholder key (invalid)

## ✅ Solution: Set Up Your Own Supabase Project

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `fleetflow-production`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (for admin operations)

### Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create loads table
CREATE TABLE loads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  load_number VARCHAR(50) NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  pickup_date DATE NOT NULL,
  delivery_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  rate DECIMAL(10,2) NOT NULL,
  weight VARCHAR(50),
  equipment VARCHAR(100) DEFAULT 'Dry Van',
  carrier_name VARCHAR(255),
  driver_name VARCHAR(255),
  broker_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  license_number VARCHAR(50),
  vehicle_id UUID REFERENCES vehicles(id),
  status VARCHAR(50) DEFAULT 'available',
  location JSONB,
  hours_of_service JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number VARCHAR(50) NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  vin VARCHAR(50),
  plate_number VARCHAR(20),
  equipment_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  driver_id UUID REFERENCES drivers(id),
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Allow public read access" ON loads FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON drivers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON vehicles FOR SELECT USING (true);
```

### Step 5: Test Your Setup

1. Restart your development server: `npm run dev`
2. Test the connection: `http://localhost:3001/api/supabase-connection-test`
3. Check the API status: `http://localhost:3001/api-status`

## 🔧 Alternative: Use Mock Data (Development Only)

If you want to continue development without Supabase, you can use the existing mock data:

```typescript
// In lib/database.ts, use mock data instead of Supabase
export const loadService = {
  async getAll(): Promise<DBLoad[]> {
    // Return mock data instead of Supabase query
    return mockLoads;
  }
  // ... other methods
};
```

## 📊 API Status Monitoring

After setup, monitor your APIs at:

- **Health Check**: `/api/health`
- **Supabase Test**: `/api/supabase-test`
- **Connection Test**: `/api/supabase-connection-test`
- **Deployment Status**: `/api/deployment-status`
- **API Dashboard**: `/api-status`

## 🚀 Production Deployment

For production deployment:

1. Set up environment variables in your hosting platform
2. Ensure HTTPS is enabled
3. Configure proper CORS settings
4. Set up database backups
5. Monitor API health regularly

## 📞 Support

If you need help with Supabase setup:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the API status dashboard
3. Check the connection test results
4. Verify environment variables are set correctly
