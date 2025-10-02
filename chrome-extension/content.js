/**
 * FleetFlow ImportYeti Scraper - Content Script
 *
 * Runs on ImportYeti pages and extracts company data
 */

console.log('🚢 FleetFlow ImportYeti Scraper loaded');

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // Add floating scrape button
  addScrapeButton();

  // Auto-detect if we're on a search results page
  if (isSearchResultsPage()) {
    console.log('📊 Search results page detected');
  }
}

/**
 * Check if we're on a search results page
 */
function isSearchResultsPage() {
  // Adjust selectors based on actual ImportYeti HTML structure
  return (
    document.querySelector('.search-results') ||
    document.querySelector('[class*="result"]') ||
    document.querySelector('table')
  );
}

/**
 * Add floating scrape button to page
 */
function addScrapeButton() {
  const button = document.createElement('button');
  button.id = 'fleetflow-scrape-btn';
  button.innerHTML = '🚢 Scrape for FleetFlow';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    padding: 12px 24px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    transition: all 0.2s;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)';
    button.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.6)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
  });

  button.addEventListener('click', scrapeCurrentPage);

  document.body.appendChild(button);
}

/**
 * Scrape company data from current page
 */
async function scrapeCurrentPage() {
  const button = document.getElementById('fleetflow-scrape-btn');
  button.innerHTML = '⏳ Scraping...';
  button.disabled = true;

  try {
    const companies = extractCompanies();

    if (companies.length === 0) {
      showNotification('No companies found on this page', 'error');
      return;
    }

    // Send to FleetFlow
    await sendToFleetFlow(companies);

    showNotification(`✅ Scraped ${companies.length} companies!`, 'success');
  } catch (error) {
    console.error('Scraping error:', error);
    showNotification('❌ Error scraping page', 'error');
  } finally {
    button.innerHTML = '🚢 Scrape for FleetFlow';
    button.disabled = false;
  }
}

/**
 * Extract company data from page
 * NOTE: These selectors need to be adjusted based on ImportYeti's actual HTML structure
 */
function extractCompanies() {
  const companies = [];

  // Try different table structures
  const rows = document.querySelectorAll(
    'table tr, [class*="result-row"], [class*="company-row"]'
  );

  rows.forEach((row, index) => {
    if (index === 0) return; // Skip header row

    try {
      const company = {
        id: `IY-SCRAPED-${Date.now()}-${index}`,
        name: extractText(
          row,
          '[class*="company-name"], [class*="importer"], td:nth-child(1)'
        ),
        address: extractText(row, '[class*="address"], td:nth-child(2)'),
        city: extractText(row, '[class*="city"]'),
        state: extractText(row, '[class*="state"]'),
        zipCode: extractText(row, '[class*="zip"]'),
        productDescription: extractText(
          row,
          '[class*="product"], [class*="description"], td:nth-child(3)'
        ),
        supplierName: extractText(row, '[class*="supplier"], td:nth-child(4)'),
        supplierCountry: 'China',
        shipmentCount:
          parseInt(extractText(row, '[class*="shipment"], [class*="count"]')) ||
          0,
        lastShipmentDate:
          extractText(row, '[class*="date"]') || new Date().toISOString(),
        estimatedMonthlyContainers: 0,
        phone: extractText(row, '[class*="phone"]'),
        email: extractText(row, '[class*="email"]'),
        website: extractText(row, '[class*="website"]'),
      };

      // Only add if we have at least a company name
      if (company.name && company.name.trim().length > 0) {
        companies.push(company);
      }
    } catch (error) {
      console.warn('Error extracting row:', error);
    }
  });

  return companies;
}

/**
 * Extract text from element using selectors
 */
function extractText(parent, selector) {
  try {
    const element = parent.querySelector(selector);
    return element ? element.textContent.trim() : '';
  } catch (error) {
    return '';
  }
}

/**
 * Send scraped data to FleetFlow
 */
async function sendToFleetFlow(companies) {
  // Store in Chrome storage for popup to access
  await chrome.storage.local.set({
    scrapedCompanies: companies,
    lastScrapeTime: new Date().toISOString(),
    lastScrapeCount: companies.length,
  });

  // Try to send directly to FleetFlow if it's running locally
  try {
    const response = await fetch('http://localhost:3001/api/import-leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'importyeti_chrome_extension',
        companies: companies,
      }),
    });

    if (!response.ok) {
      throw new Error('FleetFlow API error');
    }

    console.log('✅ Data sent to FleetFlow successfully');
  } catch (error) {
    console.log(
      '⚠️ Could not send to FleetFlow directly. Data saved for manual sync.'
    );
  }
}

/**
 * Show notification on page
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10001;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    scrapeCurrentPage();
    sendResponse({ success: true });
  }
  return true;
});
