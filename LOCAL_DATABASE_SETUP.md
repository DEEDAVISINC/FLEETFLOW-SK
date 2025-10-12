# Local Database Setup for FleetFlow

This guide ensures EVERYTHING in your local environment works with real database persistence.

## Quick Setup

### 1. Run the Campaigns Table SQL

Open your Supabase dashboard and run this SQL:

```bash
scripts/campaigns-table.sql
```

### 2. Test Database Connection

```bash
curl http://localhost:3001/api/supabase-connection-test
```

### 3. Test Campaigns API

```bash
# Get campaigns
curl http://localhost:3001/api/marketing/digital-strategy

# Create a campaign
curl -X POST http://localhost:3001/api/marketing/digital-strategy \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_campaign",
    "data": {
      "name": "My First Campaign",
      "type": "Lead Generation",
      "status": "active",
      "budget": "5000",
      "startDate": "2025-10-15",
      "endDate": "2025-11-15",
      "platforms": ["LinkedIn", "Google Ads"]
    }
  }'
```

## What's Connected to Real Database

✅ **Campaigns** - `marketing_campaigns` table ✅ **CRM Contacts** - `crm_contacts` table ✅
**Loads** - `loads` table ✅ **Drivers** - `drivers` table ✅ **Organizations** - `organizations`
table

## Environment Variables

Make sure your `.env.local` has:

```
NEXT_PUBLIC_SUPABASE_URL=https://nleqplwwothhxgrovnjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## Troubleshooting

### Campaigns Not Saving

- Run `scripts/campaigns-table.sql` in Supabase
- Check your Supabase connection
- Check browser console for errors

### Other Features Not Working

- Check if the corresponding SQL table exists
- Look in `/scripts/` folder for SQL setup files
- Run the SQL in your Supabase dashboard

## Adding More Real Database Features

To convert any mock feature to real database:

1. Create SQL table in `/scripts/`
2. Update the API route in `/app/api/`
3. Add Supabase client connection
4. Replace mock data with database queries

**Your local environment now has full production-level functionality!**

