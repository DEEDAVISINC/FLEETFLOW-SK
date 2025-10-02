# 🚢 FleetFlow Lead Import System - Complete Guide

You now have **3 ways** to import leads into your China-USA DDP system:

## Method 1: Chrome Extension Scraper (🔥 Recommended)

### Installation

1. **Open Chrome Extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

2. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to `/Users/deedavis/FLEETFLOW/chrome-extension`
   - Click "Select"

3. **Verify Installation**
   - You should see the FleetFlow icon in your toolbar
   - Click it to open the popup

### Usage - On ImportYeti

1. **Log into ImportYeti**
   - Go to https://www.importyeti.com
   - Sign in with your account

2. **Search for Prospects**
   - Search for: "steel importers China"
   - Or: "aluminum importers from China"
   - Or: "metal importers China"

3. **Scrape the Results**
   - **Option A**: Click the floating "🚢 Scrape for FleetFlow" button on the page
   - **Option B**: Click the extension icon → "🎯 Scrape This Page"

4. **Data Auto-Syncs**
   - If FleetFlow is running (localhost:3001), data syncs automatically
   - Check the "FleetFlow Status" in the extension popup
   - If not connected, use "💾 Export as CSV" and upload manually

### What Gets Scraped

- Company Name
- Address, City, State, Zip
- Product Description
- Supplier Name (from China)
- Shipment Count
- Contact Info (if available)
- Estimated Monthly Containers

---

## Method 2: CSV Upload (📤 Manual Import)

### Where to Find It

1. Go to http://localhost:3001/depointe-dashboard
2. Click on "China → USA DDP" in the left navigation
3. Look for the **"📤 Upload CSV"** button in the top right

### CSV Format

Your CSV must have these columns (see `sample-import-template.csv`):

```csv
Company Name,Contact Name,Email,Phone,Product Description,Supplier Name,Supplier Country,Shipment Count,Estimated Monthly Containers
```

**Minimum Required:**

- Company Name
- Product Description

**Nice to Have:**

- Contact Name, Email, Phone
- Supplier Name
- Shipment Count
- Estimated Monthly Containers

### Example CSV

```csv
Company Name,Contact Name,Email,Product Description,Supplier Name,Shipment Count,Estimated Monthly Containers
"Global Steel Co","John Smith","john@globalsteel.com","Hot-rolled steel coils","Baosteel Group",35,4
"Pacific Aluminum","Sarah Chen","sarah@pacaluminum.com","Aluminum sheets","China Aluminum Corp",22,3
```

### How to Upload

1. **Prepare Your CSV**
   - Export from ImportYeti, trade databases, or create manually
   - Use the template: `chrome-extension/sample-import-template.csv`

2. **Click Upload CSV**
   - Select your file
   - Wait for "✅ Successfully imported X leads!"

3. **Leads Auto-Process**
   - Marcus Chen (AI staff) immediately takes over
   - Leads appear in the "Lead Generation Pipeline"
   - Automatic outreach begins within 60 seconds

---

## Method 3: API Integration (⚡ Advanced)

### Endpoint

```
POST http://localhost:3001/api/import-leads
```

### Request Body

```json
{
  "source": "api_integration",
  "companies": [
    {
      "name": "Global Steel Distributors LLC",
      "contactName": "John Smith",
      "email": "john@globalsteel.com",
      "phone": "+1-212-555-0101",
      "productDescription": "Hot-rolled steel coils",
      "supplierName": "Baosteel Group",
      "supplierCountry": "China",
      "shipmentCount": 35,
      "estimatedMonthlyContainers": 4
    }
  ]
}
```

### cURL Example

```bash
curl -X POST http://localhost:3001/api/import-leads \
  -H "Content-Type: application/json" \
  -d '{
    "source": "custom_integration",
    "companies": [
      {
        "name": "Test Company",
        "productDescription": "Steel products",
        "shipmentCount": 10
      }
    ]
  }'
```

---

## What Happens After Import

### 1. Immediate Processing ⚡

- Lead is created with a score (0-100)
- Marcus Chen is automatically assigned
- Activity logged: "📥 Lead imported"

### 2. Automated Outreach (Within 60s) 📧

Marcus sends personalized emails:

```
Subject: Reduce China import costs by 15-20%?

Hi [Contact],

I noticed [Company] imports [Product Category] from China.

With the 95% tariff on [steel/metal/aluminum], importers
are desperate for cost certainty.

We offer China-USA DDP service:
✅ One invoice (all costs included)
✅ One touchpoint (I manage everything)
✅ Reduced total cost (no surprise fees)
✅ 40HQ preferred - best for heavy products

Can we schedule 15 minutes to see if we can reduce
your total cost by 15-20%?

Best regards,
Marcus Chen
International Freight & Customs Specialist
```

