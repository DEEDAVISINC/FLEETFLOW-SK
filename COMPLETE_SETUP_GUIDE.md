# 🚀 FleetFlow Backend Setup - Complete Implementation Guide

## 🎯 **WHAT WE'RE BUILDING**

You already have:
- ✅ **Frontend:** Beautiful driver portal with load confirmations, photo upload, signatures
- ✅ **SMS:** Twilio integration working
- ✅ **UI:** Gold standard design with blue gradients

We're adding:
- 🗄️ **Database:** Supabase (PostgreSQL + Auth + Real-time)
- 📸 **File Storage:** Cloudinary (Photos + Signatures)
- 🔗 **Integration:** Connect everything together

**Total time: ~1 hour**
**Total cost: $0/month (free tiers)**

---

## 📋 **STEP 1: SUPABASE SETUP (15 minutes)**

### **1.1 Create Supabase Account**
```bash
# Go to: https://supabase.com
# Click "Start your project"
# Sign up with GitHub (recommended)
# Create new organization: "FleetFlow"
```

### **1.2 Create FleetFlow Project**
```bash
# In Supabase dashboard:
# Click "New project"
# Name: "fleetflow-production"
# Database password: Use a strong password (save it!)
# Region: Choose closest to your users (US East recommended)
# Pricing: Free tier
# Click "Create new project"
# Wait 2-3 minutes for setup
```

### **1.3 Get Your Credentials**
```bash
# After project is created, go to:
# Settings > API

# Copy these 3 values:
PROJECT_URL=https://your-project-ref.supabase.co
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **1.4 Create Database Tables**
```sql
-- Go to Supabase Dashboard > SQL Editor
-- Click "New query" and paste this entire script:

