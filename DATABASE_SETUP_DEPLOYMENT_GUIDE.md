# 🗄️ Database Setup Deployment Guide

## Production Deployment - Supabase Database Configuration

---

## 🎯 **DATABASE SETUP OVERVIEW:**

**FleetFlow uses Supabase (PostgreSQL) with:**

- ✅ Environment-aware configuration (dev/staging/production)
- ✅ Row Level Security (RLS) policies
- ✅ Real-time subscriptions
- ✅ Database webhooks
- ✅ Automatic failover and reconnection

---

## 📊 **PHASE 1: DATABASE SCHEMA SETUP**

### **1. Supabase Project Setup**

```bash
# If not already done:
# 1. Create Supabase account at https://app.supabase.com
# 2. Create new project: fleetflow-production
# 3. Note your project URL and API keys
# 4. Add to .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **2. Database Schema Creation**

```bash
# Run the schema setup:
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Run the contents of: supabase-schema.sql
# 3. Creates all necessary tables:
#    - loads, drivers, vehicles, users, customers
#    - brokers, carriers, quotes, documents
#    - system tables for workflows and tracking
```

### **3. Row Level Security (RLS) Setup**

```bash
# Run RLS policies:
# 1. In Supabase SQL Editor, run: scripts/supabase-rls-setup.sql
# 2. Enables department-based access control
# 3. Company isolation for multi-tenant support
# 4. User role-based permissions
```

---

## 🌱 **PHASE 2: DATA SEEDING**

### **4. Initial Data Seeding**

```bash
# Seed database with sample data:
npm run seed

# Alternative manual seeding:
node scripts/seed-supabase.js

# Expected results:
# ✅ Sample drivers created
# ✅ Sample loads inserted
# ✅ Sample vehicles added
# ✅ Test users created
# ✅ Sample customers added
```

### **5. Test User Creation**

```bash
# Creates demo users for testing:
# 1. Admin user: admin@fleetflow.com
# 2. Dispatcher: dispatcher@fleetflow.com
# 3. Driver: driver@fleetflow.com
# 4. Broker: broker@fleetflow.com
# 5. Manager: manager@fleetflow.com

# Each with appropriate role-based permissions
```

### **6. Sample Data Verification**

```bash
# Check seeded data in Supabase Dashboard:
# 1. Go to Table Editor
# 2. Verify tables have sample data:
#    - drivers: 3+ sample drivers
#    - loads: 5+ sample loads
#    - vehicles: 3+ sample vehicles
#    - users: 5+ test users with different roles
#    - customers: Multiple sample customers
```

---

## 🔐 **PHASE 3: SECURITY & PERMISSIONS**

### **7. Row Level Security Validation**

```bash
# Test RLS policies:
# 1. Login as different user types
# 2. Verify data access restrictions:
#    - Dispatchers see only their assigned loads
#    - Drivers see only their assigned loads
#    - Brokers see company-specific data
#    - Managers see all data
# 3. Test data modification permissions
```

### **8. Database Backup Strategy**

```bash
# Configure automated backups:
# 1. Supabase provides automated backups
# 2. Configure backup retention (7-30 days)
# 3. Test backup restoration process
# 4. Document emergency restoration procedures
```

### **9. Performance Optimization**

```bash
# Database performance setup:
# 1. Create necessary indexes (included in schema)
# 2. Configure connection pooling
# 3. Set appropriate timeout values
# 4. Monitor query performance
```

---

## 🔗 **PHASE 4: REAL-TIME & WEBHOOKS**

### **10. Real-time Subscriptions**

```bash
# Enable real-time features:
# 1. Run: scripts/supabase-webhooks-setup.sql
# 2. Creates database triggers for live updates
# 3. Configures real-time notifications
# 4. Sets up external integrations
```

### **11. Webhook Configuration**

```bash
# Database webhooks setup:
# 1. Configure webhook endpoints
# 2. Set up load status notifications
# 3. Enable real-time driver updates
# 4. Configure dispatch notifications
```

---

## 📋 **DETAILED SEEDING DATA:**

### **👤 TEST USERS CREATED:**

```sql
-- Admin Users
admin@fleetflow.com (password: admin123)
manager@fleetflow.com (password: manager123)

-- Operational Users
dispatcher@fleetflow.com (password: dispatch123)
broker@fleetflow.com (password: broker123)
driver@fleetflow.com (password: driver123)