### 3. Qualification (Automated) ✅

- High-score leads (85+) get prioritized
- Marcus monitors for responses
- Interested leads → "Qualified" status

### 4. Conversion to Inquiry 🎉

- Qualified leads → Active DDP Inquiry
- Marcus starts collecting "Big 5" data:
  1. Exact China pickup address
  2. Exact USA drop-off address
  3. Product HTS + description + picture
  4. Shipment timing
  5. Container quantity/type

### 5. Quote & Payment 💰

- Once Big 5 complete → Auto-quote generated
- First 3 months: Prepayment required
- After 3 months: NET-30/60 payment terms
- 40HQ containers preferred (best rates)

---

## Troubleshooting

### Chrome Extension Issues

**"FleetFlow Status: Not Running"**

```bash
cd /Users/deedavis/FLEETFLOW
npm run dev
```

**"No companies found"**

- Make sure you're on an ImportYeti **search results** page
- Try scraping a different page
- Check browser console for errors (F12)

**Extension won't install**

- Icons missing? See `chrome-extension/ICONS-README.txt`
- Temporarily comment out "icons" in `manifest.json`

### CSV Upload Issues

**"Error uploading CSV"**

- Check CSV format matches template
- Make sure first row is headers
- Remove any special characters in company names
- Ensure file is UTF-8 encoded

**Leads not appearing**

- Hard refresh the page (Cmd + Shift + R)
- Check browser console for errors
- Wait 5 seconds (data refreshes every 5s)

### API Issues

**"Failed to import leads"**

- Check server is running: `curl http://localhost:3001/api/health`
- Verify JSON format is correct
- Check server logs for errors

---

## Best Practices

### 1. Target High-Value Prospects

Focus on companies importing:

- **Steel** (95% tariff)
- **Metal** (95% tariff)
- **Aluminum** (95% tariff)

These companies are **desperate for savings**.

### 2. Import in Batches

- Start with 10-20 leads to test
- Review Marcus Chen's outreach
- Scale up to 50-100 leads per day

### 3. Monitor Lead Quality

Watch the stats:

- **Lead Score**: 85+ = hot prospects
- **Conversion Rate**: % of leads → inquiries
- **Response Rate**: Track in Marcus's activities

### 4. Regular ImportYeti Scraping

- Scrape daily/weekly
- New shipments = hot leads
- Companies with recent shipments are active buyers

---

## Data Privacy & Security

✅ **All data stays local**

- Chrome extension → Your computer → FleetFlow (localhost)
- No external servers involved

✅ **No credentials stored**

- Extension uses your existing ImportYeti session
- Never stores passwords or API keys

✅ **You control the data**

- Export CSVs anytime
- Delete leads from system
- Full transparency in activity logs

---

## Production Deployment Notes

When deploying to production (Digital Ocean):

1. **Update API endpoints** in Chrome extension:
   - Change `http://localhost:3001` → `https://fleetflowapp.com`

2. **Add proper icons**:
   - Replace placeholder icons with designed versions
   - See `chrome-extension/ICONS-README.txt`

3. **Database integration**:
   - Current: In-memory storage (resets on reload)
   - Production: Add PostgreSQL/Supabase persistence

4. **Rate limiting**:
   - Add rate limits to `/api/import-leads`
   - Prevent spam/abuse

5. **Authentication**:
   - Add API key auth for production
   - Protect endpoints with middleware

---

## Support

Issues? Check:

1. Server running? `http://localhost:3001/api/health`
2. Extension status? Click extension icon
3. Browser console? Press F12
4. Server logs? Check terminal running `npm run dev`

Need help? Check the code:

- Extension: `/chrome-extension/`
- API: `/app/api/import-leads/route.ts`
- Lead Service: `/app/services/DDPLeadGenerationService.ts`
- UI Component: `/app/components/ChinaUSADDPService.tsx`

---

## Quick Start Checklist

- [ ] Install Chrome extension
- [ ] Start FleetFlow: `npm run dev`
- [ ] Go to ImportYeti
- [ ] Search for "steel importers China"
- [ ] Click "🚢 Scrape for FleetFlow"
- [ ] Check dashboard for new leads
- [ ] Watch Marcus Chen work his magic! 🤖

🚀 **You're ready to automate lead generation!**
