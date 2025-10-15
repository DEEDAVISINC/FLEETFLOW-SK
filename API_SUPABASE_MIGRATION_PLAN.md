# FleetFlow API Supabase Migration & Testing Plan

## 🎯 Objective

Systematically test all APIs and migrate those that need Supabase database connections, WITHOUT
breaking existing functionality.

## ✅ Current Status Summary (as of testing)

### APIs Already Working with Supabase ✓

1. `/api/rfx-bids` - Full CRUD operations ✓
2. `/api/supabase-connection-test` - Connection verified ✓
3. `/api/notes` - Uses Supabase ✓
4. `/api/marketing/digital-strategy` - Connected ✓
5. `/api/crm/*` - CRM service uses Supabase ✓

### APIs Working with In-Memory Storage (No Migration Needed Yet) ✓

1. `/api/auth/register` - In-memory user storage, working perfectly ✓
2. `/api/auth/verify-email` - In-memory verification tokens, working ✓
3. `/api/auth/resend-verification` - Working ✓
4. `/api/auth/register-complete` - Working ✓

### APIs That Need Supabase Connection (Prioritized)

1. `/api/rfx-requests` - Has commented-out DB code
2. `/api/my-bids` - Has commented-out DB code
3. `/api/pallet-scans` - Needs DB integration
4. `/api/load-pallets` - Needs DB integration

---

## 📋 Phase 1: Testing All Existing APIs (Current Phase)

### Test Checklist

#### Authentication APIs

- [x] `/api/auth/register` - POST - ✅ WORKING (in-memory)
- [ ] `/api/auth/verify-email` - POST
- [ ] `/api/auth/resend-verification` - POST
- [ ] `/api/auth/register-complete` - POST

#### RFx/Bidding APIs

- [x] `/api/rfx-bids` - GET/POST/PATCH/DELETE - ✅ WORKING (Supabase)
- [ ] `/api/rfx-requests` - GET/POST
- [ ] `/api/my-bids` - GET/POST
- [ ] `/api/rfx-opportunities-with-notifications` - GET

#### CRM APIs

- [ ] `/api/crm` - GET (contacts)
- [ ] `/api/crm/companies` - GET/POST
- [ ] `/api/crm/activities` - GET/POST
- [ ] `/api/crm/opportunities` - GET/POST

#### Operations APIs

- [ ] `/api/pallet-scans` - GET/POST
- [ ] `/api/load-pallets` - GET/POST
- [ ] `/api/loads` - GET/POST
- [ ] `/api/dispatch` - POST

#### SAM.gov / Government Contracting

- [ ] `/api/sam-gov-search` - GET
- [ ] `/api/sam-gov-monitor` - GET
- [ ] `/api/solicitation` - GET

#### Integration APIs

- [ ] `/api/twilio-calls` - POST
- [ ] `/api/email/universal` - POST
- [ ] `/api/tracking` - GET

---

## 📋 Phase 2: SQL Schema Setup (Before Migration)

### Required Database Tables

#### 1. Auth Tables (Optional - can stay in-memory for now)

```sql
-- Only needed if we want persistent user accounts
-- Currently works fine with in-memory storage
-- See: scripts/auth-tables-schema.sql
```

#### 2. RFx & Bidding Tables (REQUIRED)

```sql
-- rfx_requests
-- bids
-- sam_gov_opportunities
-- See: scripts/rfx-bids-schema.sql
```

#### 3. Operations Tables (REQUIRED)

```sql
-- pallet_scans
-- load_pallets
-- See: scripts/rfx-bids-schema.sql
```

### Setup Instructions

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select FleetFlow project
   - Click "SQL Editor"

2. **Run Schema Files in Order**

   ```bash
   # 1. Run RFx schema first (contains required tables)
   scripts/rfx-bids-schema.sql

   # 2. Optional: Run auth schema if moving away from in-memory
   scripts/auth-tables-schema.sql
   ```

3. **Verify Tables Created**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

---

## 📋 Phase 3: API Migration (ONE AT A TIME)

### Migration Process for Each API

#### Step 1: Test Current State

```bash
# Test the API endpoint BEFORE changes
curl -X GET http://localhost:3001/api/[endpoint]
curl -X POST http://localhost:3001/api/[endpoint] -H "Content-Type: application/json" -d '{...}'
```

#### Step 2: Create Supabase Connection

```typescript
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://nleqplwwothhxgrovnjw.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  return createClient(supabaseUrl, supabaseKey);
}
```

#### Step 3: Update Database Operations