-- DEPOINTE/FREIGHT 1ST DIRECT Users
ddavis@freight1stdirect.com (Owner)
dispatch@freight1stdirect.com (Dispatch)
invoice@freight1stdirect.com (Billing)
```

### **🚛 SAMPLE DRIVERS:**

```sql
-- Sample Drivers with Complete Profiles
John Smith (License: DL123456789) - Active
Sarah Johnson (License: DL987654321) - Active
Mike Wilson (License: DL456789123) - Inactive
Maria Santos (License: DL555666777) - Active
David Thompson (License: DL888999000) - Active
```

### **📦 SAMPLE LOADS:**

```sql
-- Sample Freight Loads
FL-2024-001: Chicago to Miami ($3,200)
FL-2024-002: Los Angeles to Dallas ($2,800)
FL-2024-003: New York to Atlanta ($2,400)
FL-2024-004: Houston to Phoenix ($3,600)
FL-2024-005: Denver to Seattle ($4,200)
```

### **🚐 SAMPLE VEHICLES:**

```sql
-- Sample Fleet Vehicles
2019 Freightliner Cascadia (VIN: 1FUJG...)
2020 Peterbilt 579 (VIN: 1XPH...)
2018 Kenworth T680 (VIN: 1XKY...)
2021 Volvo VNL (VIN: 4VG9...)
```

---

## 🧪 **DATABASE TESTING PROCEDURES:**

### **📊 FUNCTIONALITY TESTING:**

```bash
# Test database operations:
☐ User authentication and authorization
☐ Load creation and management
☐ Driver assignment workflows
☐ Real-time data updates
☐ Search and filtering functionality
☐ Data export/import capabilities
☐ Backup and restoration procedures
```

### **🔐 SECURITY TESTING:**

```bash
# Test security measures:
☐ RLS policies prevent unauthorized access
☐ User roles restrict data appropriately
☐ SQL injection protection working
☐ API rate limiting functional
☐ Data encryption at rest and in transit
☐ Audit logging captures changes
```

### **⚡ PERFORMANCE TESTING:**

```bash
# Test database performance:
☐ Query response times < 100ms average
☐ Real-time subscriptions update quickly
☐ Large dataset handling (1000+ records)
☐ Concurrent user access (10+ users)
☐ Connection pooling working efficiently
☐ Memory usage within acceptable limits
```

---

## 🚨 **TROUBLESHOOTING:**

### **🔧 COMMON ISSUES:**

#### **Connection Issues**

```bash
# Supabase connection problems:
# 1. Verify SUPABASE_URL and keys in .env.local
# 2. Check Supabase project status
# 3. Test network connectivity
# 4. Verify API key permissions
# 5. Check Supabase service status
```

#### **Schema Issues**

```bash
# Database schema problems:
# 1. Re-run supabase-schema.sql
# 2. Check for naming conflicts
# 3. Verify table creation permissions
# 4. Check for missing extensions
# 5. Review error messages in SQL Editor
```

#### **Seeding Issues**

```bash
# Data seeding problems:
# 1. Verify service role key permissions
# 2. Check for data conflicts (unique constraints)
# 3. Run seed script manually: node scripts/seed-supabase.js
# 4. Check table structures match seed data
# 5. Clear existing data if necessary
```

#### **RLS Issues**

```bash
# Row Level Security problems:
# 1. Verify RLS policies are enabled
# 2. Check policy logic and conditions
# 3. Test with different user roles
# 4. Review Supabase auth integration
# 5. Check user role assignments
```

---

## ✅ **DATABASE SETUP COMPLETION CHECKLIST:**

```
📊 DATABASE SCHEMA:
☐ Supabase project created and configured
☐ Database schema created (supabase-schema.sql)
☐ All tables created successfully
☐ Indexes and constraints in place
☐ Extensions enabled (uuid-ossp)

🌱 INITIAL DATA:
☐ Database seeded with initial data (npm run seed)
☐ Test users created (5 different roles)
☐ Sample loads/drivers/vehicles added
☐ Customer and broker data populated
☐ Sample workflow data created

🔒 SECURITY:
☐ Row Level Security (RLS) policies configured
☐ User access controls tested
☐ Department-based permissions verified
☐ Multi-tenant isolation working
☐ Data validation rules in place
☐ Backup strategy implemented

🔄 REAL-TIME & INTEGRATION:
☐ Real-time subscriptions configured
☐ Database webhooks set up
☐ External integrations tested
☐ Performance optimization applied
☐ Connection pooling configured

🧪 TESTING:
☐ All database operations tested
☐ Security measures validated
☐ Performance benchmarks met
☐ Error handling verified
☐ Backup/restore procedures tested
```

---

## 🚀 **DATABASE READY FOR PRODUCTION!**

**When all database setup items are checked:**

- ✅ Supabase database fully configured
- ✅ All tables and data structures created
- ✅ Sample data seeded for testing
- ✅ Security policies active and tested
- ✅ Real-time features operational
- ✅ Performance optimized
- ✅ Backup strategy implemented

**Database is production-ready! Next: Post-deployment verification and core functionality testing!**
🌐

