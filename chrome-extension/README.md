# FleetFlow ImportYeti Scraper Chrome Extension

Automatically scrape ImportYeti company data and sync it to your FleetFlow DDP Lead Generation
system.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder from your FleetFlow project
5. The extension icon should appear in your toolbar

## Usage

### Method 1: Auto-Scrape (Easiest)

1. Log into ImportYeti at https://www.importyeti.com
2. Search for companies (e.g., "steel importers China")
3. Click the floating "🚢 Scrape for FleetFlow" button on the page
4. Data automatically syncs to FleetFlow!

### Method 2: Extension Popup

1. Click the FleetFlow extension icon in your toolbar
2. Navigate to an ImportYeti search results page
3. Click "🎯 Scrape This Page" in the popup
4. Click "📤 Sync to FleetFlow" or "💾 Export as CSV"

## Features

- ✅ One-click scraping from ImportYeti search results
- ✅ Auto-sync to FleetFlow (if running on localhost:3001)
- ✅ CSV export for manual upload
- ✅ Shows connection status to FleetFlow
- ✅ Tracks scraping history

## Troubleshooting

**"FleetFlow Status: Not Running"**

- Make sure FleetFlow is running on `http://localhost:3001`
- Run `npm run dev` in your FleetFlow directory

**"No companies found"**

- Make sure you're on an ImportYeti search results page
- The page structure might have changed - check console for errors

**Data not syncing**

- Check that the API endpoint `/api/import-leads` is working
- Export as CSV and upload manually to FleetFlow

## Technical Details

- Extracts: Company name, address, product, supplier, shipment counts
- Storage: Uses Chrome's local storage
- Sync: POST to `http://localhost:3001/api/import-leads`
- Export: Downloads CSV file compatible with FleetFlow CSV uploader

## Security

- All data stays local (your computer + FleetFlow)
- No external servers
- Login credentials never stored
- Works with your existing ImportYeti session