```typescript
// OLD (commented out)
// const results = await db.table.find...

// NEW (Supabase)
const supabase = getSupabaseClient();
const { data, error } = await supabase
  .from('table_name')
  .select('*');
```

#### Step 4: Test After Changes

```bash
# Test the API endpoint AFTER changes
curl -X GET http://localhost:3001/api/[endpoint]
curl -X POST http://localhost:3001/api/[endpoint] -H "Content-Type: application/json" -d '{...}'
```

#### Step 5: Verify Data in Supabase

- Check Supabase Dashboard > Table Editor
- Confirm data is being saved/retrieved correctly

---

## 🚀 Phase 4: Priority Migration Order

### Priority 1: RFx Requests & My Bids (HIGH)

**Why:** Core business logic, users expect these to persist

1. `/api/rfx-requests`
   - Table: `rfx_requests` (already defined in schema)
   - Current: Returns empty array
   - Target: Full CRUD with Supabase

2. `/api/my-bids`
   - Table: `bids` (already defined in schema)
   - Current: Returns empty array
   - Target: Full CRUD with Supabase

### Priority 2: Pallet Scans & Load Pallets (MEDIUM)

**Why:** Operational features, less frequently used

3. `/api/pallet-scans`
   - Table: `pallet_scans` (already defined in schema)
   - Current: Needs implementation
   - Target: Full CRUD with Supabase

4. `/api/load-pallets`
   - Table: `load_pallets` (already defined in schema)
   - Current: Needs implementation
   - Target: Full CRUD with Supabase

### Priority 3: Auth System Migration (LOW/OPTIONAL)

**Why:** Currently working perfectly with in-memory storage

- Only migrate if:
  - Need persistent user accounts across server restarts
  - Multiple users need to access the system
  - Production deployment requires it

---

## 🧪 Testing Commands

### Quick Test Suite

```bash
# 1. Test Supabase Connection
curl http://localhost:3001/api/supabase-connection-test

# 2. Test Auth Registration (in-memory)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","name":"Test User","email":"test@example.com","password":"Password123!","phone":"555-1234","companyName":"Test Co","position":"Manager","department":"Ops","selectedPlan":"starter","agreeToTerms":true}'

# 3. Test RFx Bids (Supabase)
curl http://localhost:3001/api/rfx-bids

# 4. Test RFx Requests (needs migration)
curl http://localhost:3001/api/rfx-requests

# 5. Test My Bids (needs migration)
curl http://localhost:3001/api/my-bids
```

---

## ⚠️ Critical Rules

1. **NEVER modify working APIs without testing first**
2. **ALWAYS revert changes if something breaks**
3. **TEST before and after every change**
4. **ONE API at a time - no batch migrations**
5. **Keep in-memory systems if they work perfectly**
6. **Document every change and test result**

---

## 📊 Progress Tracking

### APIs Tested

- [x] `/api/auth/register` - ✅ Working (in-memory)
- [x] `/api/rfx-bids` - ✅ Working (Supabase)
- [x] `/api/supabase-connection-test` - ✅ Working
- [ ] 47+ more APIs to test

### APIs Migrated to Supabase

- [x] `/api/rfx-bids` - ✅ Complete
- [x] `/api/notes` - ✅ Complete
- [x] `/api/marketing/digital-strategy` - ✅ Complete
- [x] `/api/crm/*` - ✅ Complete
- [ ] `/api/rfx-requests` - Pending
- [ ] `/api/my-bids` - Pending
- [ ] `/api/pallet-scans` - Pending
- [ ] `/api/load-pallets` - Pending

---

## 📝 Next Steps

1. **Complete Phase 1**: Test all 50+ APIs to see current status
2. **Setup Tables**: Run SQL schemas in Supabase
3. **Migrate Priority 1 APIs**: rfx-requests and my-bids
4. **Test thoroughly**: Verify each migration works
5. **Document results**: Update this file with findings

---

## 🔧 Rollback Plan

If any migration breaks:

```bash
# 1. Revert code changes
git checkout app/api/[endpoint]/route.ts

# 2. Test reverted version
curl http://localhost:3001/api/[endpoint]

# 3. Document what went wrong
# 4. Fix issue before trying again
```

---

## 📚 Resources

- Supabase Dashboard: https://supabase.com/dashboard
- SQL Schemas: `/scripts/*.sql`
- API Routes: `/app/api/`
- Documentation: This file

---

**Last Updated:** October 13, 2025 **Status:** Phase 1 - Testing in progress **Next Task:** Continue
systematic API testing