-- Create sequences for auto-incrementing IDs
CREATE SEQUENCE IF NOT EXISTS driver_seq START 1;
CREATE SEQUENCE IF NOT EXISTS load_seq START 1;
CREATE SEQUENCE IF NOT EXISTS confirmation_seq START 1;
CREATE SEQUENCE IF NOT EXISTS delivery_seq START 1;
CREATE SEQUENCE IF NOT EXISTS file_seq START 1;
CREATE SEQUENCE IF NOT EXISTS notification_seq START 1;

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id TEXT PRIMARY KEY DEFAULT 'DRV-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('driver_seq')::TEXT, 3, '0'),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE NOT NULL,
    license_number TEXT NOT NULL,
    assigned_truck_id TEXT,
    dispatcher_id TEXT DEFAULT 'DSP-001',
    dispatcher_name TEXT DEFAULT 'Sarah Johnson',
    dispatcher_phone TEXT DEFAULT '+15559876543',
    dispatcher_email TEXT DEFAULT 'sarah.johnson@fleetflow.com',
    current_location TEXT DEFAULT 'Dallas, TX',
    eld_status TEXT DEFAULT 'Connected',
    hours_remaining DECIMAL(4,2) DEFAULT 8.5,
    auth_uid UUID REFERENCES auth.users(id), -- Link to Supabase auth
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loads table
CREATE TABLE IF NOT EXISTS loads (
    id TEXT PRIMARY KEY DEFAULT 'LD-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('load_seq')::TEXT, 3, '0'),
    broker_name TEXT NOT NULL,
    dispatcher_id TEXT DEFAULT 'DSP-001',
    assigned_driver_id TEXT REFERENCES drivers(id),
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    distance TEXT,
    weight TEXT,
    equipment TEXT NOT NULL,
    status TEXT DEFAULT 'Available',
    pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Load confirmations
CREATE TABLE IF NOT EXISTS load_confirmations (
    id TEXT PRIMARY KEY DEFAULT 'CONF-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('confirmation_seq')::TEXT, 3, '0'),
    load_id TEXT NOT NULL REFERENCES loads(id),
    driver_id TEXT NOT NULL REFERENCES drivers(id),
    confirmed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    driver_signature TEXT, -- Base64 signature data
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries
CREATE TABLE IF NOT EXISTS deliveries (
    id TEXT PRIMARY KEY DEFAULT 'DEL-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('delivery_seq')::TEXT, 3, '0'),
    load_id TEXT NOT NULL REFERENCES loads(id),
    driver_id TEXT NOT NULL REFERENCES drivers(id),
    receiver_name TEXT,
    receiver_signature TEXT, -- Base64 signature data
    delivery_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files (photos and documents)
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY DEFAULT 'FILE-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('file_seq')::TEXT, 6, '0'),
    load_id TEXT REFERENCES loads(id),
    driver_id TEXT REFERENCES drivers(id),
    confirmation_id TEXT REFERENCES load_confirmations(id),
    delivery_id TEXT REFERENCES deliveries(id),
    file_type TEXT NOT NULL, -- 'confirmation_photo', 'pickup_photo', 'delivery_photo'
    file_url TEXT NOT NULL, -- Cloudinary URL
    cloudinary_id TEXT, -- Cloudinary public ID
    file_size INTEGER,
    metadata JSONB,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT 'NOTIF-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('notification_seq')::TEXT, 6, '0'),
    driver_id TEXT REFERENCES drivers(id),
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'load_assignment', 'dispatch_update', 'system_alert'
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO drivers (id, name, email, phone, license_number) VALUES 
('DRV-001', 'John Smith', 'john.smith@fleetflow.com', '+15551234567', 'CDL-TX-123456')
ON CONFLICT (id) DO NOTHING;

INSERT INTO loads (id, broker_name, assigned_driver_id, origin, destination, rate, distance, weight, equipment, status, pickup_date, delivery_date) VALUES 
('LD-2025-001', 'ABC Logistics', 'DRV-001', 'Dallas, TX', 'Atlanta, GA', 2500.00, '925 miles', '45,000 lbs', 'Dry Van', 'Assigned', '2025-07-03 08:00:00+00', '2025-07-05 17:00:00+00'),
('LD-2025-002', 'XYZ Freight', NULL, 'Houston, TX', 'Miami, FL', 3200.00, '1200 miles', '40,000 lbs', 'Refrigerated', 'Available', '2025-07-04 06:00:00+00', '2025-07-06 18:00:00+00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO notifications (driver_id, message, type) VALUES 
('DRV-001', 'New load assigned: LD-2025-001 - Dallas, TX to Atlanta, GA', 'load_assignment'),
('DRV-001', 'Dispatch Update: Please confirm pickup by 2:00 PM today', 'dispatch_update'),
('DRV-001', 'System Alert: ELD sync successful', 'system_alert')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (drivers can only see their own data)
CREATE POLICY "Drivers can view own profile" ON drivers
    FOR ALL USING (auth.uid() = auth_uid OR auth_uid IS NULL);

CREATE POLICY "Drivers can view assigned loads" ON loads
    FOR ALL USING (assigned_driver_id IN (
        SELECT id FROM drivers WHERE auth_uid = auth.uid()
    ) OR assigned_driver_id IS NULL);

CREATE POLICY "Drivers can manage own confirmations" ON load_confirmations
    FOR ALL USING (driver_id IN (
        SELECT id FROM drivers WHERE auth_uid = auth.uid()
    ));

CREATE POLICY "Drivers can manage own deliveries" ON deliveries
    FOR ALL USING (driver_id IN (
        SELECT id FROM drivers WHERE auth.uid() = auth_uid
    ));

CREATE POLICY "Drivers can manage own files" ON files
    FOR ALL USING (driver_id IN (
        SELECT id FROM drivers WHERE auth.uid() = auth_uid
    ));

CREATE POLICY "Drivers can view own notifications" ON notifications
    FOR ALL USING (driver_id IN (
        SELECT id FROM drivers WHERE auth.uid() = auth_uid
    ));
```

**Click "Run" to execute the script**

---

## 📋 **STEP 2: CLOUDINARY SETUP (10 minutes)**

### **2.1 Create Cloudinary Account**
```bash
# Go to: https://cloudinary.com
# Click "Sign up for free"
# Use same email as Supabase for consistency
# Choose "Developer" plan (free)
```

### **2.2 Get Cloudinary Credentials**
```bash
# After signup, go to Dashboard
# You'll see your credentials:

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

### **2.3 Configure Upload Presets**
```bash
# In Cloudinary Dashboard:
# Go to Settings > Upload
# Scroll down to "Upload presets"
# Click "Add upload preset"

# Create preset for FleetFlow:
Upload preset name: fleetflow_photos
Signing Mode: Unsigned
Folder: fleetflow
Transformation: 
  - Quality: auto
  - Format: auto
  - Width: 1200 (max)
  - Height: 900 (max)
  - Crop: limit

# Click "Save"
```

---

## 📋 **STEP 3: UPDATE YOUR FLEETFLOW PROJECT (15 minutes)**

### **3.1 Install Required Packages**

Let's install the necessary packages for Supabase and Cloudinary integration.

### **3.2 Update Environment Variables**

I'll help you add the new environment variables to connect Supabase and Cloudinary.

### **3.3 Create API Integration Layer**

I'll create the API services to connect your frontend to Supabase and Cloudinary.

### **3.4 Billing Environment Setup**

For enterprise billing features with Stripe and Bill.com integration, see the dedicated setup guide:

📋 **[BILLING_ENVIRONMENT_SETUP.md](./BILLING_ENVIRONMENT_SETUP.md)**

This includes:
- Stripe API configuration for subscription management
- Bill.com API setup for invoice processing  
- Environment variable configuration for both platforms
- Testing and production deployment instructions

---

**Ready to start? Let me know when you've completed Steps 1-2 (Supabase and Cloudinary setup) and I'll help you with Step 3!**

Or if you want, I can start implementing Step 3 right now while you set up the accounts. Just let me know your preference!
