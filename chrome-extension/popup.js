/**
 * FleetFlow ImportYeti Scraper - Popup Script
 */

document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Load saved data
  await loadStatus();

  // Setup button handlers
  document
    .getElementById('scrapeBtn')
    .addEventListener('click', scrapeCurrentPage);
  document.getElementById('syncBtn').addEventListener('click', syncToFleetFlow);
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);

  // Check FleetFlow connection
  checkFleetFlowConnection();
}

/**
 * Load status from storage
 */
async function loadStatus() {
  try {
    const data = await chrome.storage.local.get([
      'lastScrapeTime',
      'lastScrapeCount',
      'scrapedCompanies',
    ]);

    if (data.lastScrapeTime) {
      const date = new Date(data.lastScrapeTime);
      document.getElementById('lastScrape').textContent = formatTimeAgo(date);
    }

    if (data.lastScrapeCount) {
      document.getElementById('companyCount').textContent =
        data.lastScrapeCount;
    }

    // Enable sync button if we have data
    if (data.scrapedCompanies && data.scrapedCompanies.length > 0) {
      document.getElementById('syncBtn').disabled = false;
      document.getElementById('exportBtn').disabled = false;
    }
  } catch (error) {
    console.error('Error loading status:', error);
  }
}

/**
 * Check if FleetFlow is running
 */
async function checkFleetFlowConnection() {
  const statusEl = document.getElementById('fleetflowStatus');

  try {
    const response = await fetch('http://localhost:3001/api/health', {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });

    if (response.ok) {
      statusEl.textContent = '✅ Connected';
      statusEl.style.color = '#10b981';
    } else {
      throw new Error('Not running');
    }
  } catch (error) {
    statusEl.textContent = '❌ Not Running';
    statusEl.style.color = '#ef4444';
  }
}

/**
 * Scrape current page
 */
async function scrapeCurrentPage() {
  const btn = document.getElementById('scrapeBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Scraping...';

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url.includes('importyeti.com')) {
      showMessage('Please navigate to ImportYeti first', 'error');
      return;
    }

    // Send message to content script
    await chrome.tabs.sendMessage(tab.id, { action: 'scrape' });

    // Wait a bit for scraping to complete
    setTimeout(async () => {
      await loadStatus();
      showMessage('✅ Scraping complete!', 'success');
    }, 2000);
  } catch (error) {
    console.error('Scraping error:', error);
    showMessage(
      "❌ Error scraping page. Make sure you're on an ImportYeti search results page.",
      'error'
    );
  } finally {
    btn.disabled = false;
    btn.textContent = '🎯 Scrape This Page';
  }
}

/**
 * Sync data to FleetFlow
 */
async function syncToFleetFlow() {
  const btn = document.getElementById('syncBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Syncing...';

  try {
    const data = await chrome.storage.local.get(['scrapedCompanies']);

    if (!data.scrapedCompanies || data.scrapedCompanies.length === 0) {
      showMessage('No data to sync. Scrape a page first.', 'error');
      return;
    }

    const response = await fetch('http://localhost:3001/api/import-leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'importyeti_chrome_extension',
        companies: data.scrapedCompanies,
      }),
    });

    if (!response.ok) {
      throw new Error('Sync failed');
    }

    showMessage(
      `✅ Synced ${data.scrapedCompanies.length} companies to FleetFlow!`,
      'success'
    );

    // Clear synced data
    await chrome.storage.local.remove('scrapedCompanies');
    document.getElementById('companyCount').textContent = '0 (synced)';
  } catch (error) {
    console.error('Sync error:', error);
    showMessage(
      "❌ Could not connect to FleetFlow. Make sure it's running on localhost:3001",
      'error'
    );
  } finally {
    btn.disabled = false;
    btn.textContent = '📤 Sync to FleetFlow';
  }
}

/**
 * Export to CSV
 */
async function exportToCSV() {
  try {
    const data = await chrome.storage.local.get(['scrapedCompanies']);

    if (!data.scrapedCompanies || data.scrapedCompanies.length === 0) {
      showMessage('No data to export. Scrape a page first.', 'error');
      return;
    }

    // Convert to CSV
    const csv = convertToCSV(data.scrapedCompanies);

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `importyeti-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    showMessage(
      `✅ Exported ${data.scrapedCompanies.length} companies to CSV!`,
      'success'
    );
  } catch (error) {
    console.error('Export error:', error);
    showMessage('❌ Error exporting CSV', 'error');
  }
}

/**
 * Convert companies to CSV
 */
function convertToCSV(companies) {
  const headers = [
    'Company Name',
    'Address',
    'City',
    'State',
    'Zip Code',
    'Product Description',
    'Supplier Name',
    'Supplier Country',
    'Shipment Count',
    'Last Shipment Date',
    'Phone',
    'Email',
    'Website',
  ];

  const rows = companies.map((company) => [
    company.name,
    company.address,
    company.city,
    company.state,
    company.zipCode,
    company.productDescription,
    company.supplierName,
    company.supplierCountry,
    company.shipmentCount,
    company.lastShipmentDate,
    company.phone || '',
    company.email || '',
    company.website || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  return csvContent;
}

/**
 * Show message
 */
function showMessage(text, type = 'info') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';

  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 5000);
}

/**
 * Format time ago
 */
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
