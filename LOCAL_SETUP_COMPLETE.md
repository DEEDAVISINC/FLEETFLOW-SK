# ✅ FleetFlow Local Environment - Complete Database Setup

## ONE-TIME SETUP (Run Once)

### Step 1: Run the Complete Database SQL
Open your Supabase dashboard and run this SQL file:

```
scripts/complete-local-database.sql
```

This creates all tables you need:
- ✅ `marketing_campaigns` - Marketing campaigns
- ✅ `notes` - Notes and documentation  
- ✅ `documents` - File uploads and documents
- ✅ `vehicles` - Fleet vehicles
- ✅ `routes` - Route planning
- ✅ `tracking_updates` - GPS and tracking
- ✅ `notifications` - User notifications
- ✅ `messages` - Internal messaging
- ✅ `carriers` - Carrier management

### Step 2: Verify Database Connection
```bash
curl http://localhost:3001/api/supabase-connection-test
```

## FEATURES NOW WORKING WITH REAL DATABASE

### 1. Campaigns
```bash
# Create campaign
curl -X POST http://localhost:3001/api/marketing/digital-strategy \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_campaign",
    "data": {
      "name": "Q4 Marketing Push",
      "type": "Lead Generation",
      "budget": "10000",
      "platforms": ["LinkedIn", "Google Ads"]
    }
  }'

# Get campaigns
curl http://localhost:3001/api/marketing/digital-strategy
```

### 2. Notes
```bash
# Create note
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Important Reminder",
    "content": "Follow up with client tomorrow",
    "category": "Sales",
    "priority": "high"
  }'

# Get notes
curl http://localhost:3001/api/notes

# Update note
curl -X PUT "http://localhost:3001/api/notes?id=NOTE-123" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "content": "New content"}'

# Delete note
curl -X DELETE "http://localhost:3001/api/notes?id=NOTE-123"
```

### 3. Documents
*(API route ready - use similar pattern to notes)*

### 4. Vehicles
*(API route ready - use similar pattern to notes)*

### 5. Tracking
*(API route ready - use similar pattern to notes)*

## EXISTING DATABASE FEATURES

These already use real database:
- ✅ Loads (`loads` table)
- ✅ Drivers (`drivers` table)
- ✅ CRM Contacts (`crm_contacts` table)
- ✅ Organizations (`organizations` table)
- ✅ Users (Auth)

## HOW TO USE IN YOUR APP

### Example: Create a Note in Your UI
```typescript
const createNote = async (noteData) => {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData)
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('Note created:', result.note);
  }
};
```

### Example: Fetch Notes
```typescript
const getNotes = async () => {
  const response = await fetch('/api/notes');
  const result = await response.json();
  return result.notes;
};
```

## TROUBLESHOOTING

### "Table does not exist" Error
Run the SQL file: `scripts/complete-local-database.sql`

### "Permission denied" Error  
Check your Supabase API keys in `.env.local`

### Data Not Saving
1. Check browser console for errors
2. Test API with curl commands above
3. Verify Supabase connection

## WHAT'S DIFFERENT NOW?

### BEFORE:
❌ Data in localStorage (browser only)
❌ Data lost on browser clear
❌ No sync across devices
❌ Mock data in API routes

### NOW:
✅ Data in Supabase (persistent)
✅ Data survives browser clears
✅ Syncs across all devices
✅ Real database queries
✅ Production-ready architecture

## ENVIRONMENT VARIABLES

Make sure `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://nleqplwwothhxgrovnjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## YOUR LOCAL IS NOW PRODUCTION-READY! 🚀

Everything you do locally now saves to real database, just like production!

