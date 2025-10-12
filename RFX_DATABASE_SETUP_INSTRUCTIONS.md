# RFx Bid Tracking Database Setup

## 🎯 Issue
When you click "Save Draft", the bid isn't showing up in "My Bids" because the database table doesn't exist yet.

## ✅ Solution
Run the SQL schema to create the `rfx_bid_responses` table in your Supabase database.

## 📋 Steps to Fix

### 1. Open Supabase SQL Editor
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your FleetFlow project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### 2. Copy & Run the SQL Schema
1. Open the file: `/Users/deedavis/FLEETFLOW/scripts/rfx-bid-tracking-schema.sql`
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** (or press Cmd+Enter / Ctrl+Enter)

### 3. Verify the Table Was Created
Run this query to confirm:
```sql
SELECT * FROM rfx_bid_responses LIMIT 1;
```

You should see an empty result (no rows), which means the table exists!

### 4. Test the Save Draft Feature
1. Go back to FleetFlow: `http://localhost:3001/freightflow-rfx`
2. Upload an RFx document and generate a bid response
3. Click **"💾 Save Draft"**
4. You should see: ✅ Bid saved successfully! ID: [uuid]
5. Check the **"My Bids"** tab - your saved draft should appear!

## 📊 What This Creates

The schema creates:
- ✅ `rfx_bid_responses` table - Stores all your bid drafts and sent bids
- ✅ `rfx_email_events` table - Tracks email delivery events
- ✅ `rfx_active_drafts` view - Quick view of pending drafts
- ✅ `rfx_pending_responses` view - Sent bids awaiting outcomes
- ✅ `rfx_outcome_summary` view - Win/loss analytics

## 🔍 Troubleshooting

If you still don't see saved bids after running the SQL:

1. **Check the browser console** (F12) for errors when clicking Save Draft
2. **Check the terminal logs** for database errors
3. **Verify Supabase connection**:
   - Make sure `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Hard refresh** the page (Cmd+Shift+R / Ctrl+F5)

## 📝 Next Steps

After setup, you'll be able to:
- 💾 Save bid drafts
- 📧 Send bids via email
- 📊 Track bid outcomes (won/lost)
- 📈 View analytics on your bid success rate
- ⏰ See deadlines for pending bids

