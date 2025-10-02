# 🚢 FleetFlow Chrome Extension - Quick Start

## 30-Second Setup

1. **Install Extension**

   ```
   chrome://extensions/ → Enable Developer Mode → Load Unpacked
   → Select: /Users/deedavis/FLEETFLOW/chrome-extension
   ```

2. **Start FleetFlow**

   ```bash
   cd /Users/deedavis/FLEETFLOW
   npm run dev
   ```

3. **Go Scrape!**
   - Visit https://www.importyeti.com
   - Search: "steel importers China"
   - Click: "🚢 Scrape for FleetFlow" button

4. **Watch Magic Happen**
   - Go to http://localhost:3001/depointe-dashboard
   - Click "China → USA DDP"
   - See Marcus Chen processing leads automatically!

## What You Can Do

### 🎯 Option 1: Auto-Scrape (Chrome Extension)

- One-click scraping from ImportYeti
- Auto-syncs to FleetFlow
- Export to CSV if offline

### 📤 Option 2: CSV Upload

- Dashboard → "📤 Upload CSV" button
- Use template: `sample-import-template.csv`
- Drag & drop your lead list

### ⚡ Option 3: API Import

- POST to `/api/import-leads`
- See `LEAD-IMPORT-GUIDE.md` for details

## Icon Setup (Optional)

Extension works without icons, but if you want them:

1. Create 3 PNG files (any image editor):
   - icon16.png (16x16)
   - icon48.png (48x48)
   - icon128.png (128x128)

2. Use a ship emoji 🚢 on blue background

3. Save in: `/Users/deedavis/FLEETFLOW/chrome-extension/`

Or skip this - extension works fine without!

## Test It Works

1. **Health Check**

   ```bash
   curl http://localhost:3001/api/health
   ```

   Should return: `{"status":"ok"...}`

2. **Import Test**
   - Upload `sample-import-template.csv`
   - Should see: "✅ Successfully imported 5 leads!"

3. **Extension Test**
   - Click extension icon
   - "FleetFlow Status" should show: "✅ Connected"

## What Happens Next

Marcus Chen automatically:

- ✅ Scores each lead (0-100)
- ✅ Sends personalized outreach emails
- ✅ Qualifies interested companies
- ✅ Converts to DDP inquiries
- ✅ Collects "Big 5" data
- ✅ Generates quotes
- ✅ Manages payment

**You just focus on closing deals!** 🎉

---

Full documentation: `LEAD-IMPORT-GUIDE.md`
