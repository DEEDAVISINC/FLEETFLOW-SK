# 🚀 Install Chrome Extension - 2 Minutes

## Step 1: Open Chrome Extensions

1. Open Google Chrome
2. Type in address bar: `chrome://extensions/`
3. Press Enter

## Step 2: Enable Developer Mode

1. Look at the **top right** of the page
2. Find the toggle switch labeled **"Developer mode"**
3. **Click it** to turn it ON (should turn blue)

## Step 3: Load the Extension

1. Click the **"Load unpacked"** button (top left)
2. Navigate to: `/Users/deedavis/FLEETFLOW/chrome-extension`
3. Click **"Select"** or **"Open"**

## Step 4: Verify Installation

You should see:

- ✅ **FleetFlow ImportYeti Scraper** in your extensions list
- ✅ Status: "Errors" section is empty (no errors)
- ✅ Extension icon appears in Chrome toolbar (top right)

**Note:** If you see a warning about icons, that's OK - the extension works perfectly without them!

---

## ⚠️ Troubleshooting

### "Manifest file is missing or unreadable"

- Make sure you selected the `chrome-extension` folder itself
- Don't select individual files inside it

### "Unknown manifest version"

- Your Chrome is too old - update Chrome to latest version

### "Icons missing" warning

- This is OK! Extension works fine without icons
- Or create placeholder icons (see `ICONS-README.txt`)

---

## ✅ Test It Works

1. Go to https://www.importyeti.com
2. You should see:
   - 🚢 A floating "Scrape for FleetFlow" button on the page
3. Click the **extension icon** in Chrome toolbar
4. You should see:
   - FleetFlow Scraper popup
   - "FleetFlow Status: Checking..."

---

## 🎯 First Use

1. **Make sure FleetFlow is running:**

   ```bash
   cd /Users/deedavis/FLEETFLOW
   npm run dev
   ```

2. **Go to ImportYeti:**

   ```
   https://www.importyeti.com
   ```

3. **Search for prospects:**

   ```
   Search: "steel importers China"
   ```

4. **Click the floating button:**

   ```
   "🚢 Scrape for FleetFlow"
   ```

5. **Check your dashboard:**
   ```
   http://localhost:3001/depointe-dashboard
   → Click "China → USA DDP"
   → See new leads appear!
   ```

---

## 🔥 You're Ready!

The extension is now installed and will:

- ✅ Scrape ImportYeti search results
- ✅ Auto-sync to FleetFlow
- ✅ Feed Marcus Chen automation
- ✅ Export CSVs for backup

**Go find some leads!** 🚢
